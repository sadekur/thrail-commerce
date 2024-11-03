<?php
namespace Thrail\Commerce\Features;
use Thrail\Commerce\Classes\Trait\Hookable;

class BuyButtonForWoocommerce {
    use Hookable;

    public function __construct() {
        // Register hooks and shortcodes.
        $this->filter('woocommerce_add_to_cart_redirect', [ $this, 'handle_add_to_cart_redirect' ], 10, 1);
        $this->filter('add_to_cart_validation', [ $this, 'validate_add_to_cart' ]);
        $this->add_shortcode('buy_button', [ $this, 'buy_button_handler' ]);
    }

    /**
     * Handle add to cart redirect.
     *
     * @param string $url The original redirect URL.
     * @return string Modified URL.
     */
    function handle_add_to_cart_redirect($url) {
        if (!isset($_REQUEST['buy-button-wc']) || empty($_REQUEST['buy-button-wc'])) {
            return $url;
        }
        $checkout_url = wc_get_checkout_url();
        if (isset($checkout_url) && !empty($checkout_url)) {
            $url = $checkout_url;
        }
        return $url;
    }

    /**
     * Validate add to cart.
     *
     * @param bool $passed_validation Whether the product passes validation.
     * @param int $product_id The ID of the product.
     * @param int $quantity The quantity being added.
     * @return bool Whether the product passes validation.
     */
    function validate_add_to_cart($passed_validation, $product_id, $quantity) {
        if (!isset($_REQUEST['buy-button-wc']) || empty($_REQUEST['buy-button-wc'])) {
            return $passed_validation;
        }
        if (!WC()->cart->is_empty()) {
            WC()->cart->empty_cart();
        }
        return $passed_validation;
    }

    /**
     * Shortcode handler for the buy button.
     *
     * @param array $atts Shortcode attributes.
     * @return string Shortcode output.
     */
    function buy_button_handler($atts) {
        if (!isset($atts['id']) || empty($atts['id'])) {
            return __('You need to provide a valid product ID in the shortcode', 'buy-button-for-woocommerce');
        }
        $atts = array_map('sanitize_text_field', $atts);
        $button_text = 'Buy Now';
        if (isset($atts['button_text']) && !empty($atts['button_text'])) {
            $button_text = $atts['button_text'];
        }
        $class = 'woocommerce';
        if (isset($atts['class']) && !empty($atts['class'])) {
            $class = $class . ' ' . $atts['class'];
        }
        $button_code = '';
        $url = add_query_arg(array(
            'add-to-cart' => $atts['id'],
            'buy-button-wc' => 1,
        ));
        $button_code .= '<div class="' . esc_attr($class) . '"><a href="' . esc_url($url) . '" class="button" rel="nofollow">' . esc_html($button_text) . '</a></div>';
        return $button_code;
    }
}
