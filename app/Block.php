<?php
namespace Thrail\Commerce;

use Thrail\Commerce\Classes\Trait\Hookable;

class Block {
    use Hookable;

    public $categories = [];

    public function __construct() {
        $this->categories = [
            'product'   => __( 'Thrail - Commerce', 'thrail-commerce' ),
        ];
        
        $this->filter( 'init', [ $this, 'register' ] );
        $this->filter( 'block_categories_all', [ $this, 'register_category' ] );
    }

    public function register() {
        $blocks_dir     = THRAIL_COMMERCE_PATH . 'spa/blocks/';
        $categories     = glob( $blocks_dir );
        $block_settings = get_option('thrail_commerce_block_settings');
        $block_settings = maybe_unserialize( $block_settings );

        foreach ( $categories as $category ) {
            $category_name = basename( $category );
            update_option('categories', $categories);
            $blocks = glob( $category . '/*', GLOB_ONLYDIR );

            $has_active_block = false;

            foreach ( $blocks as $block ) {
                $block_name = basename( $block );
                $block_type = "{$category_name}/{$block_name}";
                $block_option_key = "{$block_name}";
                if ( isset( $block_settings[$block_option_key] ) && $block_settings[$block_option_key] === 'on' ) {
                    $has_active_block = true;
                    register_block_type( $block );
                }
            }
        }
    }

    /**
     * Register custom block categories.
     *
     * @param array $categories Existing block categories.
     * @return array Updated block categories.
     */
    public function register_category( $categories ) {
        $new_categories = [];

        foreach ( $this->categories as $id => $label ) {
            $new_categories[] = [
                'slug'  => "thrail-commerce-{$id}",
                'title' => $label,
            ];
        }

        return array_merge( $new_categories, $categories );
    }
}
