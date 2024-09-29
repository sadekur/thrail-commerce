<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class RestAPI {
    use Hookable;

    // Option key for storing all settings in the database
    protected $settings_option_name = 'thrail_settings';

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
        $settings = get_option( $this->settings_option_name, $default_settings );
    
        return rest_ensure_response( $settings );
    }
    
    public function get_settings_permission() {
        return true;
    }
    
    public function save_settings( $req ) {
        $current_settings = get_option( $this->settings_option_name, [] );
        foreach ( $req->get_params() as $key => $value ) {
            if ( in_array( $key, ['woocommerce_tips', 'woocommerce_faq', 'woocommerce_product_barcode', 'woocommerce_tips2'] ) ) {
                $current_settings[ $key ] = sanitize_text_field( $value );
            }
        }
        update_option( $this->settings_option_name, $current_settings );

        return rest_ensure_response( 'success' );
    }
    
    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }
    
}