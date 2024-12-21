<?php
// Extract attributes passed to the block.
$sections = $attributes['sections'] ?? [];
$borderColor = $attributes['borderColor'] ?? '#000';
$borderSize = $attributes['borderSize'] ?? '1px';
$borderStyle = $attributes['borderStyle'] ?? 'solid';
$titleColor = $attributes['titleColor'] ?? '#000';
$titleFontSize = $attributes['titleFontSize'] ?? '16px';
$titleFontFamily = $attributes['titleFontFamily'] ?? 'inherit';
$contentColor = $attributes['contentColor'] ?? '#000';
$contentFontSize = $attributes['contentFontSize'] ?? '14px';
$contentFontFamily = $attributes['contentFontFamily'] ?? 'inherit';
$buttonBackgroundColor = $attributes['buttonBackgroundColor'] ?? '#0073aa';
$buttonTextColor = $attributes['buttonTextColor'] ?? '#fff';
$buttonFontSize = $attributes['buttonFontSize'] ?? '14px';
$buttonFontFamily = $attributes['buttonFontFamily'] ?? 'inherit';
$buttonText = $attributes['buttonText'] ?? 'Add Section';
?>

<div class="thrail-commerce-accordion">
    <?php foreach ($sections as $index => $section): ?>
        <div 
            class="accordion-section" 
            style="border: <?= esc_attr($borderSize) ?> <?= esc_attr($borderStyle) ?> <?= esc_attr($borderColor) ?>; margin-bottom: 10px; padding: 10px;">
            <div 
                class="accordion-header" 
                style="cursor: pointer; color: <?= esc_attr($titleColor) ?>; font-size: <?= esc_attr($titleFontSize) ?>; font-family: <?= esc_attr($titleFontFamily) ?>;"
                data-index="<?= esc_attr($index) ?>">
                <h3><?= esc_html($section['title']) ?></h3>
                <span class="accordion-icon"><?= $section['isOpen'] ? '-' : '+' ?></span>
            </div>
            <?php if ($section['isOpen']): ?>
                <div 
                    class="accordion-content" 
                    style="color: <?= esc_attr($contentColor) ?>; font-size: <?= esc_attr($contentFontSize) ?>; font-family: <?= esc_attr($contentFontFamily) ?>;">
                    <?= wp_kses_post($section['content']) ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
    <button 
        class="thrail-commerce-add-section" 
        style="background-color: <?= esc_attr($buttonBackgroundColor) ?>; color: <?= esc_attr($buttonTextColor) ?>; font-size: <?= esc_attr($buttonFontSize) ?>; font-family: <?= esc_attr($buttonFontFamily) ?>; border: 1px solid <?= esc_attr($borderColor) ?>; padding: 10px;">
        <?= esc_html($buttonText) ?>
    </button>
</div>
