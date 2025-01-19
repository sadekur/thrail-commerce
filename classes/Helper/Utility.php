<?php
namespace Thrail\Commerce\Classes\Helper;

defined( 'ABSPATH' ) || exit;

use EasyCommerce\Trait\Cache;

/**
 * Utility class with static helper functions for general use throughout the plugin.
 */
class Utility {

	use Cache;

	/**
	 * Retrieves an option from the WordPress database, formatted according to EasyCommerce settings.
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
		$option = get_option( "easycommerce-{$menu}-{$submenu}" );

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
	 * Formats a price
	 *
	 * @param float       $price The price
	 * @param string|null $currency The currency symbol (default is '$')
	 * @param bool|string $separator Thousand separator: use ',' for comma, '.' for dot, or false for no separator
	 * @return string Formatted price string.
	 */
	public static function format_price( $price, $currency = null, $separator = ',' ) {
		// Set default currency to '$' if not provided
		$currency = $currency ?: easycommerce_currency_symbol();

		// Ensure price is numeric
		if ( ! is_numeric( $price ) ) {
			$price = (float) $price;
		}

		// Check if price is a whole number or has decimals
		$decimal = floor( $price ) == $price ? 0 : 2;

		$is_negetive = false;
		if ( $price < 0 ) {
			$price       = -1 * $price;
			$is_negetive = true;
		}

		if ( $separator === ',' || $separator === '.' ) {
			$price = number_format( $price, $decimal, '.', $separator );
		}

		return $is_negetive ? ( '-' . $currency . $price ) : ( $currency . $price );
	}

	/**
	 * Logs messages to a specific log file.
	 *
	 * @param mixed  $message The message to log. If not a string, it will be converted to JSON.
	 * @param string $log_file The log file to write to within the wp-content directory.
	 */
	public static function log_debug( $message, $log_file = 'debug.log' ) {
		global $wp_filesystem;

		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		WP_Filesystem();

		if ( ! is_string( $message ) ) {
			$message = wp_json_encode( $message );
		}

		if ( ! file_exists( $log_path = WP_CONTENT_DIR . '/easycommerce-logs/' . $log_file ) ) {
			$wp_filesystem->mkdir( dirname( $log_path ) );
			$wp_filesystem->put_contents( $log_path, '', FS_CHMOD_FILE );
		}

		$log_entry = sprintf( "[%s] %s\n", current_time( 'mysql' ), $message );

		$wp_filesystem->put_contents( $log_path, $log_entry, FS_CHMOD_FILE | FILE_APPEND );
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
	public static function get_template( $template, $args = array() ) {
		$path = EASYCOMMERCE_PLUGIN_DIR . 'views/' . $template;

		if ( file_exists( $path ) ) {
			if ( ! empty( $args ) && is_array( $args ) ) {
				extract( $args );
			}

			ob_start();
			include $path;
			return ob_get_clean();
		} else {
			error_log( 'Template file not found: ' . $path );
		}
	}

	/**
	 * @param bool $show_cached either to use a cached list of posts or not. If enabled, make sure to wp_cache_delete() with the `save_post` hook
	 */
	public static function get_posts( $args = array(), $show_heading = false, $show_cached = false, $key = 'ID' ) {

		$cacher = new self();

		$defaults = array(
			'post_type'      => 'post',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		);

		$_args = wp_parse_args( $args, $defaults );

		// use cache
		if ( true === $show_cached && ( $cached_posts = $cacher->get_cache( "easycommerce_{$_args['post_type']}" ) ) ) {
			$posts = $cached_posts;
		}

		// don't use cache
		else {
			$queried = new \WP_Query( $_args );

			$posts = array();
			foreach ( $queried->posts as $post ) :
				if ( isset( $post->$key ) ) {
					$posts[ $post->$key ] = $post->post_title;
				} else {
					$posts[ $post->ID ] = $post->post_title;
				}
			endforeach;

			$cacher->set_cache( "easycommerce_{$_args['post_type']}", $posts );
		}

		/* Translators: %s is the post type that the user should choose. */
		$posts = $show_heading ? array( '' => sprintf( __( '- Choose a %s -', 'easycommerce' ), $_args['post_type'] ) ) + $posts : $posts;

		return apply_filters( 'easycommerce_get_posts', $posts, $_args );
	}

	public static function create_post( $args ) {

		// Define default arguments
		$defaults = array(
			'title'   => 'Default Title',
			'content' => 'Default Content',
			'type'    => 'post',
			'status'  => 'publish',
			'author'  => get_current_user_id(),
		);

		// Merge provided args with defaults
		$args = wp_parse_args( $args, $defaults );

		// Insert the post
		$post_id = wp_insert_post(
			array(
				'post_title'   => $args['title'],
				'post_content' => $args['content'],
				'post_type'    => $args['type'],
				'post_status'  => $args['status'],
				'post_author'  => $args['author'],
			)
		);

		return $post_id;
	}

	/**
	 * Generates a hash
	 */
	public static function generate_hash() {
		return wp_hash( uniqid( wp_rand(), true ) );
	}

	/**
	 * Converts a price string to a numeric value.
	 *
	 * @param string $price The price string to convert.
	 * @return int The numeric value of the price.
	 */
	public static function price_numaric( $price ) {
		return intval( preg_replace( '/[^0-9]/', '', $price ) );
	}
	/**
	 * Get date range
	 *
	 * @param string $range The date range to query.
	 * @return array
	 */
	public static function get_date_range( $range = 'all' ) {
		$to_date   = current_time( 'Y-m-d' );
		$from_date = '1970-01-01';
		switch ( $range ) {
			case 'today':
				$from_date = $to_date;
				break;

			case 'yesterday':
				$from_date = gmdate( 'Y-m-d', strtotime( '-1 day' ) );
				$to_date   = $from_date;
				break;

			case 'this-week':
				$start_of_week    = get_option( 'start_of_week' );
				$current_day      = gmdate( 'w' );
				$days_to_subtract = ( $current_day - $start_of_week + 7 ) % 7;
				$from_date        = gmdate( 'Y-m-d', strtotime( "-{$days_to_subtract} days" ) );
				break;

			case 'last-week':
				$start_of_week   = get_option( 'start_of_week' ) - 1;
				$last_week_start = gmdate( 'Y-m-d', strtotime( 'last week +' . $start_of_week . ' days' ) );
				$from_date       = $last_week_start;
				$to_date         = gmdate( 'Y-m-d', strtotime( $last_week_start . ' +6 days' ) );
				break;

			case 'last-7':
				$from_date = gmdate( 'Y-m-d', strtotime( '-7 days' ) );
				break;

			case 'this-month':
				$from_date = gmdate( 'Y-m-01' );
				break;

			case 'last-month':
				$from_date = gmdate( 'Y-m-01', strtotime( '-1 month' ) );
				$to_date   = gmdate( 'Y-m-t', strtotime( '-1 month' ) );

				break;

			case 'last-30':
				$from_date = gmdate( 'Y-m-d', strtotime( '-30 days' ) );

				break;

			case 'this-year':
				$from_date = gmdate( 'Y-01-01' );
				break;

			case 'last-year':
				$from_date = gmdate( 'Y-01-01', strtotime( '-1 year' ) );
				$to_date   = gmdate( 'Y-12-31', strtotime( '-1 year' ) );
				break;

			case 'all':
				$from_date = '1970-01-01';
		}

		return array( $from_date, $to_date );
	}
}
