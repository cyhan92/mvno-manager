import React from 'react'
import TextInputField from './TextInputField'

interface CategoryFieldsProps {
  majorCategory: string
  middleCategory: string
  minorCategory: string
  onMajorChange: (value: string) => void
  onMiddleChange: (value: string) => void
  onMinorChange: (value: string) => void
}

const CategoryFields: React.FC<CategoryFieldsProps> = ({
  majorCategory,
  middleCategory,
  minorCategory,
  onMajorChange,
  onMiddleChange,
  onMinorChange
}) => {
  return (
    <>
      {/* 대분류 */}
      <TextInputField
        label="대분류"
        value={majorCategory}
        onChange={onMajorChange}
        placeholder="대분류를 입력하세요"
        required
      />

      {/* 중분류 */}
      <TextInputField
        label="중분류"
        value={middleCategory}
        onChange={onMiddleChange}
        placeholder="중분류를 입력하세요"
      />

      {/* 소분류 */}
      <TextInputField
        label="소분류"
        value={minorCategory}
        onChange={onMinorChange}
        placeholder="소분류를 입력하세요"
        required
      />
    </>
  )
}

export default CategoryFields
