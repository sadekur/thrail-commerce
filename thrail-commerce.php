<?php
/**
 * Plugin Name:       Thrail Commerce
 * Plugin URI:        https://srs.com
 * Description:       A plugin Thrail Commerce for Customert.
 * Version:           1.0.0
 * Requires at least: 5.9
 * Requires PHP:      7.2
 * Author:            SRS
 * Author URI:        https://srs.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:        thrail-commerce
 * Domain Path:       /languages
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';
// require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
// register_activation_hook(__FILE__, 'thrail_crm_activate');

/**
 * The main plugin class
 */
final class THRAIL_COMMERCE{

	/**
	 * Plugin version
	 *
	 * @var string
	 */
	const version = '1.0';

	/**
	 * Class construcotr
	 */
	private function __construct() {
		$this->define_constants();

		add_action( 'plugins_loaded', [ $this, 'init_plugin' ] );
	}

	public static function init() {
		static $instance = false;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * Define the required plugin constants
	 *
	 * @return void
	 */
	public function define_constants() {
		define( 'THRAIL_COMMERCE_VERSION', self::version );
		define( 'THRAIL_COMMERCE_FILE', __FILE__ );
		define('THRAIL_COMMERCE_PATH', plugin_dir_path(__FILE__));
		define('THRAIL_COMMERCE_URL', plugin_dir_url(__FILE__));
		define( 'THRAIL_COMMERCE_ASSETS', THRAIL_COMMERCE_URL . '/assets' );
	}

	/**
	 * Initialize the plugin
	 *
	 * @return void
	 */
	public function init_plugin() {

		new Thrail\Commerce\Assets();
		new Thrail\Commerce\Email();
		new Thrail\Commerce\API();
		new Thrail\Commerce\Common\Init();
		new Thrail\Commerce\Block();

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			new Thrail\Commerce\Ajax();
		}

		if ( is_admin() ) {
			new Thrail\Commerce\Admin();
		} else {
			new Thrail\Commerce\Frontend();
		}

	}
}
function thrail_commerce() {
	return THRAIL_COMMERCE::init();
}

thrail_commerce();