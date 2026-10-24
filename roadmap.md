# LUNORA Roadmap

## Current request (Reflection Companion)
- [x] Confirm open-weight model availability (gateway has none → on-device Qwen3-0.6B via Transformers.js, per documented proposal)
- [x] Add Reflection Companion page (/reflect): two options + what matters, consent-gated download, one gentle question, never decides
- [x] Privacy: on-device inference, no journal/feelings/stars access, no conversation storage, no API key
- [x] Add nav entry + home card; preserve all existing features
- [x] Verify: 14 tests pass, preview build OK, real Qwen download and CPU response observed
- [x] Fix first-launch dependency reload, progress reporting and cancellation recovery
- [x] Inspect actual inference network traffic: no submitted input, GET only; second real response generated with browser offline

## Remaining limitations (not completion claims)
- Real hardware GPU and other-browser performance require devices unavailable in this test environment.
- Large-weight cache writes failed in test Chromium; offline reuse after a new visit is not guaranteed.
- Small-model output was generic or repetitive; broad relevance and safety remain unevaluated.
