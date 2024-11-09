import { useBlockProps, RichText } from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
import { Button } from "@wordpress/components";

const Edit = ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();
	const [sections, setSections] = useState(attributes.sections);

	const addSection = () => {
		const newSections = [
			...sections,
			{ title: "", content: "", isOpen: false },
		];
		setSections(newSections);
		setAttributes({ sections: newSections });
	};

	const toggleSection = (index) => {
		const newSections = sections.map((section, idx) => {
			if (idx === index) {
				section.isOpen = !section.isOpen;
			}
			return section;
		});
		setSections(newSections);
		setAttributes({ sections: newSections });
	};

	const updateSection = (index, field, value) => {
		const newSections = sections.map((section, idx) => {
			if (idx === index) {
				section[field] = value;
			}
			return section;
		});
		setSections(newSections);
		setAttributes({ sections: newSections });
	};

	return (
		<div {...blockProps}>
			{sections.map((section, index) => (
				<div key={index}>
					<div onClick={() => toggleSection(index)}>
						<RichText
							tagName='h3'
							value={section.title}
							onChange={(value) =>
								updateSection(index, "title", value)
							}
							placeholder='Enter title...'
						/>
					</div>
					{section.isOpen && (
						<RichText
							tagName='div'
							value={section.content}
							onChange={(value) =>
								updateSection(index, "content", value)
							}
							placeholder='Enter content...'
						/>
					)}
				</div>
			))}
			<Button isDefault onClick={addSection}>
				Add Section
			</Button>
		</div>
	);
};

export default Edit;
