<?php

namespace CommerceKit\Commerce\Frontend;

class Shortcode {

	function __construct() {
		add_action( 'wp_head', [ $this, 'test' ] );
	}

	// Outputs in page footer (visible)
	public function test() {
		echo "<h1>Test Shortcode</h1>";
	}

}