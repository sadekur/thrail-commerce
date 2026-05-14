<?php
namespace CommerceKit\Commerce\API;

use CommerceKit\Commerce\Classes\Helper\Utility;

class Blocks {
    public function block_register_permission() {
        return current_user_can( 'manage_options' );
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

    public function block_register( $request ) {
        $settings = $request->get_param( 'settings' );
        if ( is_array( $settings ) ) {
            update_option( 'commercekit-block-settings', $settings );
        }
        return rest_ensure_response( 'success' );
    }
}