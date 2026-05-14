<?php
namespace CommerceKit\Commerce\API;

class Settings {

    public function get_settings() {
        $default_settings = [
            'woocommerce-tips'              => 'off',
            'woocommerce-faq'               => 'off',
            'woocommerce-product-barcode'   => 'off',
            'buy-button-for-woocommerce'    => 'off',
            'stock-threshold-for-wc'        => 'off',
        ];
        $settings = get_option( 'commerce_kit_settings', $default_settings );
    
        return rest_ensure_response( $settings );
    }

    public function save_settings( $request ) {
        $settings = $request->get_param( 'settings' );
        if ( is_array( $settings ) ) {
            update_option( 'commerce_kit_settings', $settings );
        }
        return rest_ensure_response( 'success' );
    }


    public function get_settings_permission() {
        return true;
    }
    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }
}
