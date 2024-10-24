<?php
function render_faq_block( $attributes ) {
    $questions = [
        [ 'question' => 'What is Thrail Commerce?', 'answer' => 'Thrail Commerce is a plugin...' ],
        [ 'question' => 'How to use this FAQ?', 'answer' => 'Just add it to any page...' ],
    ];

    ob_start(); ?>
    <div class="faq-block">
        <?php foreach ( $questions as $faq ) : ?>
            <div class="faq-item">
                <h3 class="faq-question"><?php echo esc_html( $faq['question'] ); ?></h3>
                <p class="faq-answer"><?php echo esc_html( $faq['answer'] ); ?></p>
            </div>
        <?php endforeach; ?>
    </div>
    <?php 
    return ob_get_clean();
}

register_block_type( __DIR__, array(
    'render_callback' => 'render_faq_block',
) );

