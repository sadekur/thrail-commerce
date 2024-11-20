<?php
    $attributes                   = $attributes;
    ?>
    <div class="accordion">
        <?php foreach ( $attributes['sections'] as $section ) : ?>
            <div class="accordion-section">
                <h3 class="accordion-title">
                    <?php echo esc_html( $section['title'] ); ?>
                </h3>
                <div class="accordion-content" style="<?php echo $section['isOpen'] ? '' : 'display:none'; ?>">
                    <?php echo wp_kses_post( $section['content'] ); ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php
    // return ob_get_clean();
