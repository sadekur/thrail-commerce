<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class RestAPI {
    use Hookable;

    protected $settings = [
        'Enable Footer Hook' => 'thrail_enable_footer_hook',
        'Enable Custom Functionality 1' => 'thrail_enable_custom_functionality_1',
        'Enable Custom Functionality 2' => 'thrail_enable_custom_functionality_2',
    ];

    public function __construct() {
        $this->action( 'rest_api_init', [ $this, 'create_rest_routes' ] );
        $this->check_feature_hooks(); // Check if feature hooks should be added
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

    // Reusable method to fetch all settings
    protected function fetch_all_settings() {
        $settings = [];
        foreach ( $this->settings as $label => $option ) {
            $settings[$label] = get_option( $option, 'off' );
        }
        return $settings;
    }

    public function get_settings() {
        // Fetch settings dynamically
        return rest_ensure_response( $this->fetch_all_settings() );
    }

    public function get_settings_permission() {
        return true;
    }

    // Reusable method to update settings
    protected function update_all_settings( $request ) {
        foreach ( $this->settings as $label => $option ) {
            if ( isset( $request[ $label ] ) ) {
                update_option( $option, sanitize_text_field( $request[ $label ] ) );
            }
        }
    }

    public function save_settings( $req ) {
        // Update settings dynamically
        $this->update_all_settings( $req );

        // After saving, check if any feature hooks need to be added
        $this->check_feature_hooks();

        return rest_ensure_response( 'success' );
    }

    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }

    // Method to check if feature hooks should be added
    protected function check_feature_hooks() {
        $this->add_hook_if_enabled( 'thrail_enable_footer_hook', 'wp_footer', [ $this, 'add_footer_hook' ] );
    }

    // Utility method to add a hook if the corresponding option is enabled
    protected function add_hook_if_enabled( $option_name, $wp_hook, $callback ) {
        if ( 'on' === get_option( $option_name, 'off' ) ) {
            add_action( $wp_hook, $callback );
        }
    }

    public function add_footer_hook() {
        echo '<p style="color: green; text-align: center" class="notice notice-success">Footer hook has been enabled!</p>';
    }
}