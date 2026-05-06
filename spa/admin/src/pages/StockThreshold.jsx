import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";
import { SaveButtonIcon, WarningIcon } from "../../common/Svgs";

/* ── Badge pill ── */
const Pill = ({ label, className }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
    {label}
  </span>
);

/* ── Section header ── */
const SectionHeader = ({ icon, title, description, headerClass, pillClass }) => (
  <div className={`flex items-center gap-3 px-6 py-4 border-b ${headerClass}`}>
    <span className="text-xl leading-none select-none">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="m-0 text-[13px] font-bold text-gray-800 tracking-wide">{title}</p>
      <p className="m-0 mt-0.5 text-[11px] text-gray-500">{description}</p>
    </div>
    <Pill label={title.split(" ")[0]} className={pillClass} />
  </div>
);

/* ── Number input row ── */
const InputRow = ({ label, value, onChange, suffix, helper }) => (
  <div className="flex items-center px-6 py-3 gap-4 border-b border-gray-100 last:border-b-0">
    <div className="w-56 flex-shrink-0">
      <p className="m-0 text-[13px] font-semibold text-gray-700">{label}</p>
      {helper && <p className="m-0 mt-0.5 text-[11px] text-gray-400">{helper}</p>}
    </div>
    <div className="flex items-stretch rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-150">
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-20 px-3 py-1.5 border-none outline-none text-sm font-semibold text-gray-800 bg-transparent font-mono"
      />
      {suffix && (
        <span className="px-3 py-1.5 text-[13px] font-bold text-white bg-gray-700 border-l border-gray-200 select-none flex items-center">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

/* ── Toggle switch ── */
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange({ target: { checked: !checked } })}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
      checked ? "bg-blue-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

/* ══════════════════════════════════════════
   Main component
══════════════════════════════════════════ */
const StockThreshold = () => {
  const [isLoading, setIsLoading]               = useState(true);
  const [isSaving, setIsSaving]                 = useState(false);
  const [saveStatus, setSaveStatus]             = useState(null); // null | "success" | "error"
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

  const url = `${COMMERCEKIT.apiurl}/commerce-kit/v1/save-stock-threshold`;
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
      <div className="max-w-2xl">
        <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />
        <div className="mt-6 flex gap-4 p-6 bg-yellow-50 border border-yellow-300 border-l-4 border-l-yellow-500 rounded-xl">
          <WarningIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="m-0 text-[15px] font-bold text-yellow-900">Feature Not Enabled</p>
            <p className="mt-1.5 mb-4 m-0 text-[13px] text-yellow-800 leading-relaxed">
              The Stock Threshold feature is currently disabled. Please enable{" "}
              <strong>"Stock Threshold for WooCommerce"</strong> from the Features page first.
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

  /* ── main render ── */
  return (
    <div className="max-w-3xl">

      <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />

      {/* ── Page title row ── */}
      <div className="flex items-end justify-between mt-6 mb-5">
        <div>
          <h2 className="m-0 text-[22px] font-extrabold text-gray-800 tracking-tight">
            StockAdaptix Pricing Rules
          </h2>
          <p className="m-0 mt-1 text-[13px] text-gray-500">
            Configure how inventory levels automatically adjust product pricing.
          </p>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              formData.enable_dynamic_pricing
                ? "bg-green-500 ring-2 ring-green-200"
                : "bg-gray-300"
            }`}
          />
          <span
            className={`text-xs font-semibold transition-colors duration-300 ${
              formData.enable_dynamic_pricing ? "text-green-600" : "text-gray-400"
            }`}
          >
            {formData.enable_dynamic_pricing ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* ── Save toast ── */}
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
            ? "Settings saved successfully."
            : "Error saving settings. Please try again."}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">

        {/* ── Master enable card ── */}
        <div
          className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-colors duration-200 ${
            formData.enable_dynamic_pricing
              ? "border-blue-300 ring-1 ring-blue-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="m-0 text-sm font-bold text-gray-800">Enable StockAdaptix</p>
              <p className="m-0 mt-0.5 text-xs text-gray-500">
                Activate inventory-based dynamic pricing adjustments across your store
              </p>
            </div>
            <Toggle
              checked={formData.enable_dynamic_pricing}
              onChange={(e) => handleChange("enable_dynamic_pricing", e.target.checked)}
            />
          </div>
        </div>

        {/* ── Pricing rules card ── */}
        <div
          className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-opacity duration-200 ${
            formData.enable_dynamic_pricing
              ? "opacity-100 pointer-events-auto"
              : "opacity-50 pointer-events-none"
          }`}
        >
          {/* Low Stock */}
          <SectionHeader
            icon="🔴"
            title="Low Stock Rules"
            description="Increase price when inventory is scarce"
            headerClass="bg-red-50 border-red-100"
            pillClass="text-red-600 bg-red-50 border-red-200"
          />
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
          <SectionHeader
            icon="🟡"
            title="Medium Stock Rules"
            description="Slight increase for moderate inventory levels"
            headerClass="bg-amber-50 border-amber-100"
            pillClass="text-amber-600 bg-amber-50 border-amber-200"
          />
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
          <SectionHeader
            icon="🟢"
            title="High Stock Rules"
            description="Decrease price to move excess inventory faster"
            headerClass="bg-green-50 border-green-100"
            pillClass="text-green-600 bg-green-50 border-green-200"
          />
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
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-b border-gray-100">
            <div>
              <p className="m-0 text-[13px] font-bold text-gray-800">💬 Customer Message</p>
              <p className="m-0 mt-0.5 text-[11px] text-gray-500">
                Notify shoppers when pricing has been adjusted
              </p>
            </div>
            <Toggle
              checked={formData.enable_message}
              onChange={(e) => handleChange("enable_message", e.target.checked)}
            />
          </div>

          {/* Textarea body */}
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
              Shown to customers when dynamic pricing is applied on product pages.
            </p>
          </div>
        </div>

        {/* ── Save button row ── */}
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
              <>
                {SaveButtonIcon}
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

      {/* ── How It Works accordion ── */}
      <div className="mt-6 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 max-w-lg">
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-transparent border-none cursor-pointer text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <span>📖</span>
            How It Works
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
              {
                icon: "🔴",
                text: "Stock ≤ Low Threshold → price increases by Low %",
                className: "bg-red-50 border-red-100 text-red-800",
              },
              {
                icon: "🟡",
                text: "Stock ≤ Medium Threshold → price increases by Medium %",
                className: "bg-amber-50 border-amber-100 text-amber-800",
              },
              {
                icon: "🟢",
                text: "Stock ≥ High Threshold → price decreases by High %",
                className: "bg-green-50 border-green-100 text-green-800",
              },
              {
                icon: "⚪",
                text: "Otherwise → normal base price applies",
                className: "bg-gray-50 border-gray-100 text-gray-600",
              },
            ].map(({ icon, text, className }) => (
              <div
                key={text}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-[12px] leading-relaxed ${className}`}
              >
                <span className="flex-shrink-0 leading-relaxed">{icon}</span>
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