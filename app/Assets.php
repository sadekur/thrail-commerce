<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class Assets {
    use Hookable;

    public $plugin;
    public $slug;
    public $name;
    public $version;
    public $assets;

    function __construct() {
        $this->action('wp_enqueue_scripts', [ $this, 'register_frontend_assets' ] );
        $this->action('admin_enqueue_scripts', [ $this, 'register_admin_assets' ] );
        $this->action('enqueue_block_assets', [ $this, 'enqueue_block_assets' ] );
        $this->action('enqueue_block_editor_assets', [ $this, 'enqueue_block_assets' ] );
    }

    public function get_scripts() {
        return [
            'thrail-commerce-frontend-script' => [
                'src'     => THRAIL_COMMERCE_ASSETS . '/js/frontend.js',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/js/frontend.js' ),
                'deps'    => ['jquery']
            ],
            'thrail-commerce-block-script' => [
                'src'     => THRAIL_COMMERCE_URL . 'build/block.build.js',
                'version' => time(),
                'deps'    => [ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ]
            ],
            'thrail-commerce-menu-script' => [
                'src'     => THRAIL_COMMERCE_URL . 'build/admin.build.js',
                'version' => time(),
            ],
            'thrail-commerce-admin-script' => [
                'src'     => THRAIL_COMMERCE_ASSETS . '/js/admin.js',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/js/admin.js' ),
                'deps'    => [ 'jquery', 'wp-util', 'jquery-ui-dialog' ]
            ],
            'thrail-commerce-init-script' => [
                'src'     => THRAIL_COMMERCE_ASSETS . '/js/init.js',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/js/init.js' ),
            ],
            'thrail-commerce-admin-tailwind-script' => [
                'src' => THRAIL_COMMERCE_URL . 'build/tailwind.build.js',
                'version' => time(),
            ],
        ];
    }

    public function get_styles() {
        return [
            'thrail-commerce-frontend-style' => [
                'src'     => THRAIL_COMMERCE_ASSETS . '/css/frontend.css',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/css/frontend.css' )
            ],
            'thrail-commerce-init-style' => [
                'src'     => THRAIL_COMMERCE_ASSETS . '/css/init.css',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/css/init.css' )
            ],
            'thrail-commerce-admin-style' => [
                'src'     => THRAIL_COMMERCE_ASSETS . '/css/admin.css',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/css/admin.css' ),
                'deps'    => [ 'wp-jquery-ui-dialog' ]
            ],
            'jquery-ui' => [
                'src'     => 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
                'version' => filemtime( THRAIL_COMMERCE_PATH . '/assets/css/jquery-ui.css' )
            ],
        ];
    }

    public function enqueue_block_assets() {
        $scripts = $this->get_scripts();
        $styles  = $this->get_styles();

        // Register the block script for both frontend and backend
        wp_register_script(
            'thrail-commerce-block-script',
            $scripts['thrail-commerce-block-script']['src'],
            $scripts['thrail-commerce-block-script']['deps'],
            $scripts['thrail-commerce-block-script']['version'],
            true
        );

        // Enqueue styles if needed for the frontend (optional)
        wp_register_style(
            'thrail-commerce-frontend-style',
            $styles['thrail-commerce-frontend-style']['src'],
            [],
            $styles['thrail-commerce-frontend-style']['version']
        );

        // Enqueue block script and styles (frontend and editor)
        wp_enqueue_script('thrail-commerce-block-script');
        if (!is_admin()) {
            wp_enqueue_style('thrail-commerce-frontend-style');
        }
    }

    public function register_frontend_assets() {
        $scripts  = $this->get_scripts();
        $styles   = $this->get_styles();

        wp_register_script(
            'thrail-commerce-frontend-script',
            $scripts['thrail-commerce-frontend-script']['src'],
            $scripts['thrail-commerce-frontend-script']['deps'],
            $scripts['thrail-commerce-frontend-script']['version'],
            true
        );

        wp_localize_script( 'thrail-commerce-frontend-script', 'WOOHUB', [
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'thrail-commerce' ),
            'error'   => __( 'Something went wrong', 'thrail-commerce' )
        ]);

        wp_register_style(
            'thrail-commerce-frontend-style',
            $styles['thrail-commerce-frontend-style']['src'],
            [],
            $styles['thrail-commerce-frontend-style']['version']
        );

        wp_enqueue_script('thrail-commerce-frontend-script');
        wp_enqueue_style('thrail-commerce-frontend-style');
    }

    public function register_admin_assets() {
        $scripts  = $this->get_scripts();
        $styles   = $this->get_styles();

        wp_register_script(
            'thrail-commerce-menu-script',
            $scripts['thrail-commerce-menu-script']['src'],
            [],
            $scripts['thrail-commerce-menu-script']['version'],
            true
        );
        wp_register_script(
            'thrail-commerce-block-script',
            $scripts['thrail-commerce-block-script']['src'],
            $scripts['thrail-commerce-block-script']['deps'],
            $scripts['thrail-commerce-block-script']['version'],
            true
        );
        wp_register_script(
            'thrail-commerce-init-script',
            $scripts['thrail-commerce-init-script']['src'],
            [],
            $scripts['thrail-commerce-init-script']['version'],
            true
        );
        wp_register_script(
            'thrail-commerce-admin-script',
            $scripts['thrail-commerce-admin-script']['src'],
            $scripts['thrail-commerce-admin-script']['deps'],
            $scripts['thrail-commerce-admin-script']['version'],
            true
        );
        wp_register_script(
            'thrail-commerce-admin-tailwind-script',
            $scripts['thrail-commerce-admin-tailwind-script']['src'],
            [],
            $scripts['thrail-commerce-admin-tailwind-script']['version'],
            true
        );

        wp_localize_script('thrail-commerce-admin-script', 'THRAILCOMMERCE', [
            'nonce'    => wp_create_nonce('wp_rest'),
            'ajaxurl'  => admin_url('admin-ajax.php'),
            'apiurl'   => untrailingslashit(rest_url('thrail/v1')),
            'error'    => __('Something went wrong', 'thrail-commerce')
        ]);

        wp_register_style(
            'thrail-commerce-admin-style',
            $styles['thrail-commerce-admin-style']['src'],
            [],
            $styles['thrail-commerce-admin-style']['version']
        );
        wp_register_style(
            'thrail-commerce-init-style',
            $styles['thrail-commerce-init-style']['src'],
            [],
            $styles['thrail-commerce-init-style']['version']
        );
        wp_register_style(
            'jquery-ui',
            $styles['jquery-ui']['src'],
            [],
            $styles['jquery-ui']['version']
        );

        wp_enqueue_script('thrail-commerce-admin-script');
        wp_enqueue_script('thrail-commerce-block-script');
        wp_enqueue_script('thrail-commerce-init-script');
        wp_enqueue_script('thrail-commerce-menu-script');
        wp_enqueue_script('thrail-commerce-admin-tailwind-script');
        wp_enqueue_style('thrail-commerce-admin-style');
        wp_enqueue_style('thrail-commerce-init-style');
        wp_enqueue_style('jquery-ui');
    }
}
