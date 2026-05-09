<?php
namespace CommerceKit\Commerce\Frontend;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Stock_Threshold {
    use Hookable;

    protected $settings_option_name = 'commerce_kit_settings';
    protected $feature_enabled     = false;
    protected $stock_settings     = [];
    private static $in_cart_adjustment = false;

    public function __construct() {
        $settings = get_option( $this->settings_option_name, [] );
        
        $this->feature_enabled = isset( $settings['stock-threshold-for-wc'] ) && $settings['stock-threshold-for-wc'] === 'on';

        if ( $this->feature_enabled ) {
            $this->stock_settings = $this->get_stock_settings();

            $this->action( 'woocommerce_single_product_summary', [ $this, 'display_stock_message' ], 25 );

            $this->filter( 'woocommerce_product_get_price', [ $this, 'get_adjusted_price' ], 10, 2 );
            // $this->action( 'woocommerce_before_calculate_totals', [ $this, 'adjust_cart_prices' ], 10, 1 );
        }
    }


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

    public function get_adjusted_price( $price, $product ) {
        if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
            return $price;
        }

        if ( ! is_a( $product, 'WC_Product' ) ) {
            return $price;
        }

        if ( self::$in_cart_adjustment ) {
            return $price;
        }

        $stock_quantity = $product->get_stock_quantity();
        if ( is_null( $stock_quantity ) ) {
            return $price;
        }

        if ( empty( $price ) ) {
            return $price;
        }

        $stock_settings = $this->stock_settings;
        $adjusted_price = $price;

        if ( $stock_quantity <= $stock_settings['low_threshold'] ) {
            $adjusted_price = $price * ( 1 + ( $stock_settings['low_increase'] / 100 ) );
        } elseif ( $stock_quantity <= $stock_settings['medium_threshold'] ) {
            $adjusted_price = $price * ( 1 + ( $stock_settings['medium_increase'] / 100 ) );
        } elseif ( $stock_quantity >= $stock_settings['high_threshold'] ) {
            $adjusted_price = $price * ( 1 - ( $stock_settings['high_decrease'] / 100 ) );
        }

        return $adjusted_price;
    }

    public function adjust_cart_prices( $cart ) {
        if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
            return;
        }

        self::$in_cart_adjustment = true;

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

        self::$in_cart_adjustment = false;
    }
}