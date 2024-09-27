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
        // Get all settings from the database (default to an empty array if not set)
        $settings = get_option( $this->settings_option_name, [
            'Enable Footer Hook' => 'off',
            'Enable Custom Functionality 1' => 'off',
            'Enable Custom Functionality 2' => 'off',
        ]);

        return rest_ensure_response( $settings );
    }

    public function get_settings_permission() {
        return true;
    }

    // Save settings as an array
    public function save_settings( $req ) {
        // Get current settings
        $current_settings = get_option( $this->settings_option_name, [] );

        // Update the settings array with new values from the request
        $current_settings['Enable Footer Hook'] = sanitize_text_field( $req['Enable Footer Hook'] );
        $current_settings['Enable Custom Functionality 1'] = sanitize_text_field( $req['Enable Custom Functionality 1'] );
        $current_settings['Enable Custom Functionality 2'] = sanitize_text_field( $req['Enable Custom Functionality 2'] );

        // Save the updated settings array back to the database
        update_option( $this->settings_option_name, $current_settings );

        return rest_ensure_response( 'success' );
    }

    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }
}