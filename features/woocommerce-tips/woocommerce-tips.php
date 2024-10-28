<?php
namespace Thrail\Commerce\Features;

class WoocommerceTips {
    public function __construct() {
        add_action('wp_footer', [$this, 'footer_feature']);
    }

    public function footer_feature() {
        // Feature logic here
        echo '<p class="woocommerce-tips">Tip: Remember to check out our featured products!</p>';
    }
}
