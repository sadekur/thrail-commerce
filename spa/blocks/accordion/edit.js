import { useBlockProps, RichText } from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
import { Button } from "@wordpress/components";

const Edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps({
        style: {
            width: "100%", // Full-width accordion
            boxSizing: "border-box", // Prevent overflow
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
                <div
                    key={index}
                    style={{
                        border: "2px solid blue", // Individual section border
                        borderRadius: "8px",
                        marginBottom: "16px",
                        padding: "12px",
                        backgroundColor: "#f9f9f9", // Light background
                    }}
                >
                    <div
                        onClick={() => toggleSection(index)}
                        style={{
                            cursor: "pointer",
                            padding: "8px 0",
                            borderBottom: "1px solid blue", // Separator for title
                            marginBottom: "8px",
                        }}
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
                            style={{
                                color: "#333",
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                                backgroundColor: "#fff",
                            }}
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
