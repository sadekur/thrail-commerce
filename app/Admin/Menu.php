<?php

namespace Thrail\Commerce\Admin;

use Thrail\Commerce\Classes\Trait\Hookable;
use Thrail\Commerce\Classes\Helper\Utility;

class Menu {
    use Hookable;

    function __construct() {
        // Hook into the admin_menu action
        $this->action( 'admin_menu', [ $this, 'add_admin_menu' ] );
    }

    public function add_admin_menu() {
        add_menu_page(
            'Thrail Commerce',
            'Thrail Commerce',
            'manage_options',
            'thrail-commerce',
            [ $this, 'admin_page_content' ],
            'dashicons-admin-generic',
            20
        );

        $settings = get_option( 'thrail_commerce_settings', [] );

        if (isset($settings['woocommerce-tips']) && $settings['woocommerce-tips'] === 'on') {
            add_submenu_page(
                'thrail-commerce',
                'Thrail Commerce Settings',
                'Settings',
                'manage_options',
                'thrail-commerce-tip-settings',
                [ $this, 'settings_page_content' ]
            );
        }
    }
    public function admin_page_content() {
    ?>
        <div class="wrap">
            <div id="thrail_commerce_render"></div>
        </div>
    <?php
    }

    public function settings_page_content() {
        $settings = get_option('thrail_commerce_tips_settings', []);
        $defaults = [
            'tcwt_cart'      => 'off',
            'tcwt_checkout'  => 'off',
            'tcwt_note'      => 'off',
            'tcwt_btncolor'  => '#289dcc',
            'tcwt_btntext'   => 'Add Donation',
            'tcwt_textcolor' => '#FFFFFF',
        ];
    
        $settings = wp_parse_args($settings, $defaults);
        echo Utility::get_template( 'settings', 'settings', $settings );
    }  
}
