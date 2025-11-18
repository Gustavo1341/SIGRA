import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from './icons';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onClear,
  autoFocus = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-3 px-4 py-2.5 bg-white border rounded-xl transition-all duration-200 ${
          isFocused
            ? 'border-brand-blue-500 ring-4 ring-brand-blue-50 shadow-sm'
            : 'border-brand-gray-200 hover:border-brand-gray-300'
        }`}
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-brand-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 outline-none text-sm text-brand-gray-900 placeholder-brand-gray-400 bg-transparent"
        />
        {value && (
          <button
            onClick={handleClear}
            className="text-brand-gray-400 hover:text-brand-gray-600 transition-colors flex-shrink-0"
            aria-label="Limpar busca"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-brand-gray-500 bg-brand-gray-50 border border-brand-gray-200 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
};

export default SearchBar;
