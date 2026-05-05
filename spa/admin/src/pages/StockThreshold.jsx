import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../common/CommonHeader";
import SettingSkeleton from "../../common/Skeletons/SettingSkalaton";
import { WarningIcon } from "../../common/Svgs";

/* ─────────────────────────────────────────────
   Inline styles / design tokens
───────────────────────────────────────────── */
const tokens = {
  red:    "#E53E3E",
  amber:  "#D97706",
  green:  "#059669",
  blue:   "#2563EB",
  blueDark: "#1D4ED8",
  gray50:  "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  white:   "#FFFFFF",
};

/* ── Badge pill ── */
const Pill = ({ color, label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "2px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      background: color + "18",
      color: color,
      border: `1px solid ${color}30`,
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
    {label}
  </span>
);

/* ── Section header ── */
const SectionHeader = ({ icon, title, color, description }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "16px 24px",
      background: color + "08",
      borderBottom: `1px solid ${color}20`,
    }}
  >
    <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tokens.gray800, letterSpacing: "0.01em" }}>{title}</p>
      <p style={{ margin: "2px 0 0", fontSize: 12, color: tokens.gray500 }}>{description}</p>
    </div>
    <div style={{ marginLeft: "auto" }}>
      <Pill color={color} label={title.split(" ")[0]} />
    </div>
  </div>
);

/* ── Number input row ── */
const InputRow = ({ label, value, onChange, suffix, helper }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "12px 24px",
      gap: 16,
      borderBottom: `1px solid ${tokens.gray100}`,
    }}
  >
    <div style={{ flex: "0 0 220px" }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tokens.gray700 }}>{label}</p>
      {helper && <p style={{ margin: "2px 0 0", fontSize: 11, color: tokens.gray400 }}>{helper}</p>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 8, border: `1.5px solid ${tokens.gray200}`, overflow: "hidden", background: tokens.white, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <input
        type="number"
        value={value}
        onChange={onChange}
        style={{
          width: 90,
          padding: "7px 12px",
          border: "none",
          outline: "none",
          fontSize: 14,
          fontWeight: 600,
          color: tokens.gray800,
          background: "transparent",
          fontFamily: "'DM Mono', 'Courier New', monospace",
        }}
      />
      {suffix && (
        <span
          style={{
            padding: "7px 12px",
            fontSize: 13,
            fontWeight: 700,
            color: tokens.white,
            background: tokens.gray700,
            borderLeft: `1.5px solid ${tokens.gray200}`,
            userSelect: "none",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  </div>
);

/* ── Toggle switch ── */
const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
    <span
      onClick={() => onChange({ target: { checked: !checked } })}
      style={{
        position: "relative",
        display: "inline-block",
        width: 44,
        height: 24,
        borderRadius: 999,
        background: checked ? tokens.blue : tokens.gray200,
        transition: "background 0.2s",
        flexShrink: 0,
        cursor: "pointer",
        boxShadow: checked ? `0 0 0 3px ${tokens.blue}25` : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: tokens.white,
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}
      />
    </span>
    <span style={{ fontSize: 13, color: tokens.gray600, fontWeight: 500 }}>{label}</span>
  </label>
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
      <div style={{ maxWidth: 680 }}>
        <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />
        <div
          style={{
            marginTop: 24,
            padding: "24px 28px",
            background: "#FFFBEB",
            border: "1px solid #FCD34D",
            borderLeft: `4px solid ${tokens.amber}`,
            borderRadius: 12,
            display: "flex",
            gap: 16,
          }}
        >
          <WarningIcon style={{ width: 22, height: 22, color: tokens.amber, flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#92400E" }}>Feature Not Enabled</p>
            <p style={{ margin: "6px 0 16px", fontSize: 13, color: "#B45309", lineHeight: 1.6 }}>
              The Stock Threshold feature is currently disabled. Please enable{" "}
              <strong>"Stock Threshold for WooCommerce"</strong> from the Features page first.
            </p>
            <button
              onClick={() => (window.location.hash = "")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                background: tokens.blue,
                color: tokens.white,
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
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
    <div style={{ maxWidth: 760, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <CommonHeader title="StockAdaptix – Inventory-Based Dynamic Pricing" />

      {/* Page title row */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "24px 0 20px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: tokens.gray800, letterSpacing: "-0.02em" }}>
            StockAdaptix Pricing Rules
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: tokens.gray500 }}>
            Configure how inventory levels automatically adjust product pricing.
          </p>
        </div>
        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: formData.enable_dynamic_pricing ? tokens.green : tokens.gray400,
              boxShadow: formData.enable_dynamic_pricing ? `0 0 0 3px ${tokens.green}30` : "none",
              transition: "all 0.3s",
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: formData.enable_dynamic_pricing ? tokens.green : tokens.gray400 }}>
            {formData.enable_dynamic_pricing ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Save toast */}
      {saveStatus && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            marginBottom: 16,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            background: saveStatus === "success" ? "#ECFDF5" : "#FEF2F2",
            color:      saveStatus === "success" ? tokens.green : tokens.red,
            border:     `1px solid ${saveStatus === "success" ? "#A7F3D0" : "#FECACA"}`,
          }}
        >
          <span>{saveStatus === "success" ? "✓" : "✕"}</span>
          {saveStatus === "success" ? "Settings saved successfully." : "Error saving settings. Please try again."}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* ── Master enable card ── */}
        <div
          style={{
            background: tokens.white,
            border: `1.5px solid ${formData.enable_dynamic_pricing ? tokens.blue + "50" : tokens.gray200}`,
            borderRadius: 12,
            marginBottom: 16,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "border-color 0.2s",
          }}
        >
          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tokens.gray800 }}>Enable StockAdaptix</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: tokens.gray500 }}>
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
          style={{
            background: tokens.white,
            border: `1.5px solid ${tokens.gray200}`,
            borderRadius: 12,
            marginBottom: 16,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            opacity: formData.enable_dynamic_pricing ? 1 : 0.55,
            pointerEvents: formData.enable_dynamic_pricing ? "all" : "none",
            transition: "opacity 0.2s",
          }}
        >
          {/* Low Stock */}
          <SectionHeader icon="🔴" title="Low Stock Rules" color={tokens.red} description="Increase price when inventory is scarce" />
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
          <SectionHeader icon="🟡" title="Medium Stock Rules" color={tokens.amber} description="Slight increase for moderate inventory levels" />
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
          <SectionHeader icon="🟢" title="High Stock Rules" color={tokens.green} description="Decrease price to move excess inventory faster" />
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
        <div
          style={{
            background: tokens.white,
            border: `1.5px solid ${tokens.gray200}`,
            borderRadius: 12,
            marginBottom: 20,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              padding: "14px 24px",
              background: tokens.gray50,
              borderBottom: `1px solid ${tokens.gray100}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tokens.gray800 }}>💬 Customer Message</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: tokens.gray500 }}>
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
            style={{
              padding: "16px 24px",
              opacity: formData.enable_message ? 1 : 0.45,
              pointerEvents: formData.enable_message ? "all" : "none",
              transition: "opacity 0.2s",
            }}
          >
            <label style={{ fontSize: 12, fontWeight: 600, color: tokens.gray600, display: "block", marginBottom: 8, letterSpacing: "0.03em", textTransform: "uppercase" }}>
              Message Text
            </label>
            <textarea
              value={formData.customer_message}
              onChange={(e) => handleChange("customer_message", e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: 13,
                color: tokens.gray800,
                background: tokens.gray50,
                border: `1.5px solid ${tokens.gray200}`,
                borderRadius: 8,
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = tokens.blue)}
              onBlur={(e) => (e.target.style.borderColor = tokens.gray200)}
            />
            <p style={{ margin: "6px 0 0", fontSize: 11, color: tokens.gray400 }}>
              Shown to customers when dynamic pricing is applied on product pages.
            </p>
          </div>
        </div>

        {/* ── Save button ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              background: isSaving ? tokens.gray400 : tokens.blue,
              color: tokens.white,
              border: "none",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 700,
              cursor: isSaving ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
              boxShadow: isSaving ? "none" : `0 2px 8px ${tokens.blue}40`,
              transition: "all 0.2s",
            }}
          >
            {isSaving ? (
              <>
                <svg style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <span style={{ fontSize: 12, color: tokens.gray400 }}>Changes are applied immediately after saving.</span>
        </div>
      </form>

      {/* ── How It Works ── */}
      <div
        style={{
          marginTop: 24,
          background: tokens.white,
          border: `1.5px solid ${tokens.gray200}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          maxWidth: 520,
        }}
      >
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: tokens.gray700,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📖</span> How It Works
          </span>
          <svg
            style={{ width: 16, height: 16, color: tokens.gray400, transform: showHowItWorks ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {showHowItWorks && (
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🔴", text: "Stock ≤ Low Threshold → price increases by Low %", color: tokens.red },
                { icon: "🟡", text: "Stock ≤ Medium Threshold → price increases by Medium %", color: tokens.amber },
                { icon: "🟢", text: "Stock ≥ High Threshold → price decreases by High %", color: tokens.green },
                { icon: "⚪", text: "Otherwise → normal base price applies", color: tokens.gray500 },
              ].map(({ icon, text, color }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 8,
                    background: color + "0C",
                    border: `1px solid ${color}20`,
                    fontSize: 12,
                    color: tokens.gray700,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StockThreshold;