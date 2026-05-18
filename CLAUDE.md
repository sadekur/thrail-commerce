# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build    # Webpack production build → build/
npm run watch    # Webpack watch mode for development
npm run start    # Webpack dev server on port 9000 (not used in WordPress context)
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

**Known bug in `register_route()`:** the `permission_callback` key has a trailing space (`'permission_callback '`) when remapped from `'permission'`, so the `permission` shorthand silently fails. Always use `permission_callback` directly in the `$args` array.

### Core Classes (instantiated in `init_plugin()`)

| Class | Purpose |
|---|---|
| `Assets` | Enqueues all scripts/styles for admin, frontend, and blocks |
| `Email` | Email-related hooks |
| `API` | Registers all REST routes under `commerce-kit/v1` |
| `Common\Init` | Injects shared modal HTML into `<head>` |
| `Blocks` | Registers Gutenberg blocks conditionally from `commerce_kit_block_settings` option |
| `Features` | Loads feature plugins conditionally from `commerce_kit_settings` option |
| `Helper` | Shared utility hooks |
| `Admin` | Admin-only; instantiates `Admin\Menu` |
| `Ajax` | Only instantiated when `DOING_AJAX` is true |

### WordPress Options Reference

| Option key | Purpose |
|---|---|
| `commerce_kit_settings` | Feature enable/disable toggles (`'on'`/`'off'`) |
| `commerce_kit_block_settings` | Block enable/disable toggles |
| `commerce_kit_stock_threshold` | Stock threshold config (merged with defaults from `commercekit_get_stock_settings()`) |
| `commercekit-tips-settings` | WooCommerce tips UI settings |

### Features System

Features live in `features/<kebab-name>/<kebab-name>.php` and are loaded by `app/Features.php` on the `init` hook only when the matching key is `'on'` in `commerce_kit_settings`. The class name is derived by converting the **directory name** (not the settings key) to PascalCase — these differ for `woocommerce-product-barcode` (directory) vs `woocommerce-product_barcode` (settings key).

**The feature class constructor is only called when the feature is enabled** — no guard needed inside the class itself.

Current features: `woocommerce-tips`, `woocommerce-faq`, `woocommerce-product-barcode`, `buy-button-for-woocommerce`, `stock-threshold-for-wc`.

### Admin Menu

`app/Admin/Menu.php` registers the admin menu via `admin_menu`. Submenu pages added conditionally based on `commerce_kit_settings`. Submenu pages that link into the React SPA use a hash-suffixed slug (e.g. `commerce-kit#/stock-threshold`) and render `<div id="commerce_kit_render"></div>` — the SPA takes over from there.

### Blocks System

Gutenberg blocks live in `blocks/<block-name>/` with `block.json`, `index.js`, `edit.js`, `render.php`. Blocks register only when their key is `'on'` in `commerce_kit_block_settings`. All block editor JS compiles from `blocks/App.jsx` → `build/block.build.js`.

Current blocks: `accordion`, `category-products-slider`, `generic-faq`, `variant-faq`.

### REST API

Namespace: `commerce-kit/v1`. All routes registered in `app/API.php`. Handler classes live in `app/API/`.

Current endpoints:
- `GET /get-settings`, `POST /post-settings` — plugin feature toggles
- `GET /get-block-register`, `POST /block-register-save` — block enable/disable
- `GET /get-tips`, `POST /save-tips` — WooCommerce tips
- `GET /get-stock-threshold`, `POST /save-stock-threshold` — stock threshold config
- `GET /get-variation-stock` — variation stock data (public, no auth required)

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
- `spa/admin/src/common/` — primitive field components used inside page JSX: `Toggle`, `Pill`, `NumberField`
- `spa/admin/common/` — page-level layout components: `CommonHeader`, `SectionHeader`, `Skeletons/`, `Svgs`, `Toggle`, `Pill`, `NumberField`, `CheckboxField`, `InputRow`, `FieldRow`

### COMMERCEKIT JS Global

Localized differently per context:
- **Admin** (`commerce-kit-admin-script`): `nonce` (wp_rest), `adminurl`, `ajaxurl`, `apiurl` (REST base), `settings_data` (feature toggles object)
- **Frontend** (`commerce-kit-frontend-script`): `nonce` (commerce-kit), `adminurl`, `ajaxurl`, `resturl` (REST base), `error`

### Asset Versioning Convention

- Admin scripts: `time()` (always cache-bust)
- Frontend scripts: `filemtime()` (cache-bust on file change only)

### WooCommerce Blocks Checkout Compatibility

WooCommerce Blocks checkout renders its order summary via the Store API (`/wc/store/v1/cart`) — a REST request. In that context `is_checkout()` and `is_cart()` both return `false`. When writing filters that should apply to the Blocks checkout (e.g. `woocommerce_cart_item_name`), also allow the request when `defined('REST_REQUEST') && REST_REQUEST`:

```php
$is_store_api = defined( 'REST_REQUEST' ) && REST_REQUEST;
if ( ! is_cart() && ! is_checkout() && ! $is_store_api ) {
    return $value;
}
```
