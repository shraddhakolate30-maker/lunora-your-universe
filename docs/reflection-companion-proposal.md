# Optional open-weight reflection companion

Status: proposed only, not integrated. No personal content is sent to AI today.

## Model and method
Use **Qwen3-0.6B**, an Apache-2.0 open-weight model, with the community ONNX conversion through **Transformers.js**. Load quantized `q4f16` weights only after a separate download consent step. Run inference in a browser Web Worker with WebGPU, with streamed replies and a cancel control. Pin and review the community conversion before implementation.

The companion would ask gentle, non-judgmental questions about text the user explicitly selects. It must never choose options, diagnose, or present itself as a therapist. The small model's quality, instruction-following, and safety require evaluation before enabling it.

## Privacy
Inference stays on the device; journal text is not sent to an inference service. Downloading the runtime and weights still contacts the asset host, exposing ordinary request metadata such as IP address. Model files may be cached locally. Do not load full journal history automatically. Provide consent, selected-text preview, clear-chat, and delete-model-cache controls.

## Compatibility and costs
The original weights are approximately 1.5 GB; the quantized download is smaller but its exact size must be confirmed from the pinned files. Expect significant first-load time and memory usage. Browser/WebGPU and device support vary, especially on mobile. No per-token fee for local inference, but hosting/bandwidth and the user's data allowance, memory and battery are real costs. Offer non-AI prompts when unsupported rather than silently sending content elsewhere.

A separately consented self-hosted open-weight service is an alternative, not a default. It transmits selected text to that server, so it needs privacy, retention and security review. CPU/GPU hosting, storage and network charges depend on hardware, provider, region, traffic and idle time; obtain a current quote before deployment. No paid closed-source API substitute.

## Implementation gate
Before claiming integration: verify model loading, local-only inference network behavior, useful gentle questions, refusal to make choices, cancellation, download consent, unsupported-device fallback, and performance on laptop/mobile hardware.

## Sources
- https://huggingface.co/Qwen/Qwen3-0.6B
- https://huggingface.co/Qwen/Qwen3-0.6B/blob/main/LICENSE
- https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX
- https://huggingface.co/docs/transformers.js/index
- https://huggingface.co/docs/transformers.js/en/guides/webgpu