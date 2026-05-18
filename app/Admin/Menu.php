<?php

namespace CommerceKit\Commerce\Admin;

use CommerceKit\Commerce\Classes\Trait\Hookable;
use CommerceKit\Commerce\Classes\Helper\Utility;

class Menu {
    use Hookable;

    function __construct() {
        $this->action( 'admin_menu', [ $this, 'add_admin_menu' ] );
    }

    public function add_admin_menu() {
        add_menu_page(
            'CommerceKit',
            'CommerceKit',
            'manage_options',
            'commerce-kit',
            [ $this, 'admin_page_content' ],
            'dashicons-admin-generic',
            20
        );

        add_submenu_page(
            'commerce-kit',
            __( 'Dashboard', 'commerce-kit' ),
            __( 'Dashboard', 'commerce-kit' ),
            'manage_options',
            'commerce-kit',
            [ $this, 'admin_page_content' ]
        );

        // Always register all feature submenus — JS hides/shows them based on saved settings
        // without requiring a page reload when features are toggled from the React UI.
        add_submenu_page(
            'commerce-kit',
            __( 'Stock Threshold', 'commerce-kit' ),
            __( 'Stock Threshold', 'commerce-kit' ),
            'manage_options',
            'commerce-kit#/stock-threshold',
            [ $this, 'admin_page_content' ]
        );

        add_submenu_page(
            'commerce-kit',
            'CommerceKit Tips Settings',
            'Tips Settings',
            'manage_options',
            'commerce-kit#/commerce-kit-tip-settings',
            [ $this, 'admin_page_content' ]
        );
    }

    public function admin_page_content() {
        ?>
        <div class="wrap">
            <div id="commerce_kit_render"></div>
        </div>
        <?php
    }

    public function settings_page_content() {
        $settings = get_option( 'commercekit-tips-settings', [] );
        $defaults = [
            'tcwt_cart'      => 'off',
            'tcwt_checkout'  => 'off',
            'tcwt_note'      => 'off',
            'tcwt_btncolor'  => '#289dcc',
            'tcwt_btntext'   => 'Add Donation',
            'tcwt_textcolor' => '#FFFFFF',
        ];
        $settings = wp_parse_args( $settings, $defaults );
        echo Utility::get_template( 'settings', 'settings', $settings );
    }
}