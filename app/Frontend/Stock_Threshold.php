<?php
namespace CommerceKit\Commerce\Frontend;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Stock_Threshold {
    use Hookable;

    protected $settings_option_name = 'commerce_kit_settings';
    protected $feature_enabled     = false;
    protected $stock_settings     = [];

    /**
     * Initialize the class
     */
    public function __construct() {
        $settings = get_option( $this->settings_option_name, [] );
        
        $this->feature_enabled = isset( $settings['stock-threshold-for-wc'] ) && $settings['stock-threshold-for-wc'] === 'on';

        if ( $this->feature_enabled ) {
            $this->stock_settings = $this->get_stock_settings();

            $this->action( 'woocommerce_single_product_summary', [ $this, 'display_stock_message' ], 25 );

            $this->action( 'woocommerce_before_calculate_totals', [ $this, 'adjust_cart_prices' ], 10, 1 );
        }
    }


    /**
     * Get stock threshold settings with defaults
     */
    private function get_stock_settings() {
        $defaults = [
            'low_threshold'    => 5,
            'low_increase'     => 40,
            'medium_threshold' => 20,
            'medium_increase'  => 20,
            'high_threshold'   => 100,
            'high_decrease'    => 15,
            'enable_message'   => 'off',
            'customer_message' => 'High demand – price adjusted based on availability',
        ];

        $saved = get_option( 'commerce_kit_stock_threshold', [] );
        return array_merge( $defaults, $saved );
    }

    /**
     * Display custom message on single product page after price
     */
    public function display_stock_message() {
        global $product;

        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return;
        }

        $stock_settings = $this->stock_settings;

        if ( $stock_settings['enable_message'] !== 'on' ) {
            return;
        }

        $stock_quantity = $product->get_stock_quantity();
        if ( is_null( $stock_quantity ) ) {
            return;
        }

        $base_price = $product->get_price();
        if ( empty( $base_price ) ) {
            return;
        }

        $is_adjusted = false;

        if ( $stock_quantity <= $stock_settings['low_threshold'] ) {
            $is_adjusted = true;
        } elseif ( $stock_quantity <= $stock_settings['medium_threshold'] ) {
            $is_adjusted = true;
        } elseif ( $stock_quantity >= $stock_settings['high_threshold'] ) {
            $is_adjusted = true;
        }

        if ( $is_adjusted ) {
            printf(
                '<p class="commercekit-stock-message">%s</p>',
                esc_html( $stock_settings['customer_message'] )
            );
        }
    }

    /**
     * Adjust cart item prices based on stock thresholds
     */
    public function adjust_cart_prices( $cart ) {
        if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
            return;
        }

        $stock_settings = $this->stock_settings;

        foreach ( $cart->get_cart() as $cart_item ) {
            $product = $cart_item['data'];
            if ( ! is_a( $product, 'WC_Product' ) ) {
                continue;
            }

            $stock_quantity = $product->get_stock_quantity();
            if ( is_null( $stock_quantity ) ) {
                continue;
            }

            $base_price = $product->get_price();
            if ( empty( $base_price ) ) {
                continue;
            }

            $adjusted_price = $base_price;

            // Apply pricing rules
            if ( $stock_quantity <= $stock_settings['low_threshold'] ) {
                $increase_percent = $stock_settings['low_increase'];
                $adjusted_price = $base_price * ( 1 + ( $increase_percent / 100 ) );
            } elseif ( $stock_quantity <= $stock_settings['medium_threshold'] ) {
                $increase_percent = $stock_settings['medium_increase'];
                $adjusted_price = $base_price * ( 1 + ( $increase_percent / 100 ) );
            } elseif ( $stock_quantity >= $stock_settings['high_threshold'] ) {
                $decrease_percent = $stock_settings['high_decrease'];
                $adjusted_price = $base_price * ( 1 - ( $decrease_percent / 100 ) );
            }
            $product->set_price( $adjusted_price );
        }
    }
}
