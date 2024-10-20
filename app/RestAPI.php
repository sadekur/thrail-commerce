<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class RestAPI {
    use Hookable;

    public function __construct() {
        $this->action( 'rest_api_init', [ $this, 'create_rest_routes' ] );
    }

    public function create_rest_routes() {
        $this->register_route( '/get-settings', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_settings' ],
            'permission_callback' => [ $this, 'get_settings_permission' ]
        ] );

        $this->register_route( '/post-settings', [
            'methods' => 'POST',
            'callback' => [ $this, 'save_settings' ],
            'permission_callback' => [ $this, 'save_settings_permission' ]
        ] );
    }

    public function get_settings() {
        $default_settings = [
            'woocommerce_tips' => 'off',
            'woocommerce_faq' => 'off',
            'woocommerce_product_barcode' => 'off',
            'woocommerce_tips2' => 'off',
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
    
}