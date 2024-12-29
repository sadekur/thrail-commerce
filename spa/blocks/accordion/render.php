<?php
// Extract attributes passed to the block.
$sections               = $attributes['sections'] ?? [];
$borderColor            = $attributes['borderColor'] ?? '#000';
$borderSize             = $attributes['borderSize'] ?? '1px';
$borderStyle            = $attributes['borderStyle'] ?? 'solid';
$titleColor             = $attributes['titleColor'] ?? '#000';
$titleFontSize          = $attributes['titleFontSize'] ?? '16px';
$titleFontFamily        = $attributes['titleFontFamily'] ?? 'inherit';
$contentColor           = $attributes['contentColor'] ?? '#000';
$contentFontSize        = $attributes['contentFontSize'] ?? '14px';
$contentFontFamily      = $attributes['contentFontFamily'] ?? 'inherit';
do_action( 'thrailcommerce_block/accordion' )
?>
<div class="thrail-commerce-accordion">
    <?php foreach ($sections as $index => $section): ?>
        <div 
            class="accordion-section <?= $section['isOpen'] ? 'is-open' : '' ?>" 
            style="border: <?= esc_attr($borderSize) ?> <?= esc_attr($borderStyle) ?> <?= esc_attr($borderColor) ?>; margin-bottom: 10px; padding: 10px;">
            <div class="thrail-commerce-accordion-header flex"
                style="cursor: pointer; color: <?= esc_attr($titleColor) ?>; font-size: <?= esc_attr($titleFontSize) ?>; font-family: <?= esc_attr($titleFontFamily) ?>;"
                data-index="<?= esc_attr($index) ?>">
                <h3><?= esc_html($section['title']) ?></h3>
                <span class="accordion-icon"><?= $section['isOpen'] ? '-' : '+' ?></span>
            </div>
            <div 
                class="accordion-content" 
                style="color: <?= esc_attr($contentColor) ?>; font-size: <?= esc_attr($contentFontSize) ?>; font-family: <?= esc_attr($contentFontFamily) ?>; display: <?= $section['isOpen'] ? 'block' : 'none' ?>;">
                <?= wp_kses_post($section['content']) ?>
            </div>
        </div>

    <?php endforeach; ?>
</div>
