<?php
// Exit if accessed directly
if ( !defined('ABSPATH' ) ) {
	exit;
}
/**
 * Function to set up the database table for CommerceKit
 */
if( ! function_exists( 'commercekit_get_stock_settings' ) ) :
	function commercekit_get_stock_settings() {
        $defaults = [
            'low_threshold'    => 5,
            'low_increase'     => 40,
            'medium_threshold' => 20,
            'medium_increase'  => 20,
            'high_threshold'   => 100,
            'high_decrease'   => 15,
            'enable_message'  => 'off',
            'low_customer_message'    => 'Low stock - high demand item',
            'medium_customer_message' => 'Medium stock - price adjusted',
            'high_customer_message'   => 'High stock - clearance price',
        ];

        $saved = get_option( 'commerce_kit_stock_threshold', [] );
        return array_merge( $defaults, $saved );
    }
endif;


    /**
     * Get active blocks.
     *
     * @return array List of active blocks.
     */
	if( ! function_exists( 'get_active_blocks' ) ) :
    function get_active_blocks() {
        $blocks_dir     = COMMERCE_KIT_PATH . 'blocks/';
        $categories     = glob( $blocks_dir );
        $block_settings = get_option('commerce_kit_block_settings');
        $block_settings = maybe_unserialize($block_settings);

        $active_blocks = [];

        foreach ( $categories as $category ) {
            $blocks = glob( rtrim( $category, '/' ) . '/*', GLOB_ONLYDIR );

            foreach ( $blocks as $block ) {
                $block_name = basename( $block );
                $block_option_key = "{$block_name}";

                if ( isset( $block_settings[$block_option_key] ) && $block_settings[$block_option_key] === 'on' ) {
                    $active_blocks[] = $block_name;
                }
            }
        }

        return $active_blocks;
    }
endif;