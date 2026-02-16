'use client';

import { useRef } from 'react';
import Button from './Button';

export default function FileUpload({ 
  label, 
  accept, 
  multiple = false, 
  onChange, 
  error,
  className = '' 
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    onChange?.(multiple ? files : files[0]);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <Button type="button" onClick={handleClick} variant="outline">
        Choose File{multiple ? 's' : ''}
      </Button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
