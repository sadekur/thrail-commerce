import { useBlockProps, RichText } from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
import { Button } from "@wordpress/components";

const Edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps({
        style: {
            width: "50%",
            boxSizing: "border-box",
        },
    });

    const [sections, setSections] = useState(attributes.sections || []);

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
                <div key={index} className="border border-[#5e38e9] rounded-sm mb-4 p-3" >
                    <div
                        onClick={() => toggleSection(index)}
						className="cursor-pointer py-2 border-b border-blue-500 mb-2"
                    >
                        <RichText
                            tagName="h3"
                            value={section.title}
                            onChange={(value) =>
                                updateSection(index, "title", value)
                            }
                            placeholder="Enter title..."
                            style={{
                                margin: 0,
                                color: "#333",
                            }}
                        />
                    </div>
                    {section.isOpen && (
                        <RichText
                            tagName="div"
                            value={section.content}
                            onChange={(value) =>
                                updateSection(index, "content", value)
                            }
                            placeholder="Enter content..."
							className="text-gray-800 p-2 rounded border border-gray-300 bg-white"
                        />
                    )}
                </div>
            ))}
            <Button isDefault onClick={addSection} style={{ marginTop: "16px" }}>
                Add Section
            </Button>
        </div>
    );
};

export default Edit;
