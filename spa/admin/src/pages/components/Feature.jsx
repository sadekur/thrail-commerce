import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../../common/CommonHeader";

const Features = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savingMessage, setSavingMessage] = useState("Saving...");
    const [loader, setLoader] = useState("Save Settings");

    const [toggles, setToggles] = useState([
        {
            id: 1,
            label: "Woocommerce Tip",
            name: "woocommerce-tips",
            description:
                "Enable the footer hook to show additional content in the footer.",
            value: false,
        },
        {
            id: 2,
            label: "Woocommerce Faq",
            name: "woocommerce-faq",
            description: "Enable custom functionality 1 for advanced features.",
            value: false,
        },
        {
            id: 3,
            label: "Woocommerce Product Barcode",
            name: "woocommerce-product-barcode",
            description: "Enable custom functionality 2 for more options.",
            value: false,
        },
        {
            id: 4,
            label: "Buy Button for WooCommerce",
            name: "buy-button-for-woocommerce",
            description: "Enable custom functionality 3 for more options.",
            value: false,
        },
    ]);

    const url = `${THRAILCOMMERCE.apiurl}/post-settings`;

    const save = (updatedToggles) => {
        const toggleValues = updatedToggles.reduce((acc, toggle) => {
            acc[toggle.name] = toggle.value ? "on" : "off";
            return acc;
        }, {});

        setIsSaving(true);
        setSavingMessage("Saving...");

        axios
            .post(
                url,
                { settings: toggleValues },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": THRAILCOMMERCE.nonce,
                    },
                }
            )
            .then(() => {
                setSavingMessage("Settings Saved!");
                setToggles(updatedToggles);
				window.location.reload();
                setTimeout(() => {
                    setIsSaving(false);
                }, 1500);
            })
            .catch((error) => {
                console.error("Error saving settings:", error);
                setSavingMessage("Error saving settings");
                setTimeout(() => {
                    setIsSaving(false);
                }, 1500);
            });
    };

    const handleToggleChange = (id) => {
        setToggles((prevToggles) => {
            const updatedToggles = prevToggles.map((toggle) =>
                toggle.id === id ? { ...toggle, value: !toggle.value } : toggle
            );
            return updatedToggles;
        });
    };

    const handleDisableAll = () => {
        setToggles((prevToggles) =>
            prevToggles.map((toggle) => ({ ...toggle, value: false }))
        );
    };

    const handleEnableAll = () => {
        setToggles((prevToggles) =>
            prevToggles.map((toggle) => ({ ...toggle, value: true }))
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader("Saving...");
        save(toggles);
        setLoader("Save Settings");
    };

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${THRAILCOMMERCE.apiurl}/get-settings`)
            .then((response) => {
                const updatedToggles = toggles.map((toggle) => ({
                    ...toggle,
                    value: response.data[toggle.name] === "on",
                }));
                setToggles(updatedToggles);
            })
            .catch((error) => {
                console.error("Error loading settings:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="relative">
            {isSaving && (
                <div className="thrail-modal-save inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="text-white font-semibold text-lg">
                        {savingMessage}
                    </div>
                </div>
            )}

            <CommonHeader
                title="Manage Features"
                onDisableAll={handleDisableAll}
                onEnableAll={handleEnableAll}
            />

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <form id="work-settings-form" onSubmit={handleSubmit}>
                    <div className="mt-4 grid grid-cols-4 md:grid-cols-4 sm:grid-cols-1 gap-6">
                        {toggles.map((toggle) => (
                            <div
                                key={toggle.id}
                                className="p-4 bg-white shadow-md rounded-lg border border-gray-200 relative">
                                <div className="flex flex-col h-full">
                                    <div className="mb-auto">
                                        <h3 className="text-lg font-semibold">
                                            {toggle.label}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {toggle.description}
                                        </p>
                                    </div>
                                    <div className="mt-auto flex justify-end">
                                        <label className="relative inline-block w-12">
                                            <input
                                                type="checkbox"
                                                id={`toggle-${toggle.id}`}
                                                name={toggle.name}
                                                className="opacity-0 w-0 h-0"
                                                checked={toggle.value}
                                                onChange={() =>
                                                    handleToggleChange(
                                                        toggle.id
                                                    )
                                                }
                                            />
                                            <span
                                                className={`slider block rounded-full w-[50px] h-[22px] cursor-pointer transition-all duration-100 ${
                                                    toggle.value
                                                        ? "bg-[#0029af]"
                                                        : "bg-[#867c7c]"
                                                }`}></span>
                                            <span
                                                className={`dot absolute left-2 top-6 w-3 h-3 bg-white rounded-full transition-transform duration-100 transform ${
                                                    toggle.value
                                                        ? "translate-x-6"
                                                        : ""
                                                }`}></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="submit mt-6 flex justify-center">
						<button
							type="submit"
							className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
						>
							{loader}
						</button>
					</p>
                </form>
            )}
        </div>
    );
};

export default Features;
