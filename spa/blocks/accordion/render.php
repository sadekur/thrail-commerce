<?php
function render_generic_faq_block( $attributes ) {
    $accordions = [
        [ 'question' => 'What is Thrail Commerce?', 'answer' => 'Thrail Commerce is a plugin...' ],
        [ 'question' => 'How to use this accordions?', 'answer' => 'Just add it to any page...' ],
    ]
    ?>
    <div class="faq-block">
        <h3>FAQs</h3>
        <?php foreach ( $accordions as $accordion ) : ?>
            <div class="faq-item">
                <h4><?php echo esc_html( $accordion['question'] ); ?></h4>
                <p><?php echo esc_html( $accordion['question'] ); ?></p>
            </div>
        <?php endforeach; ?>
    </div>
    <?php
}

register_block_type( __DIR__, array(
    'render_callback' => 'render_generic_faq_block',
) );
