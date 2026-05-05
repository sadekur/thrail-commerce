
/* ─────────────────────────────────────────────
   Input row component
───────────────────────────────────────────── */
const InputRow = ({ label, value, onChange, suffix, helper }) => (
  <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100">
    <div className="flex-none w-[220px]">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      {helper && <p className="mt-0.5 text-xs text-gray-400">{helper}</p>}
    </div>
    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-[90px] px-3 py-1.5 border-none outline-none text-sm font-semibold text-gray-800 bg-transparent font-mono"
      />
      {suffix && (
        <span className="px-3 py-1.5 text-sm font-bold text-white bg-gray-700 border-l border-gray-200 select-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default InputRow;