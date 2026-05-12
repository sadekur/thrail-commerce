<?php
namespace CommerceKit\Commerce\API;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Blocks {
    public function get_block_register_permission() {
        return true;
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
}