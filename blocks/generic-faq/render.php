<?php
if ( ! function_exists( 'render_generic_faq_block' ) ) {
    function render_generic_faq_block( $attributes ) {
        update_option( 'commerce_kit_faq_attributes', $attributes );
        $questions = [
            [ 'question' => 'What is CommerceKit?', 'answer' => 'CommerceKit is a WooCommerce enhancement plugin...' ],
            [ 'question' => 'How to use this FAQ?', 'answer' => 'Just add it to any page...' ],
        ];
        ?>
        <div class="faq-block">
            <h3>FAQs</h3>
            <?php foreach ( $questions as $faq ) : ?>
                <div class="faq-item">
                    <h4><?php echo esc_html( $faq['question'] ); ?></h4>
                    <p><?php echo esc_html( $faq['answer'] ); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
        <?php
    }
}
