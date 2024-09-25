<?php
namespace Thrail\Commerce\Admin;

class Menu {

    function __construct() {
        // Hook into the admin_menu action
        add_action( 'admin_menu', [ $this, 'add_admin_menu' ] );
    }
    public function add_admin_menu() {
        // Add a new top-level menu
        add_menu_page(
            'Thrail Commerce',
            'Thrail Commerce',
            'manage_options',
            'thrail-commerce',
            [ $this, 'admin_page_content' ],
            'dashicons-admin-generic',
            20
        );
    }

    // Function to display the content of the admin page
    public function admin_page_content() {
        ?>
<div class="wrap">
    <div id="thrail_commerce_render"></div>
</div>
<?php
    }
}