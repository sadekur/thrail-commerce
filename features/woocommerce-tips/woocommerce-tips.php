<?php
namespace Thrail\Commerce\Features;

class WoocommerceTips {
    public function __construct() {
        add_action('wp_footer', [$this, 'footer_feature']);
    }

    public function footer_feature() {
        // Feature logic here
        echo '<p class="woocommerce-tips text-center text-[20px] bg-[#f1f1f1] text-[#50d71e]">Tip: Remember to check out our featured products!</p>';
    }
}
