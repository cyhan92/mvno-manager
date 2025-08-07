import React from 'react'
import TextInputField from './TextInputField'

interface ResourceFieldsProps {
  resource: string
  department: string
  onResourceChange: (value: string) => void
  onDepartmentChange: (value: string) => void
}

const ResourceFields: React.FC<ResourceFieldsProps> = ({
  resource,
  department,
  onResourceChange,
  onDepartmentChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TextInputField
        label="담당자"
        value={resource}
        onChange={onResourceChange}
        placeholder="담당자명"
      />
      
      <TextInputField
        label="부서"
        value={department}
        onChange={onDepartmentChange}
        placeholder="부서명"
      />
    </div>
  )
}

export default ResourceFields
