# Optional open-weight reflection companion

Status: integrated on the optional /reflect page. Real Qwen3-0.6B download and browser-local CPU generation verified in Chromium on 2026-10-24. Submitted options are passed only to the browser worker; journal, feelings and stars are not accessed. Hardware GPU performance and cross-browser compatibility are not verified.

## Model and method
Uses **Qwen3-0.6B**, an Apache-2.0 open-weight model, with the community ONNX conversion through **Transformers.js**. Download is consent-gated. The worker chooses `q4f16` only on adapters supporting shader-f16, otherwise `q4`, with WASM CPU fallback. Streaming and cancellation are provided. The community conversion currently resolves main (observed revision 58ca03a5e7b354b480b1a82b34bde8dc7b854cc0); pinning and a wider safety review remain release-hardening work.

The companion is prompted to ask gentle, non-judgmental questions about explicitly submitted options. It is instructed never to choose options, diagnose, or present itself as a therapist. The verified response was generic: "How do you feel about your choice this year?" Broader relevance, instruction-following and safety evaluation remain necessary; prompt instructions are not guarantees.

## Privacy
Inference stays on the device; journal text is not sent to an inference service. Downloading runtime and weights contacts Hugging Face and jsDelivr, exposing ordinary request metadata such as IP address. No request contained test input and no non-GET requests occurred in the verified flow. Model caching is best-effort; Chromium reported a cache write warning for the large weights. Dedicated cache-deletion controls are not yet implemented, so guaranteed offline reuse on later visits is not claimed.

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