import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";
import FieldRow from "../../common/FieldRow";
import NumberField from "../../common/NumberField";


/* ─────────────────────────────────────────────
   Checkbox field + helper
───────────────────────────────────────────── */
const CheckboxField = ({ checked, onChange, label, helper }) => (
    <>
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-800">{label}</span>
        </label>
        {helper && (
            <p className="mt-1.5 text-xs text-gray-500 italic">{helper}</p>
        )}
    </>
);

/* ─────────────────────────────────────────────
   Thin section divider
───────────────────────────────────────────── */
const Divider = () => <div className="border-t border-gray-100" />;

/* ═════════════════════════════════════════════
   Main component
═════════════════════════════════════════════ */
const StockThreshold = () => {
    const [isLoading, setIsLoading]             = useState(true);
    const [isSaving, setIsSaving]               = useState(false);
    const [savingMessage, setSavingMessage]     = useState("Saving...");
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

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

    const url = `${THRAILCOMMERCE.apiurl}/save-stock-threshold`;

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
        const settingsData   = window.THRAILCOMMERCE?.settings_data || {};
        const featureEnabled = settingsData["stock-threshold-for-wc"] === "on";
        setIsFeatureEnabled(featureEnabled);

        if (featureEnabled) {
            setIsLoading(true);
            axios
                .get(`${THRAILCOMMERCE.apiurl}/get-stock-threshold`, {
                    headers: { "X-WP-Nonce": THRAILCOMMERCE.nonce },
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
                    .get(`${THRAILCOMMERCE.apiurl}/get-stock-threshold`, {
                        headers: { "X-WP-Nonce": THRAILCOMMERCE.nonce },
                    })
                    .then((r) => applyResponse(r.data))
                    .catch((err) => console.error("Error loading stock threshold:", err))
                    .finally(() => setIsLoading(false));
            }
        };

        window.addEventListener("thrailSettingsUpdated", handleSettingsUpdate);
        return () =>
            window.removeEventListener("thrailSettingsUpdated", handleSettingsUpdate);
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
                        "X-WP-Nonce":   THRAILCOMMERCE.nonce,
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
            <div className="relative">
                <CommonHeader title="Stock Threshold Settings" />
                <div className="mt-6 p-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
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
                                    className="inline-flex items-center px-4 py-2 bg-[#0029af] rounded-md text-sm text-white font-semibold hover:bg-[#0842ff] transition-colors duration-150"
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
        <div className="relative">

            {/* Saving overlay */}
            {isSaving && (
                <div className="thrail-modal-save inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="text-white font-semibold text-lg">{savingMessage}</div>
                </div>
            )}

            {/* Page header */}
            <CommonHeader title="StockAdaptix Pricing for WooCommerce" />
            <div className="mt-1 mb-5">
                <p className="text-sm font-semibold text-gray-700">Pricing Configuration</p>
                <p className="text-sm text-gray-500">Configure how stock levels affect product pricing.</p>
            </div>

            {/* Form card */}
            <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-md shadow-sm mb-6">

                {/* Enable Dynamic Pricing */}
                {/* <FieldRow label="Enable Dynamic Pricing">
                    <CheckboxField
                        checked={formData.enable_dynamic_pricing}
                        onChange={(e) => handleChange("enable_dynamic_pricing", e.target.checked)}
                        label="Check this box to enable dynamic stock-based pricing"
                    />
                </FieldRow> */}

                <Divider />

                {/* Low Stock Threshold */}
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

                <Divider />

                {/* Medium Stock Threshold */}
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

                <Divider />

                {/* High Stock Threshold */}
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
                    <>
                        <input
                            type="text"
                            value={formData.customer_message}
                            onChange={(e) => handleChange("customer_message", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm text-gray-800 bg-white border border-gray-400 rounded shadow-inner focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        <p className="mt-1.5 text-xs text-gray-500 italic">
                            Message shown to customers when prices are adjusted (default: "High demand – price adjusted based on availability")
                        </p>
                    </>
                </FieldRow>

                {/* Save button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-md">
                    <button
                        type="submit"
                        className="inline-flex items-center px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors duration-150"
                    >
                        Save Changes
                    </button>
                </div>
            </form>

            {/* How It Works */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm p-6 max-w-lg">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">How It Works</h4>
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

        </div>
    );
};

export default StockThreshold;