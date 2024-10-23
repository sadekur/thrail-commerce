import { registerBlockType } from '@wordpress/blocks';

registerBlockType('thrail-commerce/faqs', {
    title: 'FAQs',
    category: 'thrail-commerce-product',
    icon: 'editor-help',
    description: 'A block to display frequently asked questions.',
    edit: (props) => {
        // Edit function
    },
    save: (props) => {
        // Save function
    }
});
