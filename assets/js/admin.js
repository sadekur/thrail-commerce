jQuery(document).ready(function($) {
    $('#thrail-commerce-settings-form').on('submit', function(e) {
        e.preventDefault();

        // Use .serialize() to gather form data
        let formData = $(this).serialize();

        console.log(formData);

        $.post({
            url: THRAILCOMMERCE.apiurl + '/save-tips',
            data: formData + '&_wpnonce=' + THRAILCOMMERCE.nonce,
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
