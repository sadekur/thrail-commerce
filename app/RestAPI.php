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

    // Fetch settings as an array
    public function get_settings() {
        $settings = get_option( $this->settings_option_name, [
            'woocommerce_tips' => 'off',
            'woocommerce_faq' => 'off',
            'woocommerce_product_barcode' => 'off',
            'woocommerce_tips2' => 'off',
        ]);

        return rest_ensure_response( $settings );
    }

    public function get_settings_permission() {
        return true;
    }

    public function save_settings( $req ) {
        $current_settings = get_option( $this->settings_option_name, [] );
        $current_settings['woocommerce_tips'] = sanitize_text_field( $req['woocommerce_tips'] );
        $current_settings['woocommerce_faq'] = sanitize_text_field( $req['woocommerce_faq'] );
        $current_settings['woocommerce_product_barcode'] = sanitize_text_field( $req['woocommerce_product_barcode'] );
        $current_settings['woocommerce_tips2'] = sanitize_text_field( $req['woocommerce_tips2'] );

        // Save settings
        update_option( $this->settings_option_name, $current_settings );

        return rest_ensure_response( 'success' );
    }

    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }
}