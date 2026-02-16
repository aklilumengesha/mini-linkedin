export default function Divider({ text, className = '' }) {
  if (text) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-sm text-gray-500">{text}</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>
    );
  }

  return <div className={`border-t border-gray-300 ${className}`} />;
}
