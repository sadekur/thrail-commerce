import {
  useBlockProps,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, Panel, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();

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
    const newSection = { title: "New Accordion", content: "", isOpen: false };
    updateSections([...attributes.sections, newSection]);
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <Panel>
          <PanelBody
            title={__("Settings", "thrail-commerce")}
            initialOpen={true}
          >
            <p>
              {__("Additional settings can be added here.", "thrail-commerce")}
            </p>
          </PanelBody>
        </Panel>
      </InspectorControls>

      {attributes.sections.map((section, index) => (
        <div
          key={index}
          className="border border-[#0029af] rounded-sm mb-4 p-3 accordion-section"
        >
          <div
            onClick={() => toggleSection(index)}
            className="cursor-pointer py-2 mb-2 flex justify-between items-center accordion-title"
          >
            <RichText
              tagName="h3"
              value={section.title}
              onChange={(value) => updateSection(index, "title", value)}
              placeholder={__("Enter title...", "thrail-commerce")}
              style={{ color: "#0029af" }}
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
                onChange={(value) => updateSection(index, "content", value)}
                placeholder={__("Enter content...", "thrail-commerce")}
                className="text-gray-800 p-2 rounded bg-white"
              />
            </div>
          )}
        </div>
      ))}

      <Button onClick={addSection} className="mt-4" variant="primary">
        {__("Add Section", "thrail-commerce")}
      </Button>
    </div>
  );
};

export default Edit;
