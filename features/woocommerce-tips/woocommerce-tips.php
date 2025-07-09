<?php
namespace Thrail\Commerce\Features;
use Thrail\Commerce\Classes\Trait\Hookable;

class WoocommerceTips {

    use Hookable;
    public function __construct() {
        // Hook form display methods
        $this->action('woocommerce_before_cart_contents', [$this, 'display_tips_form']);
        $this->action('woocommerce_review_order_before_payment', [$this, 'display_tips_form']);
    }

    /**
     * Retrieve plugin settings with defaults
     *
     * @return array
     */
    public function get_settings(): array {
        return [
            'tcwt_cart' => get_option('tcwt_cart', 'off'),
            'tcwt_checkout' => get_option('tcwt_checkout', 'off'),
            'tcwt_btncolor' => get_option('tcwt_btncolor', '#b12d0b'),
            'tcwt_btntext' => get_option('tcwt_btntext', 'Submit Tip'),
            'tcwt_textcolor' => get_option('tcwt_textcolor', '#0300d1'),
        ];
    }

    /**
     * Render the tips form
     *
     * @param array $settings Plugin settings
     */
    public function render_tips_form(array $settings) {
        ?>
        <div class="bg-gray-100 p-4 rounded shadow-md">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="tip_amount">
                Tip Amount
            </label>
            <input type="number" id="tip_amount" name="tip_amount" 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Enter your tip amount">
            <button type="submit" class="mt-4 px-4 py-2 rounded text-white" 
                style="background-color: <?php echo esc_attr($settings['tcwt_btncolor']); ?>; color: <?php echo esc_attr($settings['tcwt_textcolor']); ?>;">
                <?php echo esc_html($settings['tcwt_btntext']); ?>
            </button>
        </div>
        <?php
    }

    /**
     * Display the tips form based on page context
     */
    public function display_tips_form() {
        $settings = $this->get_settings();

        // Determine context: Cart or Checkout
        if (is_cart() && $settings['tcwt_cart'] === 'on') {
            $this->render_tips_form($settings);
        } elseif (is_checkout() && $settings['tcwt_checkout'] === 'on') {
            $this->render_tips_form($settings);
        }
    }
}
