import React from 'react'

interface DisplayFieldProps {
  label: string
  value: string | number | React.ReactNode
  className?: string
  valueClassName?: string
}

const DisplayField: React.FC<DisplayFieldProps> = ({
  label,
  value,
  className = '',
  valueClassName = 'text-sm text-gray-900 mt-1'
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className={valueClassName}>
        {value || '정보 없음'}
      </div>
    </div>
  )
}

export default DisplayField
