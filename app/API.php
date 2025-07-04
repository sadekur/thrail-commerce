<?php
namespace Thrail\Commerce;

use Thrail\Commerce\Classes\Helper\Utility;
use Thrail\Commerce\Classes\Trait\Hookable;

class API {
    use Hookable;

    public function __construct() {
        $this->action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes() {
        $this->create_rest_routes();
        $this->block_register_routes();
        $this->save_tips_routes();
        $this->get_tips_routes();
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
        $settings = [];
        foreach ( $default_settings as $key => $default_value ) {
            $settings[$key] = Utility::get_option( 'block', 'settings', $key, $default_value );
        }

    
        return rest_ensure_response( $settings );
    }

    public function get_block_register_permission() {
        return true;
    }

    public function block_register( $request ) {
        $settings = $request->get_param( 'settings' );
        if ( is_array( $settings ) ) {
            update_option( 'thrailcommerce-block-settings', $settings );
        }
        return rest_ensure_response( 'success' );
    }

    public function block_register_permission() {
        return current_user_can( 'manage_options' );
    }

    //Post Tips
    public function save_tips_routes() {
        $this->register_route( '/save-tips', [
            'methods' => 'POST',
            'callback' => [ $this, 'thrail_save_tips' ],
            'permission_callback' => [ $this, 'tips_permission' ]
        ]);
    }

    public function thrail_save_tips( $request ) {
        // Get the JSON parameters from the request
        $tips_settings = $request->get_json_params() ?? [];
        
        // Retrieve current settings and merge with new settings
        $current_settings = get_option( 'thrailcommerce-tips-settings', [] );
        $updated_settings = array_merge( $current_settings, $tips_settings );
        
        // Save the updated settings back to the options table
        update_option( 'thrailcommerce-tips-settings', $updated_settings );
        
        // Return success response
        return rest_ensure_response( 'success' );
    }

    public function get_tips_routes() {

        $this->register_route( '/get-tips', [
            'methods' => 'GET',
            'callback' => [ $this, 'thrail_get_tips' ],
            'permission_callback' => [ $this, 'tips_permission' ]
        ]);
    }
    public function tips_permission() {
        return true;
    }
    public function thrail_get_tips() {
        $tips_settings = get_option('thrailcommerce-tips-settings', []);
        return rest_ensure_response($tips_settings);
    }
}
