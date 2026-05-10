<?php
namespace CommerceKit\Commerce\API;

use CommerceKit\Commerce\Classes\Helper\Utility;

class Stock_Threshold {

    public function save_stock_threshold( $request ) {

        $params = $request->get_json_params();

        $data = [
            'low_threshold'        => intval( $params['low_threshold'] ?? 5 ),
            'low_increase'         => floatval( $params['low_increase'] ?? 40 ),

            'medium_threshold'     => intval( $params['medium_threshold'] ?? 20 ),
            'medium_increase'      => floatval( $params['medium_increase'] ?? 20 ),

            'high_threshold'       => intval( $params['high_threshold'] ?? 100 ),
            'high_decrease'        => floatval( $params['high_decrease'] ?? 15 ),

            'enable_message'       => ( $params['enable_message'] ?? 'off' ) === 'on' ? 'on' : 'off',
            'low_customer_message'    => sanitize_text_field( $params['low_customer_message'] ?? 'Low stock - high demand item' ),
            'medium_customer_message' => sanitize_text_field( $params['medium_customer_message'] ?? 'Medium stock - price adjusted' ),
            'high_customer_message'   => sanitize_text_field( $params['high_customer_message'] ?? 'High stock - clearance price' ),
        ];

        update_option( 'commerce_kit_stock_threshold', $data );

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
            'low_customer_message'    => 'Low stock - high demand item',
            'medium_customer_message' => 'Medium stock - price adjusted',
            'high_customer_message'   => 'High stock - clearance price',
        ];

        $data = get_option( 'commerce_kit_stock_threshold', [] );

        return rest_ensure_response( array_merge( $defaults, $data ) );
    }

    public function stock_threshold_permission( $request ) {
        return current_user_can( 'manage_options' );
    }
}
