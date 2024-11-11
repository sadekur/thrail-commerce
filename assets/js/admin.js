jQuery(document).ready(function($) {
    $('#thrail-commerce-settings-form').on('submit', function(e) {
        e.preventDefault();

        // Gather form data
        let formData = {
            tcwt_cart: $('input[name="tcwt_cart"]').is(':checked') ? 'on' : 'off',
            tcwt_checkout: $('input[name="tcwt_checkout"]').is(':checked') ? 'on' : 'off',
            tcwt_note: $('input[name="tcwt_note"]').is(':checked') ? 'on' : 'off',
            tcwt_btncolor: $('input[name="tcwt_btncolor"]').val(),
            tcwt_btntext: $('input[name="tcwt_btntext"]').val(),
            tcwt_textcolor: $('input[name="tcwt_textcolor"]').val(),
        };

        // Send request to REST API
        $.ajax({
            url: THRAILCOMMERCE.apiurl + '/save-tips',
            method: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', THRAILCOMMERCE.nonce);
            },
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                alert('Settings saved successfully!');
            },
            error: function(error) {
                alert('Error saving settings. Please try again.');
                console.log(error);
            }
        });
    });
});
