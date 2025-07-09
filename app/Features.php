<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class Features {
    use Hookable;

    public function __construct() {
        $this->filter( 'init', [ $this, 'features_register' ] );
    }

    public function features_register() {
        $settings = get_option('thrail_commerce_settings', []);
        $features = [
            'woocommerce-tips'              => 'woocommerce-tips',
            'woocommerce-faq'               => 'woocommerce-faq',
            'woocommerce-product_barcode'   => 'woocommerce-product-barcode',
            'buy-button-for-woocommerce'    => 'buy-button-for-woocommerce',
        ];

        foreach ($features as $feature_key => $feature_directory) {
            if (isset($settings[$feature_key]) && $settings[$feature_key] === 'on') {
                $file = THRAIL_COMMERCE_PATH . "features/{$feature_directory}/{$feature_directory}.php";

                if (file_exists($file)) {
                    require_once $file;
                    $class_name = str_replace(' ', '', ucwords(str_replace(['-', '_'], ' ', $feature_directory)));
                    $class = "\\Thrail\\Commerce\\Features\\{$class_name}";
                    if (class_exists($class)) {
                        new $class();
                    }
                }
            }
        }
    }
}
