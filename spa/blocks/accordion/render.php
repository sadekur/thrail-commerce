<?php  ?>

<!-- Toastify CSS -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

<div>
    <div class="flex items-center gap-6 mb-8">
        <!-- Add to cart button  -->
        <button type="button" class="easycommerce-add-to-cart-button font-inter font-semibold text-base leading-[26px] bg-[#7351FD] p-3 w-[220px] rounded-md">
            <span id="buttonText" class="text-white"><?php esc_html_e( 'Add to Cart', 'easycommerce' ); ?></span>
            <div id="loader" class="loader" style="display: none;"></div>
        </button>
    </div>

</div>

<!-- Toastify JS -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>