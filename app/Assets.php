<?php
namespace CommerceKit\Commerce;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Assets {
    use Hookable;

    public function __construct() {
        $this->action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
        $this->action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
        $this->action( 'enqueue_block_assets', [ $this, 'enqueue_block_assets_func' ] );
        $this->action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_assets_func' ] );
    }

    public function enqueue_common_assets() {
        wp_enqueue_script(
            'commerce-kit-admin-tailwind-script',
            COMMERCE_KIT_URL . 'build/tailwind.build.js',
            [],
            time(),
            true
        );
    }

    public function enqueue_block_assets_func() {
        wp_enqueue_script(
            'commerce-kit-block-script',
            COMMERCE_KIT_URL . 'build/block.build.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor'],
            time(),
            true
        );
        // if( true || did_action( 'commercekit_block/accordion' ) ) {
            wp_enqueue_script(
                'commerce-kit-frontend-script',
                COMMERCE_KIT_ASSETS . '/js/frontend.js',
                ['jquery'],
                filemtime(COMMERCE_KIT_PATH . 'assets/js/frontend.js'),
                true
            );
        // }
        $this->enqueue_common_assets();

        wp_localize_script( 'commerce-kit-block-script', 'COMMERCEKIT', [
            'activeBlocks' => get_active_blocks(),
        ] );

        if ( !is_admin() ) {
            wp_enqueue_style(
                'commerce-kit-frontend-style',
                COMMERCE_KIT_ASSETS . '/css/frontend.css',
                [],
                filemtime( COMMERCE_KIT_PATH . 'assets/css/frontend.css' )
            );
        }
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_script(
            'commerce-kit-frontend-script',
            COMMERCE_KIT_ASSETS . 'js/frontend.js',
            ['jquery'],
            filemtime( COMMERCE_KIT_PATH . 'assets/js/frontend.js' ),
            true
        );
        wp_localize_script( 'commerce-kit-frontend-script', 'COMMERCEKIT', [
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'adminurl' => admin_url(),
            'resturl' => untrailingslashit( rest_url( 'commerce-kit/v1' ) ),
            'nonce'   => wp_create_nonce( 'commerce-kit' ),
            'error'   => __( 'Something went wrong', 'commerce-kit' ),
        ]);

        // Enqueue frontend styles
        wp_enqueue_style(
            'commerce-kit-frontend-style',
            COMMERCE_KIT_ASSETS . '/css/frontend.css',
            [],
            filemtime( COMMERCE_KIT_PATH . 'assets/css/frontend.css' )
        );
        $this->enqueue_common_assets();
    }

    public function enqueue_admin_assets() {
        wp_enqueue_script(
            'commerce-kit-admin-script',
            COMMERCE_KIT_ASSETS . '/js/admin.js',
            ['jquery'],
            filemtime( COMMERCE_KIT_PATH . 'assets/js/admin.js' ),
            true
        );

        wp_enqueue_script(
            'commerce-kit-block-script',
            COMMERCE_KIT_URL . 'build/block.build.js',
            ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
            time(),
            true
        );

        wp_enqueue_script(
            'commerce-kit-init-script',
            COMMERCE_KIT_ASSETS . '/js/init.js',
            [],
            filemtime( COMMERCE_KIT_PATH . 'assets/js/init.js' ),
            true
        );

        wp_enqueue_script(
            'commerce-kit-menu-script',
            COMMERCE_KIT_URL . 'build/admin.build.js',
            ['commerce-kit-admin-script'],
            time(),
            true
        );

        wp_localize_script( 'commerce-kit-admin-script', 'COMMERCEKIT', [
            'nonce'         => wp_create_nonce( 'wp_rest' ),
            'adminurl'      => admin_url(),
            'ajaxurl'       => admin_url( 'admin-ajax.php' ),
            'apiurl'        => untrailingslashit( rest_url( 'commerce-kit/v1' ) ),
            'settings_data' => get_option( 'commerce_kit_settings', [] ),
            'error'         => __( 'Something went wrong', 'commerce-kit' ),
        ] );

        wp_enqueue_style(
            'commerce-kit-admin-style',
            COMMERCE_KIT_ASSETS . '/css/admin.css',
            [],
            filemtime( COMMERCE_KIT_PATH . 'assets/css/admin.css' )
        );

        wp_enqueue_style(
            'commerce-kit-init-style',
            COMMERCE_KIT_ASSETS . '/css/init.css',
            [],
            filemtime(COMMERCE_KIT_PATH . 'assets/css/init.css')
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
