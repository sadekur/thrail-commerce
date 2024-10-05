<?php
namespace Thrail\Commerce\Admin;
use Thrail\Commerce\Classes\Trait\Hookable;

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

        if ( isset( $settings['woocommerce_tips'] ) && $settings['woocommerce_tips'] === 'on' ) {
        add_submenu_page(
            'thrail-commerce',
            'Thrail Commerce Settings',
            'Settings',
            'manage_options',
            'thrail-commerce-settings',
            [ $this, 'settings_page_content' ]
        );
        }
    }

    // Function to display the content of the main admin page
    public function admin_page_content() {
        ?>
        <div class="wrap">
            <div id="thrail_commerce_render"></div>
        </div>
        <?php
    }

    public function settings_page_content() {
        ?>
        <div class="wrap">
            <h1>Thrail Commerce Settings</h1>
            <p>Settings for Thrail dsadasCommerce can be managed here.</p>
        </div>
        <?php
    }
}
