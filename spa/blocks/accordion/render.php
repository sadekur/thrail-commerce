<?php  
if (!function_exists('render_accordion_block')) {
    function render_accordion_block($attributes) {
        $title = esc_html($attributes['title']);
        $content = apply_filters('the_content', $attributes['content']);
        $isOpen = $attributes['isOpen'] ? 'open' : '';

        return <<<HTML
<div class="wp-block-thrail-commerce-accordion">
    <div class="accordion-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block';">
        <h3>{$title}</h3>
    </div>
    <div class="accordion-content" style="display: {$isOpen};">
        {$content}
    </div>
</div>
HTML;
    }
}

