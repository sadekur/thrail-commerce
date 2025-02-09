<?php
namespace Thrail\Commerce;

use Thrail\Commerce\Classes\Trait\Hookable;

class Blocks {
    use Hookable;

    public $categories = [];

    public function __construct() {
        $this->categories = [
            'product' => __( 'Thrail - Commerce', 'thrail-commerce' ),
        ];

        $this->filter( 'init', [ $this, 'blocks_register' ] );
        $this->filter( 'block_categories_all', [ $this, 'add_custom_categories' ] );
    }

    public function blocks_register() {
        $blocks_dir     = THRAIL_COMMERCE_PATH . 'blocks/';
        $categories     = glob( $blocks_dir );
        $block_settings = get_option( 'thrailcommerce-block-settings' );
        $block_settings = maybe_unserialize( $block_settings );

        $active_blocks = [];

        foreach ( $categories as $category ) {
            $category_name = basename( $category );
            $blocks        = glob( $category . '/*', GLOB_ONLYDIR );

            foreach ( $blocks as $block ) {
                $block_name       = basename( $block );
                $block_option_key = "{$block_name}";

                if ( isset( $block_settings[$block_option_key] ) && $block_settings[$block_option_key] === 'on' ) {
                    $active_blocks[] = $block_name;
                    register_block_type( $block );
                }
            }
        }

        // Pass the list of active blocks to JavaScript
        wp_localize_script( 'thrail-commerce-block-script', 'activeBlocks', $active_blocks );
    }

    /**
     * Register custom block categories.
     *
     * @param array $categories Existing block categories.
     * @return array Updated block categories.
     */
    // public function add_custom_categories($categories) {
    //     $new_categories = [];

    //     foreach ($this->categories as $id => $label) {
    //         $new_categories[] = [
    //             'slug' => "thrail-commerce-{$id}",
    //             'title' => $label,
    //         ];
    //     }

    //     return array_merge($categories, $new_categories);
    // }

    public function add_custom_categories( $categories ) {
        foreach ( $this->categories as $id => $label ) {
            array_unshift( $categories, [
                'slug' => "thrail-commerce-{$id}",
                'title' => $label,
            ] );
        }
    
        return $categories;
    }
    
}
