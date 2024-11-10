<?php

namespace Thrail\Commerce\Admin;

use Thrail\Commerce\Classes\Trait\Hookable;

class Menu
{
    use Hookable;

    function __construct()
    {
        // Hook into the admin_menu action
        $this->action('admin_menu', [$this, 'add_admin_menu']);
    }

    public function add_admin_menu()
    {
        add_menu_page(
            'Thrail Commerce',
            'Thrail Commerce',
            'manage_options',
            'thrail-commerce',
            [$this, 'admin_page_content'],
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
                'thrail-commerce-settings',
                [ $this, 'settings_page_content' ]
            );
        }
    }

    // Function to display the content of the main admin page
    public function admin_page_content()
    {
?>
        <div class="wrap">
            <div id="thrail_commerce_render"></div>
        </div>
    <?php
    }

    public function settings_page_content(){
    ?>
    <div class="p-6 bg-white shadow rounded-lg">
        <h2 class="text-2xl font-semibold mb-4"><?php esc_html_e( 'Woocommerce Tip Settings', 'thrail-commerce' ); ?></h2>
        <div class="p-6 bg-white shadow rounded-lg">
            <table class="w-full text-left">
                <tbody>
                    <!-- Cart Page Toggle -->
                    <tr class="border-b">
                        <th class="py-4 px-2 font-medium"><?php esc_html_e( 'Add on Cart Page', 'thrail-commerce' ); ?></th>
                        <td class="py-4 px-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" name="wdgk_cart" value="on">
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                            <p class="text-sm text-gray-500 mt-1"><?php esc_html_e( 'Enable to display donation on the cart page.', 'thrail-commerce' ); ?></p>
                            <p class="text-sm text-gray-500">
                                <strong><?php esc_html_e( 'Note: ', 'thrail-commerce' ); ?></strong><?php esc_html_e( 'When using WooCommerce blocks on the cart page, use the Woo donations block.
                                For more details ', 'thrail-commerce' ); ?><a href="https://youtube.com" target="_blank" class="text-blue-600 underline">watch the video</a>.
                            </p>
                        </td>
                    </tr>

                    <!-- Checkout Page Toggle -->
                    <tr class="border-b">
                        <th class="py-4 px-2 font-medium"><?php esc_html_e( 'Add on Checkout Page', 'thrail-commerce' ); ?></th>
                        <td class="py-4 px-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" name="wdgk_checkout" value="on">
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                            <p class="text-sm text-gray-500 mt-1"><?php esc_html_e( 'Enable to display donation on the checkout page.', 'thrail-commerce' ); ?></p>
                            <p class="text-sm text-gray-500">
                                <strong><?php esc_html_e( 'Note: ', 'thrail-commerce' ); ?></strong><?php esc_html_e( 'When using WooCommerce blocks on the checkout page, use the Woo donations block. For more details ', 'thrail-commerce' ); ?><a href="https://youtu.be/t9JjLhYcu54" target="_blank" class="text-blue-600 underline"<?php esc_html_e( 'watch the video', 'thrail-commerce' ); ?>></a>.
                            </p>
                        </td>
                    </tr>

                    <!-- Add Note Toggle -->
                    <tr class="border-b">
                        <th class="py-4 px-2 font-medium">Add Note</th>
                        <td class="py-4 px-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" name="wdgk_note" value="on">
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                            <p class="text-sm text-gray-500 mt-1">Enable to display a note on the donation.</p>
                        </td>
                    </tr>

                    <!-- Button Color Picker -->
                    <tr class="border-b">
                        <th class="py-4 px-2 font-medium">Button Color</th>
                        <td class="py-4 px-2">
                            <input type="color" name="wdgk_btncolor" class="w-10 h-10 p-1 rounded border border-gray-300 cursor-pointer" value="#289dcc">
                            <p class="text-sm text-gray-500 mt-1">Select donation button color.</p>
                        </td>
                    </tr>

                    <!-- Button Text Input -->
                    <tr class="border-b">
                        <th class="py-4 px-2 font-medium">Button Text</th>
                        <td class="py-4 px-2">
                            <input type="text" name="wdgk_btntext" class="w-4/12 border border-gray-300 p-2 rounded" value="Add Donation">
                            <p class="text-sm text-gray-500 mt-1">Add Donation button text.</p>
                        </td>
                    </tr>

                    <!-- Button Text Color Picker -->
                    <tr class="border-b">
                        <th class="py-4 px-2 font-medium">Button Text Color</th>
                        <td class="py-4 px-2">
                            <input type="color" name="wdgk_textcolor" class="w-10 h-10 p-1 rounded border border-gray-300 cursor-pointer" value="#FFFFFF">
                            <p class="text-sm text-gray-500 mt-1">Select donation button text color.</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Submit Button -->
            <input type="hidden" name="wdgk_wpnonce" value="">
            <button type="submit" class="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700">Save Changes</button>
        </div>
    </div>
    <?php
    }
}
