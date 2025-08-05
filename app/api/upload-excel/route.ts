import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import { parseExcelData } from '../../../lib/excel/parser'
import { transformExcelToDatabase } from '../../../lib/database/tasks'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration missing')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    console.log('Excel upload request received')

    // FormData에서 파일 추출
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Excel 파일이 제공되지 않았습니다.' },
        { status: 400 }
      )
    }

    console.log('Processing file:', file.name, 'Size:', file.size)

    // 파일 확장자 검증
    const allowedExtensions = ['.xlsx', '.xls']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, message: 'Excel 파일(.xlsx, .xls)만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    // 파일 내용을 Buffer로 읽기
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('Reading Excel file...')

    // Excel 파일 파싱
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0] // 첫 번째 시트 사용
    const worksheet = workbook.Sheets[sheetName]

    // JSON으로 변환
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    // Excel 구조: 1-4행(제목/설명), 5행(컬럼 헤더), 6행부터 실제 데이터
    if (excelData.length < 6) { // 최소 6행 필요 (1-5행 헤더/제목 + 데이터 1행)
      return NextResponse.json(
        { success: false, message: 'Excel 파일에 데이터가 없거나 형식이 올바르지 않습니다. 5행은 헤더, 6행부터 데이터가 시작되어야 합니다.' },
        { status: 400 }
      )
    }

    console.log('Total Excel rows:', excelData.length)

    // 5행 헤더 확인 (디버깅용)
    if (excelData.length >= 5) {
      console.log('Row 5 (Header):', excelData[4]) // 5행은 인덱스 4
    }

    // 실제 데이터 행 추출 (6행부터 시작, 배열 인덱스 5부터)
    const dataRows = excelData.slice(5) // 6행부터 데이터 시작 (0-based index에서 5)

    console.log('Data rows from row 6:', dataRows.length)
    if (dataRows.length > 0) {
      console.log('First data row:', dataRows[0]) // 첫 번째 데이터 행 확인
    }

    // 데이터 변환 및 검증
    const tasks = dataRows
      .filter(row => row && row.length > 0 && row[0]) // 빈 행 제외
      .map((row, index) => {
        try {
          // 날짜 파싱 함수
          const parseDate = (dateValue: any): string | null => {
            if (!dateValue) return null
            
            if (typeof dateValue === 'number') {
              // Excel 날짜 시리얼 번호
              const date = XLSX.SSF.parse_date_code(dateValue)
              return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
            }
            
            if (typeof dateValue === 'string') {
              // 문자열 날짜 파싱
              const parsed = new Date(dateValue)
              if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0]
              }
            }
            
            return null
          }

          // 퍼센트 파싱 함수
          const parsePercent = (value: any): number => {
            if (typeof value === 'number') {
              return value > 1 ? value : value * 100 // 0.5 -> 50, 50 -> 50
            }
            if (typeof value === 'string') {
              const num = parseFloat(value.replace('%', ''))
              return isNaN(num) ? 0 : num
            }
            return 0
          }

          // 상태 값 정규화 함수
          const normalizeStatus = (status: any): '완료' | '진행중' | '미완료' => {
            if (!status) return '미완료'
            
            const statusStr = String(status).trim().toLowerCase()
            
            if (statusStr.includes('완료') || statusStr === 'completed' || statusStr === 'done') {
              return '완료'
            }
            if (statusStr.includes('진행') || statusStr === 'in progress' || statusStr === 'ongoing') {
              return '진행중'
            }
            
            return '미완료'
          }

          const progress = Math.round(parsePercent(row[14])) // O열 (완료율)
          const status = progress >= 100 ? '완료' : normalizeStatus(row[8]) // I열 (완료여부)

          return {
            task_id: `TASK-${String(index + 1).padStart(3, '0')}`,
            title: String(row[7] || '').trim(), // H열 (세부업무)
            category: String(row[0] || '').trim(), // A열 (대분류)
            subcategory: String(row[1] || '').trim(), // B열 (중분류)
            detail: String(row[2] || '').trim(), // C열 (소분류)
            department: String(row[3] || row[4] || '').trim(), // D열 (주관부서 정) 또는 E열 (주관부서 부)
            assignee: String(row[5] || row[6] || '').trim(), // F열 (담당자 정) 또는 G열 (담당자 부)
            start_date: parseDate(row[11]), // L열 (시작일)
            end_date: parseDate(row[12]), // M열 (종료일)
            duration: row[13] ? Number(row[13]) : null, // N열 (기간)
            progress: progress,
            status: status,
            cost: String(row[9] || '').trim(), // J열 (추정 소요 비용)
            notes: String(row[10] || '').trim(), // K열 (비고)
            major_category: String(row[0] || '').trim(), // A열 (대분류)
            middle_category: String(row[1] || '').trim(), // B열 (중분류)
            minor_category: String(row[2] || '').trim() // C열 (소분류)
          }
        } catch (error) {
          console.error(`Error processing row ${index + 1}:`, error)
          return null
        }
      })
      .filter(task => task !== null) // null 값 제거

    console.log('Processed tasks:', tasks.length)

    if (tasks.length === 0) {
      return NextResponse.json(
        { success: false, message: '처리 가능한 데이터가 없습니다.' },
        { status: 400 }
      )
    }

    // 기존 데이터 삭제
    console.log('Deleting existing data...')
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .not('id', 'is', null) // 모든 레코드 삭제 (id가 null이 아닌 모든 레코드)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { success: false, message: `기존 데이터 삭제 실패: ${deleteError.message}` },
        { status: 500 }
      )
    }

    // 새 데이터 삽입
    console.log('Inserting new data...')
    const { data: insertedData, error: insertError } = await supabase
      .from('tasks')
      .insert(tasks)
      .select('*')

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { success: false, message: `데이터 삽입 실패: ${insertError.message}` },
        { status: 500 }
      )
    }

    console.log('Upload completed successfully. Total records:', insertedData?.length || 0)

    return NextResponse.json({
      success: true,
      message: 'Excel 파일이 성공적으로 업로드되고 데이터베이스가 업데이트되었습니다.',
      data: {
        totalRecords: insertedData?.length || 0,
        fileName: file.name,
        processedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Excel upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: `업로드 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}
