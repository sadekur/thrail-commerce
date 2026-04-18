<?php
namespace Thrail\Commerce\API;

use Thrail\Commerce\Classes\Helper\Utility;

class Stock_Threshold {

    public function save_stock_threshold( $request ) {

        $params = $request->get_json_params();

        $data = [
            'low_threshold'        => intval($params['low_threshold'] ?? 5),
            'low_increase'         => floatval($params['low_increase'] ?? 40),

            'medium_threshold'     => intval($params['medium_threshold'] ?? 20),
            'medium_increase'      => floatval($params['medium_increase'] ?? 20),

            'high_threshold'       => intval($params['high_threshold'] ?? 100),
            'high_decrease'        => floatval($params['high_decrease'] ?? 15),

            'enable_message'       => ($params['enable_message'] ?? 'off') === 'on' ? 'on' : 'off',
            'customer_message'     => sanitize_text_field($params['customer_message'] ?? 'High demand – price adjusted based on availability'),
        ];

        update_option( 'thrail_commerce_stock_threshold', $data );

        return rest_ensure_response([
            'success' => true,
            'message' => 'Stock settings saved successfully.',
        ]);
    }

    public function get_stock_threshold() {

        $defaults = [
            'low_threshold'        => 5,
            'low_increase'         => 40,

            'medium_threshold'     => 20,
            'medium_increase'      => 20,

            'high_threshold'       => 100,
            'high_decrease'        => 15,

            'enable_message'       => 'off',
            'customer_message'     => 'High demand – price adjusted based on availability',
        ];

        $data = get_option('thrail_commerce_stock_threshold', []);

        return rest_ensure_response( array_merge( $defaults, $data ) );
    }

    public function stock_threshold_permission( $request ) {
        // $nonce = $request->get_header( 'x_wp_nonce' );
        // if ( $nonce && !wp_verify_nonce( $nonce, 'thrail_commerce_nonce' ) ) {
        //     return false;
        // }
        return current_user_can( 'manage_options' );
    }
}