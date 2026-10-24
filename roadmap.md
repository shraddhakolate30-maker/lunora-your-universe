# LUNORA Roadmap

## Current request (Reflection Companion)
- [x] Confirm open-weight model availability (gateway has none → on-device Qwen3-0.6B via Transformers.js, per documented proposal)
- [x] Add Reflection Companion page (/reflect): two options + what matters, consent-gated download, one gentle question, never decides
- [x] Privacy: on-device inference, no journal/feelings/stars access, no conversation storage, no API key
- [x] Add nav entry + home card; preserve all existing features
- [ ] Verify: tests, build, browser flow incl. real model download + generation
- [ ] Fix first-launch dependency reload, progress reporting and cancellation recovery
- [ ] Inspect actual inference network traffic for submitted input
