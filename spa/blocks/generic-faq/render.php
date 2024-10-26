<?php
function render_generic_faq_block( $attributes ) {
    $questions = [
        [ 'question' => 'What is Thrail Commerce?', 'answer' => 'Thrail Commerce is a plugin...' ],
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

register_block_type( __DIR__, array(
    'render_callback' => 'render_generic_faq_block',
) );
