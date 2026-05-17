<?php
namespace CommerceKit\Commerce\Features;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class StockThresholdForWc {
    use Hookable;

    protected $stock_settings          = [];
    private static $in_cart_adjustment = false;

    public function __construct() {
        $this->stock_settings = commercekit_get_stock_settings();

        $this->action( 'woocommerce_single_product_summary', [ $this, 'display_stock_message' ], 25 );
        $this->filter( 'woocommerce_product_get_price', [ $this, 'get_adjusted_price' ], 10, 2 );

        $this->filter( 'woocommerce_variation_prices_price', [ $this, 'adjust_variation_price_in_range' ], 10, 3 );
        $this->filter( 'woocommerce_get_variation_prices_hash', [ $this, 'add_settings_to_prices_hash' ], 10, 3 );

        $this->filter( 'woocommerce_cart_item_name', [ $this, 'append_stock_message_to_cart_item_name' ], 10, 3 );

        $this->action( 'woocommerce_order_item_meta_start', [ $this, 'display_checkout_stock_message' ], 10, 4 );
    }

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

        if ( $product->is_type( 'variable' ) ) {
            echo '<p class="commercekit-stock-message" style="display:none"></p>';
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

    private function get_variation_product( $product ) {
        if ( is_a( $product, 'WC_Product_Variation' ) ) {
            return $product;
        }

        if ( is_a( $product, 'WC_Product_Variable' ) ) {
            $variation_id = isset( $_REQUEST['variation_id'] ) ? absint( $_REQUEST['variation_id'] ) : 0;
            if ( $variation_id > 0 ) {
                $variation = wc_get_product( $variation_id );
                if ( $variation && is_a( $variation, 'WC_Product_Variation' ) ) {
                    return $variation;
                }
            }

            if ( class_exists( 'WC_Product_Variable' ) ) {
                $available_variations = $product->get_available_variations();
                if ( ! empty( $available_variations ) ) {
                    usort( $available_variations, function( $a, $b ) {
                        return ( $a['variation_id'] ?? 0 ) - ( $b['variation_id'] ?? 0 );
                    } );
                    $first_variation_id = $available_variations[0]['variation_id'] ?? 0;
                    if ( $first_variation_id > 0 ) {
                        $variation = wc_get_product( $first_variation_id );
                        if ( $variation ) {
                            return $variation;
                        }
                    }
                }
            }
        }

        return $product;
    }

    public function adjust_variation_price_in_range( $price, $variation, $product ) {
        if ( empty( $price ) ) {
            return $price;
        }

        $stock_quantity = $variation->get_stock_quantity();
        if ( is_null( $stock_quantity ) ) {
            return $price;
        }

        $s = $this->stock_settings;

        if ( $stock_quantity <= $s['low_threshold'] ) {
            return $price * ( 1 + $s['low_increase'] / 100 );
        } elseif ( $stock_quantity <= $s['medium_threshold'] ) {
            return $price * ( 1 + $s['medium_increase'] / 100 );
        } elseif ( $stock_quantity >= $s['high_threshold'] ) {
            return $price * ( 1 - $s['high_decrease'] / 100 );
        }

        return $price;
    }

    public function add_settings_to_prices_hash( $hash, $product, $for_display ) {
        $hash[] = md5( serialize( $this->stock_settings ) );
        return $hash;
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

        $product = $this->get_variation_product( $product );

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
