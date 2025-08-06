import React from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <h3>{__('Variant FAQ Block (Editor View)', 'thrail-commerce')}</h3>
        </div>
    );
}
