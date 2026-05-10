<?php
namespace CommerceKit\Commerce\Frontend;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Stock_Threshold {
    use Hookable;

    protected $settings_option_name     = 'commerce_kit_settings';
    protected $feature_enabled          = false;
    protected $stock_settings           = [];
    private static $in_cart_adjustment  = false;

    public function __construct() {
        $settings = get_option( $this->settings_option_name, [] );
        
        $this->feature_enabled = isset( $settings['stock-threshold-for-wc'] ) && $settings['stock-threshold-for-wc'] === 'on';

        if ( $this->feature_enabled ) {
            $this->stock_settings = commercekit_get_stock_settings();

            $this->action( 'woocommerce_single_product_summary', [ $this, 'display_stock_message' ], 25 );

            $this->filter( 'woocommerce_product_get_price', [ $this, 'get_adjusted_price' ], 10, 2 );

            $this->action( 'woocommerce_order_item_meta_start', [ $this, 'display_checkout_stock_message' ], 10, 4 );
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

        $customer_message = '';

        if ( $stock_quantity <= $stock_settings['low_threshold'] ) {
            $customer_message = $stock_settings['low_customer_message'];
        } elseif ( $stock_quantity <= $stock_settings['medium_threshold'] ) {
            $customer_message = $stock_settings['medium_customer_message'];
        } elseif ( $stock_quantity >= $stock_settings['high_threshold'] ) {
            $customer_message = $stock_settings['high_customer_message'];
        }

        if ( ! empty( $customer_message ) ) {
            printf(
                '<p class="commercekit-stock-message">%s</p>',
                esc_html( $customer_message )
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

    public function display_checkout_stock_message( $item_id, $item, $order, $plain_text ) {
        if ( $order->get_status() === 'cancelled' || $order->get_status() === 'failed' ) {
            return;
        }

        if ( ! $item || ! is_a( $item, 'WC_Order_Item_Product' ) ) {
            return;
        }

        $stock_settings = $this->stock_settings;

        if ( $stock_settings['enable_message'] !== 'on' ) {
            return;
        }

        $product = $item->get_product();
        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return;
        }

        $stock_quantity = $product->get_stock_quantity();
        if ( is_null( $stock_quantity ) ) {
            return;
        }

        if ( empty( $product->get_price() ) ) {
            return;
        }

        $customer_message = '';

        if ( $stock_quantity <= $stock_settings['low_threshold'] ) {
            $customer_message = $stock_settings['low_customer_message'];
        } elseif ( $stock_quantity <= $stock_settings['medium_threshold'] ) {
            $customer_message = $stock_settings['medium_customer_message'];
        } elseif ( $stock_quantity >= $stock_settings['high_threshold'] ) {
            $customer_message = $stock_settings['high_customer_message'];
        }

        if ( ! empty( $customer_message ) ) {
            printf(
                '<br /><span class="commercekit-stock-message" style="color: #e60b0b; font-weight: 600; font-size: 12px;">%s</span>',
                esc_html( $customer_message )
            );
        }
    }
}