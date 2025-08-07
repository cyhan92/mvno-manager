import React from 'react'
import DateInputField from './DateInputField'

interface DateRangeFieldsProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

const DateRangeFields: React.FC<DateRangeFieldsProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DateInputField
        label="시작일"
        value={startDate}
        onChange={onStartDateChange}
        required
      />
      
      <DateInputField
        label="종료일"
        value={endDate}
        onChange={onEndDateChange}
        required
      />
    </div>
  )
}

export default DateRangeFields
