import React from 'react'

interface TextInputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        placeholder={placeholder}
        disabled={disabled}
        title={placeholder}
      />
    </div>
  )
}

export default TextInputField
