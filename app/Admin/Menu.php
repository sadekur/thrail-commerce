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

        $settings = get_option( 'commerce_kit_settings', [] );

        if ( isset( $settings['stock-threshold-for-wc'] ) && $settings['stock-threshold-for-wc'] === 'on' ) {
            add_submenu_page(
                'commerce-kit',
                __( 'Stock Threshold', 'commerce-kit' ),
                __( 'Stock Threshold', 'commerce-kit' ),
                'manage_options',
                'commerce-kit#/stock-threshold',
                [ $this, 'admin_page_content' ]
            );
        }

        if ( isset( $settings['woocommerce-tips'] ) && $settings['woocommerce-tips'] === 'on' ) {
            add_submenu_page(
                'commerce-kit',
                'CommerceKit Tips Settings',
                'Tips Settings',
                'manage_options',
                'commerce-kit-tip-settings',
                [ $this, 'settings_page_content' ]
            );
        }
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