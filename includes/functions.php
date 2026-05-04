<?php
// Exit if accessed directly
if ( !defined('ABSPATH' ) ) {
	exit;
}
/**
 * Function to set up the database table for CommerceKit
 */
// if( ! function_exists( 'commerce_kit_activate' ) ) :
// 	function commerce_kit_activate() {
// 		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
// 		global $wpdb;
// 		$table_name = $wpdb->prefix . 'commerce_kit_leads';
// 		$charset_collate = $wpdb->get_charset_collate();
//
// 		$sql = "CREATE TABLE $table_name (
// 			id mediumint(9) NOT NULL AUTO_INCREMENT,
// 			name tinytext NOT NULL,
// 			email text NOT NULL,
// 			time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
// 			PRIMARY KEY  (id)
// 		) $charset_collate;";
//
// 		dbDelta($sql);
// 	}
// endif;


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

        foreach ($categories as $category) {
            $blocks = glob( rtrim( $category, '/' ) . '/*', GLOB_ONLYDIR );

            foreach ($blocks as $block) {
                $block_name = basename($block);
                $block_option_key = "{$block_name}";

                if (isset($block_settings[$block_option_key]) && $block_settings[$block_option_key] === 'on') {
                    $active_blocks[] = $block_name;
                }
            }
        }

        return $active_blocks;
    }
endif;