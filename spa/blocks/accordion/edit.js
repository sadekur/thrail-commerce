import {
  useBlockProps,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";
import { PanelBody, Panel, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

const Edit = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();
  const { sections, titleColor, titleFontSize } = attributes;
  console.log(titleColor);

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
          <PanelBody title={__("Accordion Settings", "thrail-commerce")} initialOpen={true}>
            <TextControl
              label={__("Title Color", "thrail-commerce")}
              value={titleColor}
              type="color"
              onChange={(value) => setAttributes({ titleColor: value })}
            />
            <TextControl
              label={__("Title Font Size", "thrail-commerce")}
              value={titleFontSize}
              type="number"
              onChange={(value) => setAttributes({ titleFontSize: value })}
            />
          </PanelBody>
        </Panel>
      </InspectorControls>

      {attributes.sections.map((section, index) => (
        <div
          key={index}
          className="px-4 border border-[#0029af] rounded-sm mb-4 p-3 accordion-section"
        >
          <div
            onClick={() => toggleSection(index)}
            className="thrail-commerce-accordion-header cursor-pointer py-2 mb-2 flex items-center"
          >
            <RichText
              tagName="h3"
              value={section.title}
              onChange={(value) => updateSection(index, "title", value)}
              placeholder={__("Enter title...", "thrail-commerce")}
              style={{ color: titleColor, fontSize: titleFontSize }}
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

      <button onClick={addSection} className="thrail-commerce-add-section mt-4 p-2 bg-[#0029af] border border-[#0029af] ">
        {__("Add Section", "thrail-commerce")}
      </button>
    </div>
  );
};

export default Edit;
