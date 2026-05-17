# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build    # Webpack production build → build/
npm run watch    # Webpack watch mode for development
composer install # Install PHP dependencies (PSR-4 autoloader)
```

No test suite configured.

## Architecture Overview

CommerceKit is a WooCommerce enhancement plugin. Entry point is `commercekit.php`, which boots the singleton `COMMERCE_KIT` class and registers all core classes on the `plugins_loaded` hook.

### PHP Namespace & Autoloading

PSR-4 via Composer:
- `CommerceKit\Commerce\` → `app/`
- `CommerceKit\Commerce\Classes\` → `classes/`
- Global helpers → `includes/functions.php` (autoloaded via `composer.json` `files`)

### Hookable Trait

`classes/Trait/Hookable.php` provides `$this->action()`, `$this->filter()`, `$this->add_shortcode()`, and `$this->register_route()`. Every class that needs WordPress hooks or REST routes must `use Hookable` — never call `add_action`/`add_filter`/`register_rest_route` directly.

### Core Classes (instantiated in `init_plugin()`)

| Class | Purpose |
|---|---|
| `Assets` | Enqueues all scripts/styles for admin, frontend, and blocks |
| `API` | Registers all REST routes under `commerce-kit/v1` |
| `Blocks` | Registers Gutenberg blocks conditionally from `commerce_kit_block_settings` option |
| `Features` | Loads feature plugins conditionally from `commerce_kit_settings` option |
| `Common\Init` | Injects shared modal HTML into `<head>` |
| `Admin` | Admin-only; instantiates `Admin\Menu` |
| `Ajax` | Only instantiated when `DOING_AJAX` is true |

### Features System

Features live in `features/<kebab-name>/<kebab-name>.php` and are loaded by `app/Features.php` on the `init` hook only when the matching key is `'on'` in the `commerce_kit_settings` WordPress option. Each feature file must declare `CommerceKit\Commerce\Features\<PascalCase>` and `use Hookable`. The class name is derived automatically by converting the kebab directory name to PascalCase.

**The feature class constructor is only called when the feature is enabled** — no need for a feature-enabled guard inside the class itself.

Current features: `woocommerce-tips`, `woocommerce-faq`, `woocommerce-product-barcode`, `buy-button-for-woocommerce`, `stock-threshold-for-wc`.

### Admin Menu

`app/Admin/Menu.php` registers the admin menu via `admin_menu`. Submenu pages are added conditionally based on `commerce_kit_settings`. Submenu pages that link into the React SPA use a hash-suffixed slug (e.g. `commerce-kit#/stock-threshold`) and render `<div id="commerce_kit_render"></div>` — the SPA takes over from there.

### Blocks System

Gutenberg blocks live in `blocks/<block-name>/` with `block.json`, `index.js`, `edit.js`, `render.php`. Blocks register only when their key is `'on'` in `commerce_kit_block_settings`. All block editor JS compiles from `blocks/App.jsx` → `build/block.build.js`.

### REST API

Namespace: `commerce-kit/v1`. All routes registered in `app/API.php`. Handler classes live in `app/API/`.

Current endpoints:
- `GET /get-settings`, `POST /post-settings` — plugin feature toggles
- `GET /get-block-register`, `POST /block-register-save` — block enable/disable
- `GET /get-tips`, `POST /save-tips` — WooCommerce tips
- `GET /get-stock-threshold`, `POST /save-stock-threshold` — stock threshold config
- `GET /` — variation stock data (public, no auth required)

### JavaScript / React SPA

Webpack entry points:
- `spa/admin/src/App.jsx` → `build/admin.build.js` — Admin React SPA
- `blocks/App.jsx` → `build/block.build.js` — Gutenberg block editor JS
- `spa/public/src/App.jsx` → `build/public.build.js` — Frontend React app
- `assets/css/tailwind.css` → `build/tailwind.build.js`

React, ReactDOM, and all `@wordpress/*` packages are **externals** — loaded from WordPress, not bundled.

The admin SPA mounts on `#commerce_kit_render` and uses **hash-based routing**. `App.jsx` switches on `window.location.hash`:
- `""` or `"/"` → `Tabs` (Feature / Blocks / Settings tabs)
- `"/stock-threshold"` → `StockThreshold` page

Tailwind scans `app/**/*.php` and `spa/**/src/**/*.jsx`.

### Shared Admin Components

Two component directories exist — choose the right one:
- `spa/admin/src/common/` — page-level components (`CommonHeader`, `SectionHeader`, `Skeletons/`, `Svgs`)
- `spa/admin/common/` — primitive field components (`Toggle`, `Pill`, `NumberField`, `CheckboxField`, `InputRow`, `FieldRow`)

### COMMERCEKIT JS Global

Localized differently per context:
- **Admin** (`commerce-kit-admin-script`): `nonce` (wp_rest), `adminurl`, `ajaxurl`, `apiurl` (REST base), `settings_data` (feature toggles object)
- **Frontend** (`commerce-kit-frontend-script`): `nonce` (commerce-kit), `adminurl`, `ajaxurl`, `resturl` (REST base), `error`

### Asset Versioning Convention

- Admin scripts: `time()` (always cache-bust)
- Frontend scripts: `filemtime()` (cache-bust on file change only)
