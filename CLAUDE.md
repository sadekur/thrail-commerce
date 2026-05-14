# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build    # Webpack production build → build/
npm run watch    # Webpack watch mode for development
npm run start    # Dev server on port 9000 (not used in WordPress context)
```

No test suite configured. PHP dependencies managed via Composer (`composer install`).

## Architecture Overview

CommerceKit is a WooCommerce enhancement plugin. Entry point is `commercekit.php`, which boots the singleton `COMMERCE_KIT` class that registers all core classes on the `plugins_loaded` hook.

### PHP Namespace & Autoloading

PSR-4 via Composer:
- `CommerceKit\Commerce\` → `app/`
- `CommerceKit\Commerce\Classes\` → `classes/`
- Global helpers → `includes/functions.php` (autoloaded)

### Hookable Trait

`classes/Trait/Hookable.php` provides `$this->action()`, `$this->filter()`, `$this->add_shortcode()`, and `$this->register_route()`. All classes that need WordPress hooks or REST routes should `use Hookable` — never call `add_action`/`add_filter`/`register_rest_route` directly.

### Core Classes (all instantiated in `init_plugin()`)

| Class | Purpose |
|---|---|
| `Assets` | Enqueues all scripts/styles for admin, frontend, and blocks |
| `API` | Registers all REST routes under `commerce-kit/v1` |
| `Blocks` | Registers Gutenberg blocks conditionally from `commerce_kit_block_settings` option |
| `Features` | Loads feature plugins conditionally from `commerce_kit_settings` option |
| `Common\Init` | Injects shared modal HTML into `<head>` |
| `Admin` | Admin-only; instantiates `Admin\Menu` |
| `Frontend\Stock_Threshold` | Frontend-only stock threshold display |
| `Ajax` | Only instantiated when `DOING_AJAX` is true |

### Features System

Features live in `features/<kebab-name>/<kebab-name>.php` and are gated by the `commerce_kit_settings` WordPress option. The feature key must be set to `'on'` to load. Each feature file must declare a class `CommerceKit\Commerce\Features\<PascalCase>` that `use Hookable`.

Current features: `woocommerce-tips`, `woocommerce-faq`, `woocommerce-product-barcode`, `buy-button-for-woocommerce`, `stock-threshold-for-wc`.

### Blocks System

Gutenberg blocks live in `blocks/<block-name>/` with `block.json`, `index.js`, `edit.js`, `render.php`. Blocks are registered only when enabled in the `commerce_kit_block_settings` option (`'on'`). All blocks are compiled from `blocks/App.jsx` → `build/block.build.js`.

### REST API

Namespace: `commerce-kit/v1`. All routes are registered in `app/API.php` by constructing handler classes inline. Handler classes live in `app/API/`.

Current endpoints:
- `GET/POST /get-settings`, `/post-settings` — plugin settings
- `GET/POST /get-block-register`, `/block-register-save` — block enable/disable
- `GET/POST /get-tips`, `/save-tips` — WooCommerce tips
- `GET/POST /get-stock-threshold`, `/save-stock-threshold` — stock threshold config
- `GET /get-variation-stock` — variation stock data

### JavaScript / React SPA

Webpack entry points:
- `spa/admin/src/App.jsx` → `build/admin.build.js` — Admin React SPA
- `blocks/App.jsx` → `build/block.build.js` — Gutenberg block editor JS
- `spa/public/src/App.jsx` → `build/public.build.js` — Frontend React app
- `assets/css/tailwind.css` → `build/tailwind.build.js`

React, ReactDOM, and all `@wordpress/*` packages are **externals** — loaded from WordPress, not bundled.

The admin SPA mounts on `#commerce_kit_render` and uses hash-based routing (`#/stock-threshold`, etc.). Shared admin components live in `spa/admin/src/common/` and `spa/admin/common/`.

Tailwind scans `app/**/*.php` and `spa/**/src/**/*.jsx`.

### Asset Versioning Convention

- Admin scripts: `time()` (always cache-bust during development)
- Frontend scripts: `filemtime()` (cache-bust only on file change)

### Nonce Convention

- Admin REST calls: `wp_create_nonce('wp_rest')` — localized as `COMMERCEKIT.nonce`
- Frontend AJAX calls: `wp_create_nonce('commerce-kit')` — localized as `COMMERCEKIT.nonce`
