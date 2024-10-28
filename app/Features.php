<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Trait\Hookable;

class Features {
    use Hookable;

    public function __construct() {
        $this->filter( 'init', [ $this, 'features_register' ] );
    }

    public function features_register() {
        // Get the setting from the database
        $settings = get_option('thrail_commerce_settings', []);
        
        // Define feature directory structure
        $features = [
            'woocommerce-tips' => 'woocommerce-tips',
            'woocommerce-faq' => 'woocommerce-faq',
            'woocommerce-product_barcode' => 'woocommerce-product-barcode',
            'woocommerce-tips2' => 'woocommerce-tips2',
        ];

        foreach ($features as $feature_key => $feature_directory) {
            // Check if the feature is enabled
            if (isset($settings[$feature_key]) && $settings[$feature_key] === 'on') {
                $file = THRAIL_COMMERCE_PATH . "/features/{$feature_directory}/{$feature_directory}.php";

                if (file_exists($file)) {
                    require_once $file;

                    // Convert feature directory name to class name (e.g., woocommerce-tips to WoocommerceTips)
                    $class_name = str_replace(' ', '', ucwords(str_replace(['-', '_'], ' ', $feature_directory)));
                    $class = "\\Thrail\\Commerce\\Features\\{$class_name}";
                    update_option('thrail_commerce_class', $class);

                    // Instantiate the feature class if it exists
                    if (class_exists($class)) {
                        new $class();
                    }
                }
            }
        }
    }
}
