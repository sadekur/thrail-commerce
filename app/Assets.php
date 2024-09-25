<?php
namespace Thrail\Commerce;
use Thrail\Commerce\Classes\Hookable;
require_once __DIR__ . '/../classes/Trait/Trait.php';

class Assets {
	use Hookable;

	public $plugin;
	public $slug;
	public $name;
	public $version;
	public $assets;

	function __construct() {
		// $this->plugin	= $plugin;
		// $this->slug		= $this->plugin['TextDomain'];
		// $this->name		= $this->plugin['Name'];
		// $this->version	= $this->plugin['Version'];
		// $this->assets 	= TRAIL_COMMERCE_ASSETS;

		$this->action('wp_enqueue_scripts', [$this, 'register_frontend_assets']);
		$this->action('admin_enqueue_scripts', [$this, 'register_admin_assets']);
	}

	public function get_scripts() {
		return [
			'thrail-commerce-frontent-script' => [
				'src'     => TRAIL_COMMERCE_ASSETS . '/js/frontend.js',
				'version' => filemtime( TRAIL_COMMERCE_PATH . '/assets/js/frontend.js' ),
				'deps'    => ['jquery']
			],
			'thrail-commerce-menu-script' => [
				'src'     => TRAIL_COMMERCE_URL . 'spa/build/admin.build.js',
				'version' => time(),
			],
			'thrail-commerce-admin-script' => [
				'src'     => TRAIL_COMMERCE_ASSETS . '/js/admin.js',
				'version' => filemtime( TRAIL_COMMERCE_PATH . '/assets/js/admin.js' ),
				'deps'    => [ 'jquery', 'wp-util', 'jquery-ui-dialog' ]
			],
			'thrail-commerce-admin-tailwind-script' =>[
				'src' => TRAIL_COMMERCE_URL . 'spa/build/tailwind.build.js',
				'version' => time(),
			],
		];
	}

	public function get_styles() {
		return [
			'thrail-commerce-frontend-style' => [
				'src'     => TRAIL_COMMERCE_ASSETS . '/css/frontend.css',
				'version' => filemtime( TRAIL_COMMERCE_PATH . '/assets/css/frontend.css' )
			],
			'thrail-commerce-admin-style' => [
				'src'     => TRAIL_COMMERCE_ASSETS . '/css/admin.css',
				'version' => filemtime( TRAIL_COMMERCE_PATH . '/assets/css/admin.css' ),
				'deps'    => [ 'wp-jquery-ui-dialog' ]
			],
			'jquery-ui' => [
				'src'     => 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
				'version' => filemtime( TRAIL_COMMERCE_PATH . '/assets/css/jquery-ui.css' )
			],
		];
	}

	public function register_frontend_assets() {
		$scripts 	= $this->get_scripts();
		$styles 	= $this->get_styles();

		wp_register_script( 'thrail-commerce-frontent-script', $scripts[ 'thrail-commerce-frontent-script' ][ 'src' ], $scripts[ 'thrail-commerce-frontent-script' ][ 'deps' ], $scripts[ 'thrail-commerce-frontent-script' ][ 'version' ], true );

		wp_localize_script( 'thrail-commerce-frontent-script', 'WOOHUB', [
			'ajaxurl' => admin_url( 'admin-ajax.php'),
			'nonce'   => wp_create_nonce( 'thrail-commerce'),
			'error'   => __( 'Something went wrong', 'thrail-commerce' )
		]);

		wp_register_style( 'thrail-commerce-frontend-style', $styles[ 'thrail-commerce-frontend-style' ][ 'src' ], [], $styles[ 'thrail-commerce-frontend-style' ]['version' ] );

		wp_enqueue_script( 'thrail-commerce-frontent-script' );
		wp_enqueue_style( 'thrail-commerce-frontend-style' );
	}

	public function register_admin_assets() {
		$scripts = $this->get_scripts();
		$styles = $this->get_styles();
	
		wp_register_script('thrail-commerce-menu-script', $scripts['thrail-commerce-menu-script']['src'], [], $scripts['thrail-commerce-menu-script']['version'], true);

		wp_register_script('thrail-commerce-admin-script', $scripts['thrail-commerce-admin-script']['src'], $scripts['thrail-commerce-admin-script']['deps'], $scripts['thrail-commerce-admin-script']['version'], true);

		wp_register_script('thrail-commerce-admin-tailwind-script', $scripts['thrail-commerce-admin-tailwind-script']['src'], [], $scripts['thrail-commerce-admin-tailwind-script']['version'], true);
		
		wp_localize_script('thrail-commerce-admin-script', 'THRAIL', [
			'nonce'   => wp_create_nonce('nonce'),
			'ajaxurl' => admin_url('admin-ajax.php'),
			'error'   => __('Something went wrong', 'thrail-commerce')
		]);
	
		wp_register_style('thrail-commerce-admin-style', 
			$styles['thrail-commerce-admin-style']['src'], 
			[], 
			$styles['thrail-commerce-admin-style']['version']
		);
		wp_register_style('jquery-ui', 
			$styles['jquery-ui']['src'], 
			[], 
			$styles['jquery-ui']['version']
		);
	
		wp_enqueue_script('thrail-commerce-admin-script');
		wp_enqueue_script('thrail-commerce-menu-script');
		wp_enqueue_script('thrail-commerce-admin-tailwind-script');
		wp_enqueue_style('thrail-commerce-admin-style');
		wp_enqueue_style('jquery-ui');
	}	
}