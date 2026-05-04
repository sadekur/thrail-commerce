import {
	useBlockProps,
	RichText,
	InspectorControls,
} from "@wordpress/block-editor";
import { SelectControl } from "@wordpress/components";
import { TextControl } from "@wordpress/components";
import { PanelBody, Panel, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const Edit = ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();
	const {
		sections,
		titleColor,
		titleFontSize,
		contentColor,
		contentFontSize,
		titleFontFamily,
		contentFontFamily,
		borderColor,
		borderSize,
		borderStyle,
		buttonColor,
		buttonFontSize,
		buttonFontFamily,
		buttonBackgroundColor,
		buttonTextColor,
		buttonText,
	} = attributes;

	const updateSections = (newSections) => {
		setAttributes({ sections: newSections });
	};

	const toggleSection = (index) => {
		const updatedSections = attributes.sections.map((section, idx) =>
			idx === index ? { ...section, isOpen: !section.isOpen } : section
		);
		updateSections(updatedSections);
	};

	const updateSection = (index, field, value) => {
		const updatedSections = attributes.sections.map((section, idx) =>
			idx === index ? { ...section, [field]: value } : section
		);
		updateSections(updatedSections);
	};

	const addSection = () => {
		const newSection = {
			title: "New Accordion",
			content: "",
			isOpen: false,
		};
		updateSections([...attributes.sections, newSection]);
	};
	const removeSection = (index) => {
		if (attributes.sections.length > 1) {
			const updatedSections = attributes.sections.filter(
				(_, idx) => idx !== index
			);
			updateSections(updatedSections);
		} else {
			alert(__("You cannot remove the last section.", "commerce-kit"));
		}
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<Panel>
					<PanelBody
						title={__("Accordion Settings", "commerce-kit")}
						initialOpen={true}>
						<TextControl
							label={__("Border Color", "commerce-kit")}
							value={borderColor}
							type="color"
							onChange={(value) =>
								setAttributes({ borderColor: value })
							}
						/>
						<TextControl
							label={__("Border Size (px)", "commerce-kit")}
							value={parseInt(borderSize, 10)}
							type="number"
							onChange={(value) =>
								setAttributes({ borderSize: `${value}px` })
							}
						/>
						<SelectControl
							label={__("Border Style", "commerce-kit")}
							value={borderStyle}
							options={[
								{
									label: __("Solid", "commerce-kit"),
									value: "solid",
								},
								{
									label: __("Dashed", "commerce-kit"),
									value: "dashed",
								},
								{
									label: __("Dotted", "commerce-kit"),
									value: "dotted",
								},
								{
									label: __("Double", "commerce-kit"),
									value: "double",
								},
								{
									label: __("None", "commerce-kit"),
									value: "none",
								},
							]}
							onChange={(value) =>
								setAttributes({ borderStyle: value })
							}
						/>
						<TextControl
							label={__("Title Color", "commerce-kit")}
							value={titleColor}
							type="color"
							onChange={(value) =>
								setAttributes({ titleColor: value })
							}
						/>
						<TextControl
							label={__(
								"Title Font Size (px)",
								"commerce-kit"
							)}
							value={parseInt(titleFontSize, 10)}
							type="number"
							onChange={(value) =>
								setAttributes({ titleFontSize: `${value}px` })
							}
						/>
						<SelectControl
							label={__("Title Font Family", "commerce-kit")}
							value={titleFontFamily}
							options={[
								{ label: "Default", value: "inherit" },
								{ label: "Arial", value: "Arial, sans-serif" },
								{ label: "Georgia", value: "Georgia, serif" },
								{
									label: "Roboto",
									value: "'Roboto', sans-serif",
								},
							]}
							onChange={(value) =>
								setAttributes({ titleFontFamily: value })
							}
						/>
						<TextControl
							label={__("Content Color", "commerce-kit")}
							value={contentColor}
							type="color"
							onChange={(value) =>
								setAttributes({ contentColor: value })
							}
						/>
						<TextControl
							label={__(
								"Content Font Size (px)",
								"commerce-kit"
							)}
							value={parseInt(contentFontSize, 10)}
							type="number"
							onChange={(value) =>
								setAttributes({ contentFontSize: `${value}px` })
							}
						/>
						<SelectControl
							label={__("Content Font Family", "commerce-kit")}
							value={contentFontFamily}
							options={[
								{ label: "Default", value: "inherit" },
								{ label: "Arial", value: "Arial, sans-serif" },
								{ label: "Georgia", value: "Georgia, serif" },
								{
									label: "Roboto",
									value: "'Roboto', sans-serif",
								},
							]}
							onChange={(value) =>
								setAttributes({ contentFontFamily: value })
							}
						/>

						<TextControl
							label={__(
								"Button Background Color",
								"commerce-kit"
							)}
							value={buttonBackgroundColor}
							type="color"
							onChange={(value) =>
								setAttributes({ buttonBackgroundColor: value })
							}
						/>
						<TextControl
							label={__("Button Text Color", "commerce-kit")}
							value={buttonTextColor}
							type="color"
							onChange={(value) =>
								setAttributes({ buttonTextColor: value })
							}
						/>
						<TextControl
							label={__(
								"Button Font Size (px)",
								"commerce-kit"
							)}
							value={parseInt(buttonFontSize, 10)}
							type="number"
							onChange={(value) =>
								setAttributes({ buttonFontSize: `${value}px` })
							}
						/>
						<SelectControl
							label={__("Button Font Family", "commerce-kit")}
							value={buttonFontFamily}
							options={[
								{ label: "Default", value: "inherit" },
								{ label: "Arial", value: "Arial, sans-serif" },
								{ label: "Georgia", value: "Georgia, serif" },
								{
									label: "Roboto",
									value: "'Roboto', sans-serif",
								},
							]}
							onChange={(value) =>
								setAttributes({ buttonFontFamily: value })
							}
						/>
						<TextControl
							label={__("Button Text", "commerce-kit")}
							value={buttonText}
							onChange={(value) =>
								setAttributes({ buttonText: value })
							}
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>

			{attributes.sections.map((section, index) => (
				<div
					key={index}
					className="px-4 border border-[#0029af] rounded-sm mb-4 p-3 accordion-section"
					style={{
						borderColor,
						borderWidth: borderSize,
						borderStyle,
					}}>
					<div
						onClick={() => toggleSection(index)}
						className="commerce-kit-accordion-header cursor-pointer py-2 mb-2 flex items-center">
						<RichText
							tagName="h3"
							value={section.title}
							onChange={(value) =>
								updateSection(index, "title", value)
							}
							placeholder={__(
								"Enter title...",
								"commerce-kit"
							)}
							style={{
								color: titleColor,
								fontSize: titleFontSize,
								fontFamily: titleFontFamily,
							}}
						/>
						<span className="accordion-icon text-[#0029af] font-bold">
							{section.isOpen ? "-" : "+"}
						</span>
					</div>

					{section.isOpen && (
						<div className="accordion-content">
							<RichText
								tagName="div"
								value={section.content}
								onChange={(value) =>
									updateSection(index, "content", value)
								}
								placeholder={__(
									"Enter content...",
									"commerce-kit"
								)}
								className="text-gray-800 p-2 rounded bg-white"
								style={{
									color: contentColor,
									fontSize: contentFontSize,
									fontFamily: contentFontFamily,
								}}
							/>
						</div>
					)}
					<Button
						isDestructive
						onClick={() => removeSection(index)}
						className="mt-2"
						disabled={attributes.sections.length === 1}>
						{__("Remove Section", "commerce-kit")}
					</Button>
				</div>
			))}
			<button
				onClick={addSection}
				className="commerce-kit-add-section mt-4 p-2"
				style={{
					backgroundColor: buttonBackgroundColor,
					color: buttonTextColor,
					fontSize: buttonFontSize,
					fontFamily: buttonFontFamily,
					borderColor: buttonColor,
					borderWidth: "1px",
					borderStyle: "solid",
				}}>
				{buttonText}
			</button>
		</div>
	);
};

export default Edit;
