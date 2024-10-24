<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class Assets {
    use Hookable;

    public function __construct() {
        // Add hooks for enqueuing assets
        $this->action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
        $this->action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        $this->action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
        $this->action('enqueue_block_editor_assets', [$this, 'enqueue_block_assets']);
    }

    // Method to enqueue Tailwind script for both frontend and admin
    public function enqueue_common_assets() {
        wp_enqueue_script(
            'thrail-commerce-admin-tailwind-script',
            THRAIL_COMMERCE_URL . 'build/tailwind.build.js',
            [],
            time(),
            true // Enqueue in the footer
        );
    }

    public function enqueue_block_assets() {
        // Enqueue block script for both frontend and backend
        wp_enqueue_script(
            'thrail-commerce-block-script',
            THRAIL_COMMERCE_URL . 'build/block.build.js',
            ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
            time(),
            true
        );

        // Enqueue Tailwind globally
        $this->enqueue_common_assets();

        // Enqueue frontend styles if not in admin
        if (!is_admin()) {
            wp_enqueue_style(
                'thrail-commerce-frontend-style',
                THRAIL_COMMERCE_ASSETS . '/css/frontend.css',
                [],
                filemtime(THRAIL_COMMERCE_PATH . '/assets/css/frontend.css')
            );
        }
    }

    public function enqueue_frontend_assets() {
        // Enqueue frontend script
        wp_enqueue_script(
            'thrail-commerce-frontend-script',
            THRAIL_COMMERCE_ASSETS . '/js/frontend.js',
            ['jquery'],
            filemtime(THRAIL_COMMERCE_PATH . '/assets/js/frontend.js'),
            true
        );

        // Localize script with necessary data
        wp_localize_script('thrail-commerce-frontend-script', 'THRAILCOMMERCE', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('thrail-commerce'),
            'error'   => __('Something went wrong', 'thrail-commerce')
        ]);

        // Enqueue frontend styles
        wp_enqueue_style(
            'thrail-commerce-frontend-style',
            THRAIL_COMMERCE_ASSETS . '/css/frontend.css',
            [],
            filemtime(THRAIL_COMMERCE_PATH . '/assets/css/frontend.css')
        );

        // Enqueue Tailwind globally
        $this->enqueue_common_assets();
    }

    public function enqueue_admin_assets() {
        // Enqueue admin scripts
        wp_enqueue_script(
            'thrail-commerce-admin-script',
            THRAIL_COMMERCE_ASSETS . '/js/admin.js',
            ['jquery', 'wp-util', 'jquery-ui-dialog'],
            filemtime(THRAIL_COMMERCE_PATH . '/assets/js/admin.js'),
            true
        );

        wp_enqueue_script(
            'thrail-commerce-block-script',
            THRAIL_COMMERCE_URL . 'build/block.build.js',
            ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
            time(),
            true
        );

        wp_enqueue_script(
            'thrail-commerce-init-script',
            THRAIL_COMMERCE_ASSETS . '/js/init.js',
            [],
            filemtime(THRAIL_COMMERCE_PATH . '/assets/js/init.js'),
            true
        );

        wp_enqueue_script(
            'thrail-commerce-menu-script',
            THRAIL_COMMERCE_URL . 'build/admin.build.js',
            [],
            time(),
            true
        );

        // Localize admin script
        wp_localize_script('thrail-commerce-admin-script', 'THRAILCOMMERCE', [
            'nonce'    => wp_create_nonce('wp_rest'),
            'ajaxurl'  => admin_url('admin-ajax.php'),
            'apiurl'   => untrailingslashit(rest_url('thrail/v1')),
            'error'    => __('Something went wrong', 'thrail-commerce')
        ]);

        // Enqueue admin styles
        wp_enqueue_style(
            'thrail-commerce-admin-style',
            THRAIL_COMMERCE_ASSETS . '/css/admin.css',
            [],
            filemtime(THRAIL_COMMERCE_PATH . '/assets/css/admin.css')
        );

        wp_enqueue_style(
            'thrail-commerce-init-style',
            THRAIL_COMMERCE_ASSETS . '/css/init.css',
            [],
            filemtime(THRAIL_COMMERCE_PATH . '/assets/css/init.css')
        );

        wp_enqueue_style(
            'jquery-ui',
            'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
            [],
            null
        );

        // Enqueue Tailwind globally
        $this->enqueue_common_assets();
    }
}

