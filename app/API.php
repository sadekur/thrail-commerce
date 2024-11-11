<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class API {
    use Hookable;

    public function __construct() {
        $this->action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes() {
        $this->create_rest_routes();
        $this->block_register_routes();
        $this->tips_routes();
    }

    public function create_rest_routes() {
        $this->register_route( '/get-settings', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_settings' ],
            'permission_callback' => [ $this, 'get_settings_permission' ]
        ]);

        $this->register_route( '/post-settings', [
            'methods' => 'POST',
            'callback' => [ $this, 'save_settings' ],
            'permission_callback' => [ $this, 'save_settings_permission' ]
        ]);
    }

    public function get_settings() {
        $default_settings = [
            'woocommerce-tips'              => 'off',
            'woocommerce-faq'               => 'off',
            'woocommerce-product-barcode'   => 'off',
            'buy-button-for-woocommerce'    => 'off',
        ];
        $settings = get_option( 'thrail_commerce_settings', $default_settings );
    
        return rest_ensure_response( $settings );
    }

    public function get_settings_permission() {
        return true;
    }

    public function save_settings( $request ) {
        $settings = $request->get_param( 'settings' );
        if ( is_array( $settings ) ) {
            update_option( 'thrail_commerce_settings', $settings );
        }
        return rest_ensure_response( 'success' );
    }

    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }

    public function block_register_routes() {
        $this->register_route( '/get-block-register', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_block_register' ],
            'permission_callback' => [ $this, 'get_block_register_permission' ]
        ]);

        $this->register_route( '/block-register-save', [
            'methods' => 'POST',
            'callback' => [ $this, 'block_register' ],
            'permission_callback' => [ $this, 'block_register_permission' ]
        ]);
    }

    public function get_block_register() {
        $default_settings = [
            'generic-faq'   => 'off',
            'variant-faq'   => 'off',
            'accordion'     => 'off',
            'add-to-cart'   => 'off',
        ];
        $settings = get_option( 'thrail_commerce_block_settings', $default_settings );
    
        return rest_ensure_response( $settings );
    }

    public function get_block_register_permission() {
        return true;
    }

    public function block_register( $request ) {
        $settings = $request->get_param( 'settings' );
        if ( is_array( $settings ) ) {
            update_option( 'thrail_commerce_block_settings', $settings );
        }
        return rest_ensure_response( 'success' );
    }

    public function block_register_permission() {
        return current_user_can( 'manage_options' );
    }

    // Tips
    public function tips_routes() {
        $this->register_route( '/save-tips', [
            'methods' => 'POST',
            'callback' => [ $this, 'thrail_save_tips' ],
            'permission_callback' => [ $this, 'tips_permission' ]
        ]);
    }

    public function thrail_save_tips( $request ) {
        // Retrieve the settings from the request
        $tips_settings = $request->get_json_params();
        
        // Fetch the existing settings and merge with the new values
        $current_settings = get_option('thrail_commerce_tips_settings', []);
        $updated_settings = array_merge($current_settings, $tips_settings);
    
        // Save the merged settings as an array in the options table
        update_option('thrail_commerce_tips_settings', $updated_settings);
        
        return rest_ensure_response('success');
    }
    

    public function tips_permission() {
        return current_user_can( 'manage_options' );
    }
}
