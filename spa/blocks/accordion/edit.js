import { useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Dashicon } from "@wordpress/icons";

const Edit = () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<h3>FAQ Section</h3>
			{/* <Button onClick={addFaqItem} className='add-faq-btn'>
				Add FAQ Item
			</Button> */}
		</div>
	);
};

export default Edit;
