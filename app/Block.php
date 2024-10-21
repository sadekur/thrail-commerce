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
        $blocks_dir = THRAIL_COMMERCE_PATH . 'spa/blocks/';
        $categories = glob( $blocks_dir . '*', GLOB_ONLYDIR );

        foreach ( $categories as $category ) {
            $category_name = basename( $category );
            $blocks = glob( $category . '/*', GLOB_ONLYDIR );

            foreach ( $blocks as $block ) {
                $block_name = basename( $block );
                $block_type = "{$category_name}/{$block_name}";
                
                register_block_type( $block );
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
                'slug'  => "easycommerce-{$id}",
                'title' => $label,
            ];
        }

        return array_merge( $new_categories, $categories );
    }
}