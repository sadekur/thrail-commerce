const SectionHeader = ({ icon, title, color, description }) => {
  const bgMap = {
    red: "bg-red-500/5 border-b-red-500/20",
    amber: "bg-amber-500/5 border-b-amber-500/20",
    green: "bg-green-500/5 border-b-green-500/20",
    blue: "bg-blue-500/5 border-b-blue-500/20",
  };
  const bgClass = bgMap[color] || bgMap.blue;

  return (
    <div className={`flex items-start gap-3 px-6 py-4 ${bgClass}`}>
      <span className="text-xl leading-none">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-800 tracking-wide">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      <Pill color={color} label={title.split(" ")[0]} />
    </div>
  );
};

export default SectionHeader;