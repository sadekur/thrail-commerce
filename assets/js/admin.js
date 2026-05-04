jQuery(document).ready(($) => {
    const form = $('#commerce-kit-settings-form');

    form.on('submit', (e) => {
        e.preventDefault();
        commerce_kit_modal(true);

        const formData = {
            tcwt_cart: $('input[name="tcwt_cart"]').is(':checked') ? 'on' : 'off',
            tcwt_checkout: $('input[name="tcwt_checkout"]').is(':checked') ? 'on' : 'off',
            tcwt_note: $('input[name="tcwt_note"]').is(':checked') ? 'on' : 'off',
            tcwt_btncolor: $('input[name="tcwt_btncolor"]').val(),
            tcwt_btntext: $('input[name="tcwt_btntext"]').val(),
            tcwt_textcolor: $('input[name="tcwt_textcolor"]').val(),
        };

        $.ajax({
            url: `${COMMERCEKIT.apiurl}/save-tips`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            beforeSend: (xhr) => xhr.setRequestHeader('X-WP-Nonce', COMMERCEKIT.nonce),
            success: () => commerce_kit_modal(false),
            error: (error) => {
                commerce_kit_modal(false);
                console.error(error);
            },
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById('settings-loader').classList.add('hidden');
        document.getElementById('settings-form').classList.remove('hidden');
    }, 1000);
});

jQuery(document).ready(function ($) {

    function isCommerceKitScreen() {
        const params = new URLSearchParams(window.location.search);
        return params.get('page') === 'commerce-kit';
    }

    const $menu = $('#adminmenu li.toplevel_page_commerce-kit');

    function getStockThresholdItem() {
        return $menu.find('a[href*="#/stock-threshold"]').closest('li');
    }

    function updateActiveMenu() {
        if (!isCommerceKitScreen()) return;
        $menu.find('.wp-submenu li').removeClass('current');
        const hash = window.location.hash || '';
        if (hash && hash !== '#/') {
            $menu.find('a[href*="' + hash + '"]').closest('li').addClass('current');
        } else {
            $menu.find('a[href="admin.php?page=commerce-kit"]').closest('li').addClass('current');
        }
    }

    // ✅ React fires this after saving Features — update submenu visibility without reload
    window.addEventListener('commerceKitSettingsUpdated', function (e) {
        const settings = e.detail || {};
        const stockEnabled = settings['stock-threshold-for-wc'] === 'on';
        if (stockEnabled) {
            getStockThresholdItem().show();
        } else {
            getStockThresholdItem().hide();
        }
    });

    $(document).on('click', '#adminmenu a[href="admin.php?page=commerce-kit"]', function (e) {
        if (!isCommerceKitScreen()) return;
        e.preventDefault();
        window.location.hash = '';
        updateActiveMenu();
    });

    updateActiveMenu();
    $(window).on('hashchange', updateActiveMenu);
});