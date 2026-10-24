/// <reference lib="webworker" />
import { AutoTokenizer, AutoModelForCausalLM, TextStreamer, env } from "@huggingface/transformers";
import { buildReflectionMessages, reflectionGpuDtype } from "./reflect";

env.allowLocalModels = false;

const MODEL_ID = "onnx-community/Qwen3-0.6B-ONNX";

type Tokenizer = Awaited<ReturnType<typeof AutoTokenizer.from_pretrained>>;
type Model = Awaited<ReturnType<typeof AutoModelForCausalLM.from_pretrained>>;

let tokenizer: Tokenizer | null = null;
let model: Model | null = null;
let loading = false;

function post(message: Record<string, unknown>) {
  (self as unknown as Worker).postMessage(message);
}

async function load() {
  if (model || loading) return;
  loading = true;
  const progress = (p: { status?: string; progress?: number; file?: string }) => {
    if (p.status === "progress") post({ type: "progress", progress: p.progress ?? 0, file: p.file ?? "" });
  };
  try {
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
    try {
      const gpu = (navigator as unknown as { gpu?: { requestAdapter(): Promise<{ features: { has(feature: string): boolean } } | null> } }).gpu;
      const adapter = await gpu?.requestAdapter();
      if (!adapter) throw new Error("WebGPU is unavailable.");
      model = await AutoModelForCausalLM.from_pretrained(MODEL_ID, {
        dtype: reflectionGpuDtype(adapter.features.has("shader-f16")),
        device: "webgpu",
        progress_callback: progress,
      });
      post({ type: "ready", device: "webgpu" });
    } catch {
      model = await AutoModelForCausalLM.from_pretrained(MODEL_ID, {
        dtype: "q4",
        device: "wasm",
        progress_callback: progress,
      });
      post({ type: "ready", device: "wasm" });
    }
  } catch (e) {
    post({ type: "error", stage: "load", detail: e instanceof Error ? e.message : String(e) });
  } finally {
    loading = false;
  }
}

async function generate(a: string, b: string, matters: string) {
  if (!tokenizer || !model) {
    post({ type: "error", stage: "generate", detail: "Model is not loaded yet." });
    return;
  }
  try {
    const messages = buildReflectionMessages(a, b, matters);
    const inputs = tokenizer.apply_chat_template(messages, {
      add_generation_prompt: true,
      return_dict: true,
      enable_thinking: false,
    } as Parameters<Tokenizer["apply_chat_template"]>[1]) as unknown as Record<string, unknown>;
    let text = "";
    const streamer = new TextStreamer(tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (t: string) => {
        text += t;
        post({ type: "token", text });
      },
    });
    await model.generate({
      ...inputs,
      max_new_tokens: 120,
      do_sample: true,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.1,
      streamer,
    } as Parameters<Model["generate"]>[0]);
    post({ type: "done", text: text.trim() });
  } catch (e) {
    post({ type: "error", stage: "generate", detail: e instanceof Error ? e.message : String(e) });
  }
}

self.onmessage = (e: MessageEvent) => {
  const d = e.data as { type?: string; a?: string; b?: string; matters?: string };
  if (d.type === "load") void load();
  if (d.type === "generate") void generate(d.a ?? "", d.b ?? "", d.matters ?? "");
};
