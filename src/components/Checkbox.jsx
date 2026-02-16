export default function Checkbox({ 
  label, 
  name, 
  checked, 
  onChange, 
  error,
  className = '' 
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
