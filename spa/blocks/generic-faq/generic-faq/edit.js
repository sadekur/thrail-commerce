import React from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <h3>{__('FAQ Block (Editor View)', 'thrail-commerce')}</h3>
            <p>{__('FAQs will be rendered on the frontend.', 'thrail-commerce')}</p>
        </div>
    );
}
