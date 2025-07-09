jQuery(document).ready(($) => {
    const form = $('#thrail-commerce-settings-form');

    form.on('submit', (e) => {
        e.preventDefault();
        thrail_commerce_modal(true);

        const formData = {
            tcwt_cart: $('input[name="tcwt_cart"]').is(':checked') ? 'on' : 'off',
            tcwt_checkout: $('input[name="tcwt_checkout"]').is(':checked') ? 'on' : 'off',
            tcwt_note: $('input[name="tcwt_note"]').is(':checked') ? 'on' : 'off',
            tcwt_btncolor: $('input[name="tcwt_btncolor"]').val(),
            tcwt_btntext: $('input[name="tcwt_btntext"]').val(),
            tcwt_textcolor: $('input[name="tcwt_textcolor"]').val(),
        };

        $.ajax({
            url: `${THRAILCOMMERCE.apiurl}/save-tips`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            beforeSend: (xhr) => xhr.setRequestHeader('X-WP-Nonce', THRAILCOMMERCE.nonce),
            success: () => thrail_commerce_modal(false),
            error: (error) => {
                thrail_commerce_modal(false);
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