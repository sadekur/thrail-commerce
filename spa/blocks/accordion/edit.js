import { useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Dashicon } from "@wordpress/icons";

const Edit = () => {
    const blockProps = useBlockProps();
    const [faqItems, setFaqItems] = useState([{ id: Date.now(), title: "", content: "", isOpen: false }]);

    const toggleItem = (id) => {
        setFaqItems(
            faqItems.map((item) =>
                item.id === id ? { ...item, isOpen: !item.isOpen } : item
            )
        );
    };

    const addFaqItem = () => {
        setFaqItems([...faqItems, { id: Date.now(), title: "", content: "", isOpen: false }]);
    };

    const removeFaqItem = (id) => {
        setFaqItems(faqItems.filter((item) => item.id !== id));
    };

    const updateFaqItem = (id, field, value) => {
        setFaqItems(
            faqItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    return (
        <div {...blockProps}>
            <h3>FAQ Section</h3>
            {faqItems.map((item) => (
                <div key={item.id} className="faq-item">
                    <div className="faq-header">
                        <input
                            type="text"
                            placeholder="Question Title"
                            value={item.title}
                            onChange={(e) => updateFaqItem(item.id, "title", e.target.value)}
                            className="faq-title-input"
                        />
                        <Button
                            icon={item.isOpen ? "minus" : "plus"}
                            label={item.isOpen ? "Collapse" : "Expand"}
                            onClick={() => toggleItem(item.id)}
                            className="expand-collapse-btn"
                        />
                        <Button
                            isDestructive
                            onClick={() => removeFaqItem(item.id)}
                            className="remove-btn"
                        >
                            Remove
                        </Button>
                    </div>
                    {item.isOpen && (
                        <textarea
                            placeholder="FAQ Content"
                            value={item.content}
                            onChange={(e) => updateFaqItem(item.id, "content", e.target.value)}
                            className="faq-content-input"
                        />
                    )}
                </div>
            ))}
            <Button onClick={addFaqItem} className="add-faq-btn">
                Add FAQ Item
            </Button>
        </div>
    );
};

export default Edit;
