<?php
namespace Thrail\Commerce\Classes\Helper;

defined( 'ABSPATH' ) || exit;


/**
 * Utility class with static helper functions for general use throughout the plugin.
 */
class Utility {


	/**
	 * Retrieves an option from the WordPress database, formatted according to Thrail Commerce settings.
	 *
	 * This function gets an option using a combination of the provided menu, submenu, and key.
	 * If the option is not set, a default value is returned.
	 *
	 * @param string $menu The menu name or key to be used as part of the option name.
	 * @param string $submenu The submenu name or key to be used as part of the option name.
	 * @param string $key The specific option key to retrieve within the option array.
	 * @param mixed  $default Optional. The default value to return if the option key is not set. Default is an empty string.
	 *
	 * @return mixed The value of the option if it exists, or the default value if it doesn't.
	 */
	public static function get_option( $menu, $submenu, $key, $default = '' ) {
		$option = get_option( "thrailcommerce-{$menu}-{$submenu}" );

		if ( ! isset( $option[ $key ] ) ) {
			return $default;
		}

		return $option[ $key ];
	}

	/**
	 * Formats a date string according to WordPress settings.
	 *
	 * @param string $date The date string (e.g., 'Y-m-d H:i:s').
	 * @param string $format Optional. PHP date format. Defaults to WordPress date format setting.
	 * @return string Formatted date string.
	 */
	public static function format_date( $date, $format = '' ) {
		if ( empty( $format ) ) {
			$format = get_option( 'date_format' );
		}

		return date_i18n( $format, strtotime( $date ) );
	}

	/**
	 * Prints information about a variable in a more readable format.
	 *
	 * @param mixed $data The variable you want to display.
	 * @param bool  $admin_only Should it display in wp-admin area only
	 * @param bool  $hide_adminbar Should it hide the admin bar
	 */
	public static function pri( $data, $admin_only = true, $hide_adminbar = true ) {
		if ( $admin_only && ! current_user_can( 'manage_options' ) ) {
			return;
		}

		echo '<pre>';
		if ( is_object( $data ) || is_array( $data ) ) {
			print_r( $data );
		} else {
			var_dump( $data );
		}
		echo '</pre>';

		if ( is_admin() && $hide_adminbar ) {
			echo '<style>#adminmenumain{display:none;}</style>';
		}
	}

	/**
	 * Includes a template file from the 'view' directory.
	 *
	 * @param string $template The template file name.
	 * @param array  $args Optional. An associative array of variables to pass to the template file.
	 */
    public static function get_template( $template_name, $path, $data = [] ) {
        $template_path = THRAIL_COMMERCE_PATH . 'app/settings/' . $template_name . '.php';
        print_r($template_path);

        if ( file_exists( $template_path ) ) {
            // Extract data to variables
            extract( $data );
            ob_start();
            include $template_path;
            return ob_get_clean();
        }

        return '<p>' . esc_html__('Template not found!', 'thrail-commerce') . '</p>';
    }
}
