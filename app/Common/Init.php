<?php
namespace Thrail\Commerce\Common;
use Thrail\Commerce\Classes\Trait\Hookable;

defined( 'ABSPATH' ) || exit;


class Init {
	use Hookable;

	/**
	 * Constructor to add all hooks.
	 */
	public function __construct() {
		$this->action( 'wp_head', [ $this, 'modal' ] );
		$this->action( 'admin_head', [ $this, 'modal' ] );
	}

	public function modal() {
		echo '
		<div id="thrail-commerce-modal" style="display: none">
			<img id="thrail-commerce-modal-loader" src="' . esc_attr( TRAIL_COMMERCE_ASSETS . '/img/loader.gif' ) . '" />
		</div>';
	}

}