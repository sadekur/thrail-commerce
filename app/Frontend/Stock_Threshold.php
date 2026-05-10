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

            // Show message under product name in checkout order table
            $this->filter( 'woocommerce_cart_item_name', [ $this, 'append_stock_message_to_cart_item_name' ], 10, 3 );

            $this->action( 'woocommerce_order_item_meta_start', [ $this, 'display_checkout_stock_message' ], 10, 4 );

            // $this->action( 'woocommerce_review_order_after_cart_contents', [ $this, 'display_checkout_review_stock_message' ], 10 );
        }
    }

    /**
     * Resolve the customer message based on stock quantity.
     */
    private function get_stock_message( $stock_quantity ) {
        $s = $this->stock_settings;

        if ( $stock_quantity <= $s['low_threshold'] ) {
            return $s['low_customer_message'] ?? '';
        } elseif ( $stock_quantity <= $s['medium_threshold'] ) {
            return $s['medium_customer_message'] ?? '';
        } elseif ( $stock_quantity >= $s['high_threshold'] ) {
            return $s['high_customer_message'] ?? '';
        }

        return '';
    }

    public function display_stock_message() {
        global $product;

        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return;
        }

        if ( $this->stock_settings['enable_message'] !== 'on' ) {
            return;
        }

        $stock_quantity = $product->get_stock_quantity();
        if ( is_null( $stock_quantity ) || empty( $product->get_price() ) ) {
            return;
        }

        $message = $this->get_stock_message( $stock_quantity );

        if ( ! empty( $message ) ) {
            printf(
                '<p class="commercekit-stock-message">%s</p>',
                esc_html( $message )
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
        if ( is_null( $stock_quantity ) || empty( $price ) ) {
            return $price;
        }

        $s              = $this->stock_settings;
        $adjusted_price = $price;

        if ( $stock_quantity <= $s['low_threshold'] ) {
            $adjusted_price = $price * ( 1 + ( $s['low_increase'] / 100 ) );
        } elseif ( $stock_quantity <= $s['medium_threshold'] ) {
            $adjusted_price = $price * ( 1 + ( $s['medium_increase'] / 100 ) );
        } elseif ( $stock_quantity >= $s['high_threshold'] ) {
            $adjusted_price = $price * ( 1 - ( $s['high_decrease'] / 100 ) );
        }

        return $adjusted_price;
    }

    /**
     * Append stock message directly under product name in the checkout order table.
     * Hook: woocommerce_cart_item_name (runs on checkout review order table).
     */
    public function append_stock_message_to_cart_item_name( $name, $cart_item, $cart_item_key ) {
        if ( ! is_checkout() ) {
            return $name;
        }

        if ( $this->stock_settings['enable_message'] !== 'on' ) {
            return $name;
        }

        $product = $cart_item['data'] ?? null;
        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return $name;
        }

        $stock_quantity = $product->get_stock_quantity();
        if ( is_null( $stock_quantity ) || empty( $product->get_price() ) ) {
            return $name;
        }

        $message = $this->get_stock_message( $stock_quantity );

        if ( ! empty( $message ) ) {
            $name .= sprintf(
                '<br><span class="commercekit-stock-message" style="color:#e60b0b;font-weight:600;font-size:12px;display:block;margin-top:3px;">%s</span>',
                esc_html( $message )
            );
        }

        return $name;
    }

    /**
     * Show stock message under product in the Thank You / Order detail page order table.
     * Hook: woocommerce_order_item_meta_start
     */
    public function display_checkout_stock_message( $item_id, $item, $order, $plain_text ) {
        if ( $order->get_status() === 'cancelled' || $order->get_status() === 'failed' ) {
            return;
        }

        if ( ! $item || ! is_a( $item, 'WC_Order_Item_Product' ) ) {
            return;
        }

        if ( $this->stock_settings['enable_message'] !== 'on' ) {
            return;
        }

        $product = $item->get_product();
        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return;
        }

        $stock_quantity = $product->get_stock_quantity();
        if ( is_null( $stock_quantity ) || empty( $product->get_price() ) ) {
            return;
        }

        $message = $this->get_stock_message( $stock_quantity );

        if ( ! empty( $message ) ) {
            printf(
                '<br /><span class="commercekit-stock-message" style="color:#e60b0b;font-weight:600;font-size:12px;display:block;margin-top:3px;">%s</span>',
                esc_html( $message )
            );
        }
    }
}