import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";
import { SaveButtonIcon, SaveChangesIcon, WarningIcon } from "../../common/Svgs";
import SectionHeader from "../../common/SectionHeader";
import InputRow from "../../common/InputRow";
import Toggle from "../../common/Toggle";

const StockThreshold = () => {
  const [isLoading, setIsLoading]           = useState(true);
  const [isSaving, setIsSaving]             = useState(false);
  const [saveStatus, setSaveStatus]         = useState(null);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [formData, setFormData] = useState({
    low_threshold:    5,
    low_increase:     40,
    medium_threshold: 20,
    medium_increase:  20,
    high_threshold:   100,
    high_decrease:    15,
    enable_message:   false,
    customer_message: "High demand – price adjusted based on availability",
  });

  const url = `${COMMERCEKIT.apiurl}/save-stock-threshold`;
  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const applyResponse = (data) =>
    setFormData({
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
        .get(`${COMMERCEKIT.apiurl}/get-stock-threshold`, {
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
          .get(`${COMMERCEKIT.apiurl}/get-stock-threshold`, {
            headers: { "X-WP-Nonce": COMMERCEKIT.nonce },
          })
          .then((r) => applyResponse(r.data))
          .catch((err) => console.error("Error loading stock threshold:", err))
          .finally(() => setIsLoading(false));
      }
    };
    window.addEventListener("commerceKitSettingsUpdated", handleSettingsUpdate);
    return () => window.removeEventListener("commerceKitSettingsUpdated", handleSettingsUpdate);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    axios
      .post(
        url,
        {
          ...formData,
          enable_message: formData.enable_message ? "on" : "off",
        },
        { headers: { "Content-Type": "application/json", "X-WP-Nonce": COMMERCEKIT.nonce } }
      )
      .then(() => {
        setSaveStatus("success");
        setIsSaving(false);
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .catch((err) => {
        console.error("Error saving stock threshold:", err);
        setSaveStatus("error");
        setIsSaving(false);
        setTimeout(() => setSaveStatus(null), 3000);
      });
  };

  if (isLoading) return <SettingSkeleton />;

  if (!isFeatureEnabled) {
    return (
      <div className="max-w-2xl">
        <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />
        <div className="mt-6 flex gap-4 p-6 bg-yellow-50 border border-yellow-300 border-l-4 border-l-yellow-500 rounded-xl">
          <WarningIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="m-0 text-[15px] font-bold text-yellow-900">Feature Not Enabled</p>
            <p className="mt-1.5 mb-4 text-[13px] text-yellow-800 leading-relaxed">
              Enable <strong>"Stock Threshold for WooCommerce"</strong> from Features page first.
            </p>
            <button
              onClick={() => (window.location.hash = "")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg transition-colors duration-150 cursor-pointer border-none"
            >
              Go to Features Page →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />

      <div className="flex items-end justify-between mt-6 mb-5">
        <div>
          <h2 className="m-0 text-[22px] font-extrabold text-gray-800 tracking-tight">
            StockAdaptix Pricing Rules
          </h2>
        </div>
      </div>

      {saveStatus && (
        <div
          className={`flex items-center gap-2.5 px-4 py-2.5 mb-4 rounded-xl text-[13px] font-semibold border ${
            saveStatus === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          <span className="text-base leading-none">
            {saveStatus === "success" ? "✓" : "✕"}
          </span>
          {saveStatus === "success"
            ? "Settings saved."
            : "Error saving. Try again."}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">

        {/* Low Stock */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <SectionHeader
            icon="🔴"
            title="Low Stock Rules"
            headerClass="bg-red-50 border-red-100"
            pillClass="text-red-600 bg-red-50 border-red-200"
          />
          <InputRow
            label="Low Stock Threshold"
            value={formData.low_threshold}
            onChange={(e) => handleChange("low_threshold", parseInt(e.target.value) || 0)}
            helper="Items at or below = low stock"
          />
          <InputRow
            label="Price Increase"
            value={formData.low_increase}
            onChange={(e) => handleChange("low_increase", parseFloat(e.target.value) || 0)}
            suffix="%"
            helper="% added to base price"
          />
        </div>

        {/* Medium Stock */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <SectionHeader
            icon="🟡"
            title="Medium Stock Rules"
            headerClass="bg-amber-50 border-amber-100"
            pillClass="text-amber-600 bg-amber-50 border-amber-200"
          />
          <InputRow
            label="Medium Stock Threshold"
            value={formData.medium_threshold}
            onChange={(e) => handleChange("medium_threshold", parseInt(e.target.value) || 0)}
            helper="Items at or below = medium stock"
          />
          <InputRow
            label="Price Increase"
            value={formData.medium_increase}
            onChange={(e) => handleChange("medium_increase", parseFloat(e.target.value) || 0)}
            suffix="%"
            helper="% added to base price"
          />
        </div>

        {/* High Stock */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <SectionHeader
            icon="🟢"
            title="High Stock Rules"
            headerClass="bg-green-50 border-green-100"
            pillClass="text-green-600 bg-green-50 border-green-200"
          />
          <InputRow
            label="High Stock Threshold"
            value={formData.high_threshold}
            onChange={(e) => handleChange("high_threshold", parseInt(e.target.value) || 0)}
            helper="Items at or above = high stock"
          />
          <InputRow
            label="Price Decrease"
            value={formData.high_decrease}
            onChange={(e) => handleChange("high_decrease", parseFloat(e.target.value) || 0)}
            suffix="%"
            helper="% subtracted from base price"
          />
        </div>

        {/* Customer Message */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-b border-gray-100">
            <div>
              <p className="m-0 text-[13px] font-bold text-gray-800">💬 Customer Message</p>
            </div>
            <Toggle
              checked={formData.enable_message}
              onChange={(e) => handleChange("enable_message", e.target.checked)}
            />
          </div>
          <div
            className={`px-6 py-4 transition-opacity duration-200 ${
              formData.enable_message
                ? "opacity-100 pointer-events-auto"
                : "opacity-40 pointer-events-none"
            }`}
          >
            <label className="block mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Message Text
            </label>
            <textarea
              value={formData.customer_message}
              onChange={(e) => handleChange("customer_message", e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 text-[13px] text-gray-800 bg-gray-50 border border-gray-200 rounded-lg resize-none font-sans leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
            />
            <p className="m-0 mt-1.5 text-[11px] text-gray-400">
              Shown on product pages when dynamic pricing applied.
            </p>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-white text-[13px] font-bold rounded-lg border-none transition-all duration-200 ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-200"
            }`}
          >
            {isSaving ? (
              <>{SaveButtonIcon} Saving…</>
            ) : (
              <>{SaveChangesIcon} Save Changes</>
            )}
          </button>
          <span className="text-xs text-gray-400">Applied immediately after saving.</span>
        </div>
      </form>

      {/* How It Works */}
      <div className="mt-6 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 max-w-lg">
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-transparent border-none cursor-pointer text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <span>📖</span> How It Works
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showHowItWorks ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showHowItWorks && (
          <div className="px-5 pb-5 flex flex-col gap-2">
            {[
              { icon: "🔴", text: "Stock ≤ Low Threshold → price +Low %",    cls: "bg-red-50 border-red-100 text-red-800"     },
              { icon: "🟡", text: "Stock ≤ Medium Threshold → price +Medium %", cls: "bg-amber-50 border-amber-100 text-amber-800" },
              { icon: "🟢", text: "Stock ≥ High Threshold → price −High %",   cls: "bg-green-50 border-green-100 text-green-800" },
              { icon: "⚪", text: "Otherwise → base price",                    cls: "bg-gray-50 border-gray-100 text-gray-600"    },
            ].map(({ icon, text, cls }) => (
              <div
                key={text}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-[12px] leading-relaxed ${cls}`}
              >
                <span className="flex-shrink-0">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockThreshold;