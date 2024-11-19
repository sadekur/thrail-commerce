import { useBlockProps, RichText } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

const Edit = ({ attributes, setAttributes }) => {
	console.log("attributes", attributes);
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
    const newSection = { title: "", content: "", isOpen: false };
    updateSections([...attributes.sections, newSection]);
  };

  return (
    <div {...blockProps}>
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
              placeholder="Enter title..."
              className="text-gray-800"
            />
          </div>

          {/* Accordion Content */}
          <div
            className={`accordion-content ${
              section.isOpen ? "block" : "hidden"
            }`}
          >
            <RichText
              tagName="div"
              value={section.content}
              onChange={(value) => updateSection(index, "content", value)}
              placeholder="Enter content..."
              className="text-gray-800 p-2 rounded border border-gray-300 bg-white"
            />
          </div>
        </div>
      ))}
      <Button onClick={addSection} className="mt-4">
        Add Section
      </Button>
    </div>
  );
};

export default Edit;
