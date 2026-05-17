jQuery(document).ready(function($) {

	/* ── Stock Threshold – Variable Product Variation ── */

	// show_variation fires on form.variations_form when WooCommerce matches a variation
	$(document).on('show_variation', 'form.variations_form', function(event, variation) {
		if (!variation || !variation.variation_id) return;

		var $msg = $('.commercekit-stock-message');

		$.ajax({
			url: COMMERCEKIT.resturl + '/get-variation-stock',
			method: 'GET',
			data: { variation_id: variation.variation_id },
			success: function(response) {
				if (response && response.message && response.message.length > 0) {
					$msg.text(response.message).show();
				} else {
					$msg.text('').hide();
				}
			},
			error: function() {
				$msg.text('').hide();
			}
		});
	});

	// hide_variation fires when no variation matches; reset_data fires on attribute clear
	$(document).on('hide_variation reset_data', 'form.variations_form', function() {
		$('.commercekit-stock-message').text('').hide();
	});

	/* ── Enquiry / optin form ── */
	$('#commerceKitOptinForm').submit(function(event) {
		event.preventDefault();

		var name   = $("#name").val();
		var email  = $("#email").val();
		var loader = $('#formLoader');

		loader.show();

		$.ajax({
			url: COMMERCEKIT.resturl,
			method: "POST",
			data: { name: name, email: email },
			beforeSend: function(xhr) {
				xhr.setRequestHeader('nonce', COMMERCEKIT.nonce);
			},
			success: function(response) {
				alert(response.message);
				loader.hide();
			},
			error: function(response) {
				if (response.responseJSON && response.responseJSON.message) {
					alert(response.responseJSON.message);
				} else {
					alert('Failed to submit form.');
				}
				loader.hide();
			}
		});
	});

	/* ── Accordion ── */
	var $sections = $('.accordion-section');
	$sections.each(function(index) {
		var $section = $(this);
		var $content = $section.find('.accordion-content');
		var $icon    = $section.find('.accordion-icon');

		if (index === 0) {
			$section.addClass('is-open');
			$content.show();
			$icon.text('-');
		} else {
			$content.hide();
			$icon.text('+');
		}
	});

	$('.commerce-kit-accordion-header').on('click', function() {
		var $section = $(this).closest('.accordion-section');
		var $content = $section.find('.accordion-content');
		var isOpen   = $section.hasClass('is-open');
		var $icon    = $(this).find('.accordion-icon');

		if (isOpen) {
			$section.removeClass('is-open');
			$content.slideUp(300);
			$icon.text('+');
		} else {
			$section.addClass('is-open');
			$content.slideDown(300);
			$icon.text('-');
		}
	});
});
