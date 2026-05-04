jQuery(document).ready(function($) {

	/*Using AJAX*/

	// $('#commerceKitOptinForm').submit(function(event) {
	// 	event.preventDefault();

	// 	var name = $("#name").val();
	// 	var email = $("#email").val();
	// 	var nonce = COMMERCEKIT.nonce;

	// 	$.ajax({
	// 		url: COMMERCEKIT.ajaxurl,
	// 		method: "POST",
	// 		data: {
	// 			action: 'commerce_kit_form',
	// 			name: name,
	// 			email: email,
	// 			nonce: nonce
	// 		},
	// 		dataType: 'JSON',
	// 		success: function(response) {
	// 			 if(response.success) {
	// 				alert(response.data.message);
	// 			} else {
	// 				alert(response.data.message);
	// 			}
	// 		},
	// 		error: function(response) {
	// 			console.log(response);
	// 			if (response.responseJSON && response.responseJSON.message) {
	// 				alert(response.responseJSON.message);
	// 			} else {
	// 				alert('Failed to submit form.');
	// 			}
	// 		}
	// 	});
	// });

	/*Using Reast API*/
	$('#commerceKitOptinForm').submit(function(event) {
 		event.preventDefault();

 		var name = $("#name").val();
 		var email = $("#email").val();
 		var loader = $('#formLoader');

 		loader.show();

 		$.ajax({
 			url: COMMERCEKIT.resturl,
 			method: "POST",
 			data: {
				name: name,
				email: email
 			},
 			beforeSend: function(xhr) {
				xhr.setRequestHeader('nonce', COMMERCEKIT.nonce);
 			},
 			success: function(response) {
				alert(response.message);
				loader.hide();
 			},
 			error: function(response) {
				console.log(response);
				if (response.responseJSON && response.responseJSON.message) {
					alert(response.responseJSON.message);
				} else {
					alert('Failed to submit form.');
				}
				loader.hide();
 			}
 		});
	});
	const $sections = $('.accordion-section');
	$sections.each(function (index) {
		const $section = $(this);
		const $content = $section.find('.accordion-content');
		const $icon = $section.find('.accordion-icon');

		if (index === 0) {
			$section.addClass('is-open');
			$content.show();
			$icon.text('-');
		} else {
			$content.hide();
			$icon.text('+');
		}
	});
	$('.commerce-kit-accordion-header').on('click', function () {
		const $section = $(this).closest('.accordion-section');
		const $content = $section.find('.accordion-content');
		const isOpen = $section.hasClass('is-open');
		const $icon = $(this).find('.accordion-icon');

		// Toggle open/close state
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
	});
	const $sections = $('.accordion-section');
	$sections.each(function (index) {
		const $section = $(this);
		const $content = $section.find('.accordion-content');
		const $icon = $section.find('.accordion-icon');

		if (index === 0) {
			$section.addClass('is-open');
			$content.show();
			$icon.text('-');
		} else {
			$content.hide();
			$icon.text('+');
		}
	});
	$('.commerce-kit-accordion-header').on('click', function () {
		const $section = $(this).closest('.accordion-section');
		const $content = $section.find('.accordion-content');
		const isOpen = $section.hasClass('is-open');
		const $icon = $(this).find('.accordion-icon');

		// Toggle open/close state
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
