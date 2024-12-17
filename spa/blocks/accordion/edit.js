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
    const newSection = { title: "New Accordion", content: "", isOpen: false };
    updateSections([...attributes.sections, newSection]);
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <Panel>
          <PanelBody
            title={__("Accordion Settings", "thrail-commerce")}
            initialOpen={true}
          >
            <TextControl
              label={__("Border Color", "thrail-commerce")}
              value={borderColor}
              type="color"
              onChange={(value) => setAttributes({ borderColor: value })}
            />
            <TextControl
              label={__("Border Size (px)", "thrail-commerce")}
              value={parseInt(borderSize, 10)}
              type="number"
              onChange={(value) => setAttributes({ borderSize: `${value}px` })}
            />
            <SelectControl
              label={__("Border Style", "thrail-commerce")}
              value={borderStyle}
              options={[
                { label: __("Solid", "thrail-commerce"), value: "solid" },
                { label: __("Dashed", "thrail-commerce"), value: "dashed" },
                { label: __("Dotted", "thrail-commerce"), value: "dotted" },
                { label: __("Double", "thrail-commerce"), value: "double" },
                { label: __("None", "thrail-commerce"), value: "none" },
              ]}
              onChange={(value) => setAttributes({ borderStyle: value })}
            />
            <TextControl
              label={__("Title Color", "thrail-commerce")}
              value={titleColor}
              type="color"
              onChange={(value) => setAttributes({ titleColor: value })}
            />
            <TextControl
              label={__("Title Font Size (px)", "thrail-commerce")}
              value={parseInt(titleFontSize, 10)}
              type="number"
              onChange={(value) =>
                setAttributes({ titleFontSize: `${value}px` })
              }
            />
            <SelectControl
              label={__("Title Font Family", "thrail-commerce")}
              value={titleFontFamily}
              options={[
                { label: "Default", value: "inherit" },
                { label: "Arial", value: "Arial, sans-serif" },
                { label: "Georgia", value: "Georgia, serif" },
                { label: "Roboto", value: "'Roboto', sans-serif" },
              ]}
              onChange={(value) => setAttributes({ titleFontFamily: value })}
            />
            <TextControl
              label={__("Content Color", "thrail-commerce")}
              value={contentColor}
              type="color"
              onChange={(value) => setAttributes({ contentColor: value })}
            />
            <TextControl
              label={__("Content Font Size (px)", "thrail-commerce")}
              value={parseInt(contentFontSize, 10)}
              type="number"
              onChange={(value) =>
                setAttributes({ contentFontSize: `${value}px` })
              }
            />
            <SelectControl
              label={__("Content Font Family", "thrail-commerce")}
              value={contentFontFamily}
              options={[
                { label: "Default", value: "inherit" },
                { label: "Arial", value: "Arial, sans-serif" },
                { label: "Georgia", value: "Georgia, serif" },
                { label: "Roboto", value: "'Roboto', sans-serif" },
              ]}
              onChange={(value) => setAttributes({ contentFontFamily: value })}
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
          }}
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
                onChange={(value) => updateSection(index, "content", value)}
                placeholder={__("Enter content...", "thrail-commerce")}
                className="text-gray-800 p-2 rounded bg-white"
                style={{
                  color: contentColor,
                  fontSize: contentFontSize,
                  fontFamily: contentFontFamily,
                }}
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addSection}
        className="thrail-commerce-add-section mt-4 p-2 bg-[#0029af] border border-[#0029af] "
      >
        {__("Add Section", "thrail-commerce")}
      </button>
    </div>
  );
};

export default Edit;
