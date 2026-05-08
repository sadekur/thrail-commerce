<?php

namespace CommerceKit\Commerce\Frontend;

class Shortcode {

	function __construct() {
		add_action( 'wp_header', [ $this, 'shortcode_handler' ] );
	}

	public function shortcode_handler() {
		echo "<h1>Test Shortcode</h1>";
	}
}