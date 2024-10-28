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
        
        $features = [
            'woocommerce-tips' => 'woocommerce-tips',
            'woocommerce_faq' => 'woocommerce-faq',
            'woocommerce_product_barcode' => 'woocommerce-product-barcode',
            'woocommerce_tips2' => 'woocommerce-tips2',
        ];
        foreach ($features as $feature_key => $feature_directory) {
            if (isset($settings[$feature_key]) && $settings[$feature_key] === 'on') {
                $file = THRAIL_COMMERCE_PATH . "/features/{$feature_directory}/{$feature_directory}.php";
                update_option('fidsadasddasdasdle', $file);
                
                if (file_exists($file)) {
                    require_once $file;
                    
                    // Instantiate the module's class if needed
                    $class = "\\Thrail\\Commerce\\Features\\" . ucfirst(str_replace('_', '', $feature_directory));
                    if (class_exists($class)) {
                        new $class();
                    }
                }
            }
        }
    }
}
