const thrail_commerce_modal = (show = true) => {
	const modal = document.getElementById("thrail-commerce-modal");
	if (show) {
		modal.style.display = "";
	} else {
		modal.style.display = "none";
	}
};
