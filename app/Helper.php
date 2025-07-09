<?php
namespace Thrail\Commerce;

class Helper {
    public static function get_template( $template_name, $path, $data = [] ) {
        $template_path = plugin_dir_path(__FILE__) . $path . '/' . $template_name . '.php';
        print_r($template_path);

        if (file_exists($template_path)) {
            // Extract data to variables
            extract($data);

            // Start output buffering
            ob_start();
            include $template_path;
            return ob_get_clean();
        }

        return '<p>' . esc_html__('Template not found!', 'thrail-commerce') . '</p>';
    }
}
