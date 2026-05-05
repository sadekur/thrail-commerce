import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";
import { WarningIcon } from "../../common/Svgs";
import Pill from "../../common/Pill";
import SectionHeader from "../../common/SectionHeader";
import InputRow from "../../common/InputRow";
import Toggle from "../../common/Toggle";

const StockThreshold = () => {
  const [isLoading, setIsLoading]               = useState(true);
  const [isSaving, setIsSaving]                 = useState(false);
  const [saveStatus, setSaveStatus]             = useState(null);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const [showHowItWorks, setShowHowItWorks]     = useState(false);

  const [formData, setFormData] = useState({
    enable_dynamic_pricing: false,
    low_threshold:    5,
    low_increase:     40,
    medium_threshold: 20,
    medium_increase:  20,
    high_threshold:   100,
    high_decrease:    15,
    enable_message:   false,
    customer_message: "High demand – price adjusted based on availability",
  });

  const url = `${COMMERCEKIT.apiurl}save-stock-threshold`;
  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

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
          enable_dynamic_pricing: formData.enable_dynamic_pricing ? "on" : "off",
          enable_message:         formData.enable_message         ? "on" : "off",
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

  /* ── early returns ── */
  if (isLoading) return <SettingSkeleton />;

  if (!isFeatureEnabled) {
    return (
      <div className="max-w-[680px]">
        <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />
        <div className="mt-6 p-7 bg-amber-50 border border-amber-300 border-l-[4px] border-l-amber-500 rounded-xl flex gap-4">
          <WarningIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-lg font-bold text-amber-900">Feature Not Enabled</p>
            <p className="mt-1.5 text-sm text-amber-800 leading-relaxed">
              The Stock Threshold feature is currently disabled. Please enable{" "}
              <strong>"Stock Threshold for WooCommerce"</strong> from the Features page first.
            </p>
            <button
              onClick={() => (window.location.hash = "")}
              className="mt-4 inline-flex items-center gap-2 px-4.5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Features Page →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div className="max-w-[760px] font-['Inter',system-ui,sans-serif]">
      {/* Page title row */}
      <div className="flex items-end justify-between mb-5 mt-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">StockAdaptix Pricing Rules</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure how inventory levels automatically adjust product pricing.
          </p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              formData.enable_dynamic_pricing
                ? "bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.3)]"
                : "bg-gray-400"
            }`}
          />
          <span className={`text-xs font-semibold ${
            formData.enable_dynamic_pricing ? "text-green-500" : "text-gray-400"
          }`}>
            {formData.enable_dynamic_pricing ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Save toast */}
      {saveStatus && (
        <div
          className={`flex items-center gap-2.5 px-4 py-2.5 mb-4 rounded-xl text-sm font-semibold ${
            saveStatus === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          <span>{saveStatus === "success" ? "✓" : "✕"}</span>
          {saveStatus === "success" ? "Settings saved successfully." : "Error saving settings. Please try again."}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* ── Master enable card ── */}
        <div
          className={`bg-white border-[1.5px] rounded-xl mb-4 overflow-hidden shadow-sm transition-colors duration-200 ${
            formData.enable_dynamic_pricing ? "border-blue-500/50" : "border-gray-200"
          }`}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Enable StockAdaptix</p>
              <p className="mt-0.5 text-xs text-gray-500">
                Activate inventory-based dynamic pricing adjustments across your store
              </p>
            </div>
            <Toggle
              checked={formData.enable_dynamic_pricing}
              onChange={(e) => handleChange("enable_dynamic_pricing", e.target.checked)}
              label=""
            />
          </div>
        </div>

        {/* ── Rules card ── */}
        <div
          className={`bg-white border-[1.5px] border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm transition-opacity duration-200 ${
            formData.enable_dynamic_pricing ? "opacity-100" : "opacity-55 pointer-events-none"
          }`}
        >
          {/* Low Stock */}
          <SectionHeader icon="🔴" title="Low Stock Rules" color="red" description="Increase price when inventory is scarce" />
          <InputRow
            label="Low Stock Threshold"
            value={formData.low_threshold}
            onChange={(e) => handleChange("low_threshold", parseInt(e.target.value) || 0)}
            helper="Items at or below this count = low stock"
          />
          <InputRow
            label="Price Increase"
            value={formData.low_increase}
            onChange={(e) => handleChange("low_increase", parseFloat(e.target.value) || 0)}
            suffix="%"
            helper="% added to base price when stock is low"
          />

          {/* Medium Stock */}
          <SectionHeader icon="🟡" title="Medium Stock Rules" color="amber" description="Slight increase for moderate inventory levels" />
          <InputRow
            label="Medium Stock Threshold"
            value={formData.medium_threshold}
            onChange={(e) => handleChange("medium_threshold", parseInt(e.target.value) || 0)}
            helper="Items at or below this count = medium stock"
          />
          <InputRow
            label="Price Increase"
            value={formData.medium_increase}
            onChange={(e) => handleChange("medium_increase", parseFloat(e.target.value) || 0)}
            suffix="%"
            helper="% added to base price when stock is medium"
          />

          {/* High Stock */}
          <SectionHeader icon="🟢" title="High Stock Rules" color="green" description="Decrease price to move excess inventory faster" />
          <InputRow
            label="High Stock Threshold"
            value={formData.high_threshold}
            onChange={(e) => handleChange("high_threshold", parseInt(e.target.value) || 0)}
            helper="Items at or above this count = high stock"
          />
          <InputRow
            label="Price Decrease"
            value={formData.high_decrease}
            onChange={(e) => handleChange("high_decrease", parseFloat(e.target.value) || 0)}
            suffix="%"
            helper="% subtracted from base price when stock is high"
          />
        </div>

        {/* ── Customer message card ── */}
        <div className="bg-white border-[1.5px] border-gray-200 rounded-xl mb-5 overflow-hidden shadow-sm">
          <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">💬 Customer Message</p>
              <p className="mt-0.5 text-xs text-gray-500">
                Notify shoppers when pricing has been adjusted
              </p>
            </div>
            <Toggle
              checked={formData.enable_message}
              onChange={(e) => handleChange("enable_message", e.target.checked)}
              label=""
            />
          </div>
          <div
            className={`px-6 py-4 transition-opacity duration-200 ${
              formData.enable_message ? "opacity-100" : "opacity-45 pointer-events-none"
            }`}
          >
            <label className="block mb-2 text-xs font-semibold text-gray-600 tracking-wide uppercase">
              Message Text
            </label>
            <textarea
              value={formData.customer_message}
              onChange={(e) => handleChange("customer_message", e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border-[1.5px] border-gray-200 rounded-lg outline-none resize-none font-inherit leading-relaxed box-border focus:border-blue-500 transition-colors"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Shown to customers when dynamic pricing is applied on product pages.
            </p>
          </div>
        </div>

        {/* ── Save button ── */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-lg transition-all duration-200 ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 shadow-[0_2px_8px_rgba(59,130,246,0.25)]"
            }`}
          >
            {isSaving ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <span className="text-xs text-gray-400">Changes are applied immediately after saving.</span>
        </div>
      </form>

      {/* ── How It Works ── */}
      <div className="mt-6 bg-white border-[1.5px] border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-[520px]">
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-transparent border-none cursor-pointer text-sm font-bold text-gray-700"
        >
          <span className="flex items-center gap-2">
            <span>📖</span> How It Works
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              showHowItWorks ? "rotate-180" : "rotate-0"
            }`}
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {showHowItWorks && (
          <div className="px-5 pb-5">
            <div className="flex flex-col gap-2">
              {[
                { icon: "🔴", text: "Stock ≤ Low Threshold → price increases by Low %", color: "red" },
                { icon: "🟡", text: "Stock ≤ Medium Threshold → price increases by Medium %", color: "amber" },
                { icon: "🟢", text: "Stock ≥ High Threshold → price decreases by High %", color: "green" },
                { icon: "⚪", text: "Otherwise → normal base price applies", color: "gray" },
              ].map(({ icon, text, color }) => (
                <div
                  key={text}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-sm text-gray-700 leading-relaxed ${
                    color === "red" ? "bg-red-500/5 border-red-500/20" :
                    color === "amber" ? "bg-amber-500/5 border-amber-500/20" :
                    color === "green" ? "bg-green-500/5 border-green-500/20" :
                    "bg-gray-500/5 border-gray-500/20"
                  }`}
                >
                  <span className="flex-shrink-0">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockThreshold;
