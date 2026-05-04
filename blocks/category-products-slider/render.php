<?php
/**
 * Render callback for category-products-slider block
 *
 * @param array $attributes Block attributes.
 * @return string Rendered block output.
 */
function render_category_products_slider_block( $attributes ) {
    $category_id   = intval( $attributes['categoryId'] ?? 0 );
    $title         = $attributes['title'] ?? 'Category Products';
    $limit         = intval( $attributes['productLimit'] ?? 10 );
    $autoplay      = ! empty( $attributes['autoplay'] );
    $autoplay_speed = intval( $attributes['autoplaySpeed'] ?? 3000 );

    if ( empty( $category_id ) ) {
        return '<p class="text-sm text-gray-500 p-4">' .
               esc_html__( 'Please select a category ID in block settings.', 'commerce-kit' ) .
               '</p>';
    }

    // WP_Query args for WooCommerce products.
    $args = [
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => $limit,
        'tax_query'      => [
            [
                'taxonomy' => 'product_cat',
                'field'    => 'term_id',
                'terms'    => $category_id,
            ],
        ],
    ];

    $query = new WP_Query( $args );

    if ( ! $query->have_posts() ) {
        return '<p class="text-sm text-gray-500 p-4">' .
               esc_html__( 'No products found in this category.', 'commerce-kit' ) .
               '</p>';
    }

    $slider_id = 'ck-cat-slider-' . wp_rand( 1000, 9999 );
    ob_start();
    ?>
    <div id="<?php echo esc_attr( $slider_id ); ?>" class="commerce-kit-category-slider relative overflow-hidden">
        <?php if ( $title ) : ?>
            <h3 class="text-xl font-semibold mb-4 px-2"><?php echo esc_html( $title ); ?></h3>
        <?php endif; ?>

        <div class="slider-track flex transition-transform duration-500 ease-in-out">
            <?php while ( $query->have_posts() ) : $query->the_post(); global $product; ?>
                <div class="slider-slide flex-shrink-0 w-1/4 px-2">
                    <div class="border border-gray-200 rounded-lg p-4 h-full bg-white shadow-sm">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php echo get_the_post_thumbnail( get_the_ID(), 'woocommerce_thumbnail', ['class' => 'w-full h-48 object-cover rounded mb-3'] ); ?>
                            </a>
                        <?php endif; ?>
                        <h4 class="text-md font-semibold mb-2">
                            <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-blue-600">
                                <?php the_title(); ?>
                            </a>
                        </h4>
                        <div class="text-sm text-gray-600 mb-3">
                            <?php echo $product->get_short_description(); ?>
                        </div>
                        <div class="mt-auto">
                            <span class="text-lg font-bold text-gray-900">
                                <?php echo $product->get_price_html(); ?>
                            </span>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        </div>

        <!-- Navigation -->
        <button class="slider-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5l-7 7 7 7"/>
            </svg>
        </button>
        <button class="slider-next absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 5l7 7-7 7"/>
            </svg>
        </button>
    </div>

    <script>
        ( function() {
            const slider = document.getElementById( '<?php echo esc_js( $slider_id ); ?>' );
            if ( ! slider ) return;

            const track  = slider.querySelector( '.slider-track' );
            const slides = slider.querySelectorAll( '.slider-slide' );
            if ( slides.length === 0 ) return;

            let current = 0;
            const maxIndex = slides.length - 1;
            const autoplayInterval = <?php echo $autoplay ? intval( $autoplay_speed ) : 0; ?>;

            function goTo( index ) {
                if ( index < 0 ) index = maxIndex;
                if ( index > maxIndex ) index = 0;
                current = index;
                const offset = -1 * current * 100;
                track.style.transform = 'translateX(' + offset + '%)';
            }

            slider.querySelector( '.slider-next' ).addEventListener( 'click', () => goTo( current + 1 ) );
            slider.querySelector( '.slider-prev' ).addEventListener( 'click', () => goTo( current - 1 ) );

            <?php if ( $autoplay ) : ?>
            let timer = setInterval( () => goTo( current + 1 ), autoplayInterval );
            slider.addEventListener( 'mouseenter', () => clearInterval( timer ) );
            slider.addEventListener( 'mouseleave', () => {
                timer = setInterval( () => goTo( current + 1 ), autoplayInterval );
            } );
            <?php endif; ?>
        } )();
    </script>
    <?php
    wp_reset_postdata();
    return ob_get_clean();
}

register_block_type( __DIR__, [
    'render_callback' => 'render_category_products_slider_block',
] );