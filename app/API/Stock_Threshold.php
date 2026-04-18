<?php
namespace Thrail\Commerce\API;

use Thrail\Commerce\Classes\Helper\Utility;

class Stock_Threshold {

    public function save_stock_threshold( $request ) {
        $threshold = $request->get_param( 'threshold' );
        if ( is_numeric( $threshold ) && $threshold >= 0 ) {
            update_option( 'thrail_commerce_stock_threshold', intval( $threshold ) );
            return rest_ensure_response( [ 'success' => true, 'message' => 'Stock threshold saved successfully.' ] );
        } else {
            return rest_ensure_response( [ 'success' => false, 'message' => 'Invalid stock threshold value.' ] );
        }
    }

    public function get_stock_threshold() {
        $threshold = get_option( 'thrail_commerce_stock_threshold', 10 );
        return rest_ensure_response( [ 'threshold' => intval( $threshold ) ] );
    }

    public function stock_threshold_permission() {
        return current_user_can( 'manage_options' );
    }
}