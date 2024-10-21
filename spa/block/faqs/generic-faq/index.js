import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

registerBlockType('thrail-commerce/faqs', {
    edit: Edit,
    save: () => null, // Save is disabled because we're using PHP for rendering.
});
