# AGENTS.md

## Build Commands

- `npm run build` — Webpack production build to `build/`
- `npm run watch` — Watch mode for development
- `npm run start` — Dev server on port 9000 (not used in WordPress context)

No test suite configured. `npm test` echoes an error.

## Architecture

WordPress plugin for WooCommerce. Requires PHP 7.4+, WooCommerce active.

### PHP

- Main entry: `thrail-commerce.php` (plugin bootstrap)
- PSR-4: `CommerceKit\Commerce\` → `app/`, `CommerceKit\Commerce\Classes\` → `classes/`
- Hookable trait at `classes/Trait/Hookable.php` — use `$this->action()` / `$this->filter()` instead of `add_action` / `add_filter`
- Features in `features/` load conditionally based on `commerce_kit_settings` option
- Blocks in `blocks/` register conditionally based on `commerce_kit_block_settings` option
- Each block: `block.json`, `index.js`, `edit.js`, `render.php`
- AJAX handled by `CommerceKit\Commerce\Ajax` — only instantiated when `DOING_AJAX` is defined

### JavaScript

Webpack entry points → build output:
- `spa/admin/src/App.jsx` → `build/admin.build.js`
- `blocks/App.jsx` → `build/block.build.js`
- `spa/public/src/App.jsx` → `build/public.build.js`
- `assets/css/tailwind.css` → `build/tailwind.build.js`

React, ReactDOM, and `@wordpress/*` packages are **externals** — loaded from WordPress, not bundled.

Tailwind scans: `app/**/*.php`, `spa/**/src/**/*.jsx`

## Conventions

- REST API namespace: `commerce-kit/v1`
- Admin scripts use `wp_create_nonce('wp_rest')` for REST; frontend uses `wp_create_nonce('commerce-kit')` for AJAX
- Block asset versioning: admin uses `time()`, frontend uses `filemtime()`
- Feature classes: kebab-case directory → `CommerceKit\Commerce\Features\PascalCase`
