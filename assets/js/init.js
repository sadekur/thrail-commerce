const commerce_kit_modal = (show = true) => {
	const modal = document.getElementById("commerce-kit-modal");
	if (show) {
		modal.style.display = "";
	} else {
		modal.style.display = "none";
	}
};
