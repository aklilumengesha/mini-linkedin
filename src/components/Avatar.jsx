import Image from 'next/image';

export default function Avatar({ src, alt = 'User avatar', size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0 ${textSizes[size]} ${className}`}>
      {getInitials(alt)}
    </div>
  );
}
