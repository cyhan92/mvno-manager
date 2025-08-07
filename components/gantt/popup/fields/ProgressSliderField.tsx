import React from 'react'

interface ProgressSliderFieldProps {
  label: string
  value: number
  onChange: (value: number, status: string) => void
  disabled?: boolean
  showStatus?: boolean
  className?: string
}

const ProgressSliderField: React.FC<ProgressSliderFieldProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  showStatus = true,
  className = ''
}) => {
  const handleChange = (newValue: number) => {
    let status = '미완료'
    if (newValue === 100) {
      status = '완료'
    } else if (newValue > 0) {
      status = '진행중'
    }
    onChange(newValue, status)
  }

  const getStatus = (progress: number) => {
    if (progress === 100) return '완료'
    if (progress > 0) return '진행중'
    return '미완료'
  }

  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-600">
        {label}: {value}%
        {showStatus && ` (${getStatus(value)})`}
      </label>
      <div className="mt-2">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full"
          disabled={disabled}
          title={`진행률: ${value}%`}
          aria-label={`${label} 진행률`}
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0%</span>
          <span className="font-medium text-gray-800">
            {value}% ({getStatus(value)})
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressSliderField
