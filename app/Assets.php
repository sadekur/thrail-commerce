<?php
namespace Thrail\Commerce;

use Thrail\Commerce\Classes\Trait\Hookable;

class Assets {
    use Hookable;

    public function __construct() {
        $this->action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
        $this->action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
        $this->action( 'enqueue_block_assets', [ $this, 'enqueue_block_assets' ] );
        $this->action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_assets' ] );
    }

    public function enqueue_common_assets() {
        wp_enqueue_script(
            'thrail-commerce-admin-tailwind-script',
            THRAIL_COMMERCE_URL . 'build/tailwind.build.js',
            [],
            time(),
            true
        );
    }

    public function enqueue_block_assets() {
        wp_enqueue_script(
            'thrail-commerce-block-script',
            THRAIL_COMMERCE_URL . 'build/block.build.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor'],
            time(),
            true
        );
        // if( true || did_action( 'thrailcommerce_block/accordion' ) ) {
            wp_enqueue_script(
                'thrail-commerce-frontend-script',
                THRAIL_COMMERCE_ASSETS . '/js/frontend.js',
                ['jquery'],
                filemtime(THRAIL_COMMERCE_PATH . 'assets/js/frontend.js'),
                true
            );
        // }
        $this->enqueue_common_assets();

        wp_localize_script( 'thrail-commerce-block-script', 'THRAILCOMMERCE', [
            'activeBlocks' => get_active_blocks(),
        ] );

        if ( !is_admin() ) {
            wp_enqueue_style(
                'thrail-commerce-frontend-style',
                THRAIL_COMMERCE_ASSETS . '/css/frontend.css',
                [],
                filemtime( THRAIL_COMMERCE_PATH . 'assets/css/frontend.css' )
            );
        }
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_script(
            'thrail-commerce-frontend-script',
            THRAIL_COMMERCE_ASSETS . 'js/frontend.js',
            ['jquery'],
            filemtime(THRAIL_COMMERCE_PATH . 'assets/js/frontend.js'),
            true
        );
        wp_localize_script('thrail-commerce-frontend-script', 'THRAILCOMMERCE', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'adminurl' => admin_url(),
            'nonce'   => wp_create_nonce('thrail-commerce'),
            'error'   => __('Something went wrong', 'thrail-commerce'),
        ]);

        // Enqueue frontend styles
        wp_enqueue_style(
            'thrail-commerce-frontend-style',
            THRAIL_COMMERCE_ASSETS . '/css/frontend.css',
            [],
            filemtime(THRAIL_COMMERCE_PATH . 'assets/css/frontend.css')
        );
        $this->enqueue_common_assets();
    }

    public function enqueue_admin_assets() {
        wp_enqueue_script(
            'thrail-commerce-admin-script',
            THRAIL_COMMERCE_ASSETS . '/js/admin.js',
            ['jquery'],
            filemtime(THRAIL_COMMERCE_PATH . 'assets/js/admin.js'),
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
            filemtime(THRAIL_COMMERCE_PATH . 'assets/js/init.js'),
            true
        );

        wp_enqueue_script(
            'thrail-commerce-menu-script',
            THRAIL_COMMERCE_URL . 'build/admin.build.js',
            [],
            time(),
            true
        );

        wp_localize_script('thrail-commerce-admin-script', 'THRAILCOMMERCE', [
            'nonce'    => wp_create_nonce( 'wp_rest' ),
            'adminurl' => admin_url(),
            'ajaxurl'  => admin_url( 'admin-ajax.php' ),
            'apiurl'   => untrailingslashit( rest_url( 'thrail/v1' ) ),
            'error'    => __( 'Something went wrong', 'thrail-commerce' ),
        ]);

        wp_enqueue_style(
            'thrail-commerce-admin-style',
            THRAIL_COMMERCE_ASSETS . '/css/admin.css',
            [],
            filemtime(THRAIL_COMMERCE_PATH . 'assets/css/admin.css')
        );

        wp_enqueue_style(
            'thrail-commerce-init-style',
            THRAIL_COMMERCE_ASSETS . '/css/init.css',
            [],
            filemtime(THRAIL_COMMERCE_PATH . 'assets/css/init.css')
        );

        wp_enqueue_style(
            'jquery-ui',
            'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
            [],
            null
        );

        $this->enqueue_common_assets();
    }
}
