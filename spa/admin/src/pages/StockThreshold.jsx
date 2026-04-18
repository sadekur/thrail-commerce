import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";

const StockThreshold = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savingMessage, setSavingMessage] = useState("Saving...");
    const [threshold, setThreshold] = useState(5);
    const [enabled, setEnabled] = useState(false);
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

    const url = `${THRAILCOMMERCE.apiurl}/save-stock-threshold`;

    const checkFeatureAndLoad = () => {
        const settingsData = window.THRAILCOMMERCE?.settings_data || {};
        const featureEnabled = settingsData["stock-threshold-for-wc"] === "on";
        setIsFeatureEnabled(featureEnabled);

        if (featureEnabled) {
            setIsLoading(true);
            axios
                .get(`${THRAILCOMMERCE.apiurl}/get-stock-threshold`)
                .then((response) => {
                    setThreshold(response.data.threshold || 5);
                    setEnabled(response.data.enabled === "on");
                })
                .catch((error) => {
                    console.error("Error loading stock threshold:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkFeatureAndLoad();

        const handleSettingsUpdate = (e) => {
            const updated = e.detail || {};
            const featureEnabled = updated["stock-threshold-for-wc"] === "on";
            setIsFeatureEnabled(featureEnabled);

            if (featureEnabled) {
                setIsLoading(true);
                axios
                    .get(`${THRAILCOMMERCE.apiurl}/get-stock-threshold`)
                    .then((response) => {
                        setThreshold(response.data.threshold || 5);
                        setEnabled(response.data.enabled === "on");
                    })
                    .catch((error) => {
                        console.error("Error loading stock threshold:", error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        };

        window.addEventListener("thrailSettingsUpdated", handleSettingsUpdate);
        return () => window.removeEventListener("thrailSettingsUpdated", handleSettingsUpdate);
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSavingMessage("Saving...");

        axios
            .post(
                url,
                { threshold, enabled: enabled ? "on" : "off" },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": THRAILCOMMERCE.nonce,
                    },
                }
            )
            .then(() => {
                setSavingMessage("Settings Saved!");
                setTimeout(() => setIsSaving(false), 1500);
            })
            .catch((error) => {
                console.error("Error saving stock threshold:", error);
                setSavingMessage("Error saving settings");
                setTimeout(() => setIsSaving(false), 1500);
            });
    };

    if (isLoading) {
        return (
            <SettingSkeleton />
        );
    }

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
                                
                                   <a href="admin.php?page=thrail-commerce"
                                    className="inline-flex items-center px-4 py-2 bg-[#0029af] rounded-md text-sm text-white font-semibold hover:bg-[#0842ff]"
                                >
                                    Go to Features Page
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {isSaving && (
                <div className="thrail-modal-save inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="text-white font-semibold text-lg">{savingMessage}</div>
                </div>
            )}

            {/* <CommonHeader title="Stock Threshold Settings" /> */}

            <form onSubmit={handleSave} className="mt-4">
                <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Threshold Value
                        </label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0029af]"
                            min="0"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Products with stock at or below this value will be flagged.
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StockThreshold;