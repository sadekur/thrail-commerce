import React from 'react';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Panel, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const Edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const { categoryId, title, productLimit, autoplay, autoplaySpeed } = attributes;

    return (
        <div {...blockProps}>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__('Slider Settings', 'commerce-kit')} initialOpen={true}>
                        <TextControl
                            label={__('Category ID', 'commerce-kit')}
                            value={categoryId}
                            type="number"
                            onChange={(value) => setAttributes({ categoryId: parseInt(value) || 0 })}
                            help={__('Enter WooCommerce category ID', 'commerce-kit')}
                        />
                        <TextControl
                            label={__('Title', 'commerce-kit')}
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            help={__('Slider title displayed above products', 'commerce-kit')}
                        />
                        <TextControl
                            label={__('Product Limit', 'commerce-kit')}
                            value={productLimit}
                            type="number"
                            onChange={(value) => setAttributes({ productLimit: parseInt(value) || 10 })}
                            help={__('Maximum number of products to display', 'commerce-kit')}
                        />
                        <ToggleControl
                            label={__('Autoplay', 'commerce-kit')}
                            checked={autoplay}
                            onChange={(value) => setAttributes({ autoplay: value })}
                        />
                        <TextControl
                            label={__('Autoplay Speed (ms)', 'commerce-kit')}
                            value={autoplaySpeed}
                            type="number"
                            onChange={(value) => setAttributes({ autoplaySpeed: parseInt(value) || 3000 })}
                            help={__('Speed of autoplay in milliseconds', 'commerce-kit')}
                        />
                    </PanelBody>
                </Panel>
            </InspectorControls>

            <div className="commerce-kit-category-slider-editor p-4 bg-white border border-gray-200 rounded">
                <h3 className="text-lg font-semibold mb-4">{title || __('Category Products', 'commerce-kit')}</h3>
                <p className="text-sm text-gray-500">
                    {__('Slider will display products from category ID: ', 'commerce-kit')}
                    <strong>{categoryId || __('Not set', 'commerce-kit')}</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    {__('Products: ', 'commerce-kit')}{productLimit} | 
                    {autoplay ? __('Autoplay enabled', 'commerce-kit') : __('Autoplay disabled', 'commerce-kit')}
                </p>
            </div>
        </div>
    );
};

export default Edit;