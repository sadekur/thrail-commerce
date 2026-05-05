import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";
import FieldRow from "../../common/FieldRow";
import NumberField from "../../common/NumberField";
import CheckboxField from "../../common/CheckboxField";
import { WarningIcon } from "../../common/Svgs";

/* ─────────────────────────────────────────────
   Thin section divider
───────────────────────────────────────────── */
const Divider = () => <div className="border-t border-gray-100" />;

/* ══════════════════════════════════════════
   Main component
══════════════════════════════════════════ */
const StockThreshold = () => {
    const [isLoading, setIsLoading]             = useState(true);
    const [isSaving, setIsSaving]               = useState(false);
    const [savingMessage, setSavingMessage]     = useState("Saving...");
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
    const [showHowItWorks, setShowHowItWorks] = useState(false);

    const [formData, setFormData] = useState({
        enable_dynamic_pricing: false,

        low_threshold:  5,
        low_increase:   40,

        medium_threshold: 20,
        medium_increase:  20,

        high_threshold: 100,
        high_decrease:  15,

        enable_message:   false,
        customer_message: "High demand – price adjusted based on availability",
    });

    const url = `${COMMERCEKIT.apiurl}/commerce-kit/v1/save-stock-threshold`;

    const handleChange = (key, value) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const applyResponse = (data) =>
        setFormData({
            enable_dynamic_pricing: data.enable_dynamic_pricing === "on",
            low_threshold:    data.low_threshold,
            low_increase:     data.low_increase,
            medium_threshold: data.medium_threshold,
            medium_increase:  data.medium_increase,
            high_threshold:   data.high_threshold,
            high_decrease:    data.high_decrease,
            enable_message:   data.enable_message === "on",
            customer_message: data.customer_message,
        });

    const checkFeatureAndLoad = () => {
        const settingsData   = window.COMMERCEKIT?.settings_data || {};
        const featureEnabled = settingsData["stock-threshold-for-wc"] === "on";
        setIsFeatureEnabled(featureEnabled);

        if (featureEnabled) {
            setIsLoading(true);
            axios
                .get(`${COMMERCEKIT.apiurl}/commerce-kit/v1/get-stock-threshold`, {
                        headers: { "X-WP-Nonce": COMMERCEKIT.nonce },
                    })
                .then((r) => applyResponse(r.data))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkFeatureAndLoad();

        const handleSettingsUpdate = (e) => {
            const updated        = e.detail || {};
            const featureEnabled = updated["stock-threshold-for-wc"] === "on";
            setIsFeatureEnabled(featureEnabled);

            if (featureEnabled) {
                setIsLoading(true);
                axios
                    .get(`${COMMERCEKIT.apiurl}/commerce-kit/v1/get-stock-threshold`, {
                            headers: { "X-WP-Nonce": COMMERCEKIT.nonce },
                        })
                    .then((r) => applyResponse(r.data))
                    .catch((err) => console.error("Error loading stock threshold:", err))
                    .finally(() => setIsLoading(false));
            }
        };

        window.addEventListener("commerceKitSettingsUpdated", handleSettingsUpdate);
        return () =>
            window.removeEventListener("commerceKitSettingsUpdated", handleSettingsUpdate);
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSavingMessage("Saving...");

        axios
            .post(
                url,
                {
                    ...formData,
                    enable_dynamic_pricing: formData.enable_dynamic_pricing ? "on" : "off",
                    enable_message:         formData.enable_message         ? "on" : "off",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce":   COMMERCEKIT.nonce,
                    },
                }
            )
            .then(() => {
                setSavingMessage("Settings Saved!");
                setTimeout(() => setIsSaving(false), 1500);
            })
            .catch((err) => {
                console.error("Error saving stock threshold:", err);
                setSavingMessage("Error saving settings");
                setTimeout(() => setIsSaving(false), 1500);
            });
    };

    /* ── early returns ── */
    if (isLoading) return <SettingSkeleton />;

    if (!isFeatureEnabled) {
        return (
            <div className="relative space-y-6 max-w-4xl">
                <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />
                <div className="mt-6 p-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                           <WarningIcon className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-yellow-800">Feature Not Enabled</h3>
                            <p className="mt-2 text-sm text-yellow-700">
                                The Stock Threshold feature is currently disabled. Please enable{" "}
                                <strong>"Stock Threshold for WooCommerce"</strong> from the Features page first.
                            </p>
                             <div className="mt-4">
                                  <button
                                      onClick={() => (window.location.hash = "")}
                                      className="inline-flex items-center px-4 py-2 bg-blue-700 rounded-md text-sm text-white font-semibold hover:bg-blue-800 transition-colors duration-150"
                                  >
                                      Go to Features Page
                                  </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── main render ── */
        return (
            <div className="relative space-y-6">
                <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />

                {/* Saving overlay */}
                {isSaving && (
                    <div className="commerce-kit-modal-save inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                            <div className="text-white font-semibold text-lg">{savingMessage}</div>
                        </div>
                )}

            <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700">StockAdaptix Pricing Rules</p>
                <p className="text-sm text-gray-500">Configure how stock levels affect product pricing.</p>
            </div>

            {/* Form card */}
            <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-md shadow-sm mb-6">
                <FieldRow label="Enable StockAdaptix">
                    <CheckboxField
                        checked={formData.enable_dynamic_pricing}
                        onChange={(e) => handleChange("enable_dynamic_pricing", e.target.checked)}
                        label="Enable inventory-based dynamic pricing adjustments"
                    />
                </FieldRow>
                <Divider />
                {/* Low Stock Rules */}
                <div className="px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Low Stock Rules</h3>
                <FieldRow label="Low Stock Threshold">
                        <NumberField
                            value={formData.low_threshold}
                            onChange={(e) => handleChange("low_threshold", parseInt(e.target.value) || 0)}
                            helper="Stock level considered low (default: 5)"
                        />
                    </FieldRow>

                    {/* Low Stock Price Increase */}
                    <FieldRow label="Low Stock Price Increase">
                        <NumberField
                            value={formData.low_increase}
                            onChange={(e) => handleChange("low_increase", parseFloat(e.target.value) || 0)}
                            suffix="%"
                            helper="Price increase percentage when stock is low (default: 40%)"
                        />
                    </FieldRow>
                </div>

                <Divider />
                {/* Medium Stock Rules Section */}
                <div className="px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Medium Stock Rules</h3>
                    <FieldRow label="Medium Stock Threshold">
                        <NumberField
                            value={formData.medium_threshold}
                            onChange={(e) => handleChange("medium_threshold", parseInt(e.target.value) || 0)}
                            helper="Stock level considered medium (default: 20)"
                        />
                    </FieldRow>

                    {/* Medium Stock Price Increase */}
                    <FieldRow label="Medium Stock Price Increase">
                        <NumberField
                            value={formData.medium_increase}
                            onChange={(e) => handleChange("medium_increase", parseFloat(e.target.value) || 0)}
                            suffix="%"
                            helper="Price increase percentage when stock is medium (default: 20%)"
                        />
                    </FieldRow>
                </div>

                <Divider />
                {/* High Stock Rules Section */}
                <div className="px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">High Stock Rules</h3>
                    <FieldRow label="High Stock Threshold">
                        <NumberField
                            value={formData.high_threshold}
                            onChange={(e) => handleChange("high_threshold", parseInt(e.target.value) || 0)}
                            helper="Stock level considered high (default: 100)"
                        />
                    </FieldRow>

                    {/* High Stock Price Decrease */}
                    <FieldRow label="High Stock Price Decrease">
                        <NumberField
                            value={formData.high_decrease}
                            onChange={(e) => handleChange("high_decrease", parseFloat(e.target.value) || 0)}
                            suffix="%"
                            helper="Price decrease percentage when stock is high (default: 15%)"
                        />
                    </FieldRow>
                </div>

                <Divider />

                {/* Enable Customer Message */}
                <FieldRow label="Enable Customer Message">
                    <CheckboxField
                        checked={formData.enable_message}
                        onChange={(e) => handleChange("enable_message", e.target.checked)}
                        label="Display a message to customers about price adjustments"
                    />
                </FieldRow>

                {/* Customer Message */}
                <FieldRow label="Customer Message">
                     <textarea
                         value={formData.customer_message}
                         onChange={(e) => handleChange("customer_message", e.target.value)}
                         rows={2}
                         className="w-full px-3 py-1.5 text-sm text-gray-800 bg-white border border-gray-400 rounded shadow-inner focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                     />
                     <p className="mt-1.5 text-xs text-gray-500 italic">
                         Message shown to customers when prices are adjusted (default: "High demand – price adjusted based on availability")
                     </p>
                </FieldRow>

                {/* Save button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-md">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>

            {/* How It Works */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm max-w-lg">
                <button
                    type="button"
                    onClick={() => setShowHowItWorks(!showHowItWorks)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                    <span>How It Works</span>
                    <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${showHowItWorks ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {showHowItWorks && (
                    <div className="px-6 pb-6">
                        <ul className="space-y-2">
                            {[
                                "If stock ≤ Low Stock Threshold: increase price by Low Stock Price Increase %",
                                "If stock ≤ Medium Stock Threshold: increase price by Medium Stock Price Increase %",
                                "If stock ≥ High Stock Threshold: decrease price by High Stock Price Decrease %",
                                "Otherwise: use normal price",
                            ].map((line) => (
                                <li key={line} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="mt-0.5 text-blue-600 font-bold leading-none">•</span>
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockThreshold;