# Contributing

Thanks for contributing! Guiding principles:

- Keep mechanics pure (avoid mutating global state outside controlled functions).
- Make UI changes in `src/core/ui` and keep logic in `src/mechanics` or system modules.
- Add tests where applicable and keep changes minimal and focused.

How to add content:

1. Create or update modules under their respective folders.
2. Add module path to `registry.js`.
3. Update or add docs in `docs/modules/...` describing the new module.
4. Submit a PR with a short description and any relevant screenshots.
