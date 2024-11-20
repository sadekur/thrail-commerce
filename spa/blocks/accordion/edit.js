import { useBlockProps, RichText, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, Panel, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

  // Update the `sections` attribute
  const updateSections = (newSections) => {
    setAttributes({ sections: newSections });
  };

  // Toggle the accordion open/close state
  const toggleSection = (index) => {
    const updatedSections = attributes.sections.map((section, idx) =>
      idx === index ? { ...section, isOpen: !section.isOpen } : section
    );
    updateSections(updatedSections);
  };

  // Update individual section fields (title/content)
  const updateSection = (index, field, value) => {
    const updatedSections = attributes.sections.map((section, idx) =>
      idx === index ? { ...section, [field]: value } : section
    );
    updateSections(updatedSections);
  };

  // Add a new section to the accordion
  const addSection = () => {
    const newSection = { title: "New Accordion", content: "", isOpen: false };
    updateSections([...attributes.sections, newSection]);
  };

  return (
    <div {...blockProps}>
      {/* Inspector Controls */}
      <InspectorControls>
        <Panel>
          <PanelBody title={__("Settings", "thrail-commerce")} initialOpen={true}>
            <p>{__("Additional settings can be added here.", "thrail-commerce")}</p>
          </PanelBody>
        </Panel>
      </InspectorControls>

      {/* Accordion Sections */}
      {attributes.sections.map((section, index) => (
        <div
          key={index}
          className="border border-indigo-700 rounded-sm mb-4 p-3 accordion-section"
        >
          {/* Accordion Header */}
          <div
            onClick={() => toggleSection(index)}
            className="cursor-pointer py-2 border-b border-blue-500 mb-2 accordion-title"
          >
            <RichText
              tagName="h3"
              value={section.title}
              onChange={(value) => updateSection(index, "title", value)}
              placeholder={__("Enter title...", "thrail-commerce")}
              className="text-gray-800"
            />
          </div>

          {/* Accordion Content */}
          {section.isOpen && (
            <div className="accordion-content">
              <RichText
                tagName="div"
                value={section.content}
                onChange={(value) => updateSection(index, "content", value)}
                placeholder={__("Enter content...", "thrail-commerce")}
                className="text-gray-800 p-2 rounded border border-gray-300 bg-white"
              />
            </div>
          )}
        </div>
      ))}

      {/* Add Section Button */}
      <Button
        onClick={addSection}
        className="mt-4"
        variant="primary"
      >
        {__("Add Section", "thrail-commerce")}
      </Button>
    </div>
  );
};

export default Edit;
