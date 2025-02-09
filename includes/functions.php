<?php
use Thrail\Commerce\Classes\Helper\Utility;
// Exit if accessed directly
if ( !defined('ABSPATH' ) ) {
	exit;
}
/**
 * Function to set up the database table for Thrail CRM
 */
// if( ! function_exists( 'thrail_crm_activate' ) ) :
// 	function thrail_crm_activate() {
// 		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
// 		global $wpdb;
// 		$table_name = $wpdb->prefix . 'thrail_crm_leads';
// 		$charset_collate = $wpdb->get_charset_collate();

// 		$sql = "CREATE TABLE $table_name (
// 			id mediumint(9) NOT NULL AUTO_INCREMENT,
// 			name tinytext NOT NULL,
// 			email text NOT NULL,
// 			time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
// 			PRIMARY KEY  (id)
// 		) $charset_collate;";

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
        $blocks_dir     = THRAIL_COMMERCE_PATH . 'blocks/';
        $categories     = glob( $blocks_dir );

        $active_blocks = [];

        foreach ( $categories as $category ) {
            $blocks = glob( $category . '/*', GLOB_ONLYDIR );

            foreach ( $blocks as $block ) {
                $block_name   = basename( $block );
                $block_status = Utility::get_option( 'block', 'settings', $block_name, 'off' );

                if ( $block_status === 'on') {
                    $active_blocks[] = $block_name;
                }
            }
        }

        return $active_blocks;
    }
endif;