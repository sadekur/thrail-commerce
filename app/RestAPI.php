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
        $firstname = get_option( 'thrail_settings_firstname' );
        $lastname  = get_option( 'thrail_settings_lastname' );
        $email     = get_option( 'thrail_settings_email' );
        $response = [
            'firstname' => $firstname,
            'lastname'  => $lastname,
            'email'     => $email
        ];

        return rest_ensure_response( $response );
    }

    public function get_settings_permission() {
        return true;
    }

    public function save_settings( $req ) {
        $firstname = sanitize_text_field( $req['firstname'] );
        $lastname  = sanitize_text_field( $req['lastname'] );
        $email     = sanitize_text_field( $req['email'] );

        // Save data to options
        update_option( 'thrail_settings_firstname', $firstname );
        update_option( 'thrail_settings_lastname', $lastname );
        update_option( 'thrail_settings_email', $email );
        
        return rest_ensure_response( 'success' );
    }

    public function save_settings_permission() {
        // return true;
        return current_user_can( 'manage_options' );
    }
}