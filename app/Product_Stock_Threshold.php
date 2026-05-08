<?php
namespace CommerceKit\Commerce;

use CommerceKit\Commerce\Classes\Trait\Hookable;

/**
 * Adds Stock Threshold tab to WooCommerce product edit page
 */
class Product_Stock_Threshold {
    use Hookable;

    public function __construct() {
        if ( is_admin() ) {
            $this->filter( 'woocommerce_product_data_tabs', [ $this, 'add_product_tab' ] );
            $this->action( 'woocommerce_product_data_panels', [ $this, 'render_product_tab_panel' ] );
            $this->action( 'woocommerce_process_product_meta', [ $this, 'save_product_meta' ] );
        }
    }

    /**
     * Add custom tab to product edit page
     */
    public function add_product_tab( $tabs ) {
        $tabs['commercekit_stock_threshold'] = [
            'label'    => __( 'Stock Threshold', 'commerce-kit' ),
            'target'   => 'commercekit_stock_threshold_product_panel',
            'class'    => [ 'show_if_simple', 'show_if_variable' ],
            'priority' => 50,
        ];
        return $tabs;
    }

    /**
     * Render tab panel content
     */
    public function render_product_tab_panel() {
        global $post;
        $product = wc_get_product( $post->ID );
        if ( ! $product ) {
            return;
        }

        $enabled = $product->get_meta( '_commercekit_stock_threshold_enabled', true );
        $custom_message = $product->get_meta( '_commercekit_stock_threshold_message', true );

        // Default to enabled if not set
        $enabled = $enabled === '' ? 'yes' : $enabled;
        ?>
        <div id="commercekit_stock_threshold_product_panel" class="panel woocommerce_options_panel">
            <div class="options_group">
                <?php
                woocommerce_wp_checkbox( [
                    'id'          => '_commercekit_stock_threshold_enabled',
                    'label'       => __( 'Enable Stock Threshold', 'commerce-kit' ),
                    'description' => __( 'Enable dynamic pricing and custom messages for this product', 'commerce-kit' ),
                    'value'       => $enabled,
                ] );

                woocommerce_wp_text_input( [
                    'id'          => '_commercekit_stock_threshold_message',
                    'label'       => __( 'Custom Message Override', 'commerce-kit' ),
                    'description' => __( 'Override global customer message. Leave empty to use global setting.', 'commerce-kit' ),
                    'value'       => $custom_message,
                    'desc_tip'    => true,
                ] );
                ?>
            </div>
        </div>
        <?php
    }

    /**
     * Save product meta
     */
    public function save_product_meta( $product_id ) {
        $product = wc_get_product( $product_id );
        if ( ! $product ) {
            return;
        }

        $enabled = isset( $_POST['_commercekit_stock_threshold_enabled'] ) ? 'yes' : 'no';
        $product->update_meta_data( '_commercekit_stock_threshold_enabled', $enabled );

        $custom_message = isset( $_POST['_commercekit_stock_threshold_message'] ) 
            ? sanitize_text_field( $_POST['_commercekit_stock_threshold_message'] ) 
            : '';
        $product->update_meta_data( '_commercekit_stock_threshold_message', $custom_message );

        $product->save();
    }
}
