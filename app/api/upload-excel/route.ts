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

    if (excelData.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Excel 파일에 데이터가 없거나 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    console.log('Excel data rows:', excelData.length)

    // 헤더 행과 데이터 행 분리
    const headers = excelData[0] as string[]
    const dataRows = excelData.slice(1)

    console.log('Headers:', headers)

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

          return {
            task_id: `TASK-${String(index + 1).padStart(3, '0')}`,
            title: String(row[0] || '').trim(),
            detail: String(row[1] || '').trim(),
            category: String(row[2] || '').trim(),
            department: String(row[3] || '').trim(),
            assignee: String(row[4] || '').trim(),
            start_date: parseDate(row[5]),
            end_date: parseDate(row[6]),
            progress: Math.round(parsePercent(row[7])),
            status: String(row[8] || '').trim() || '미완료',
            notes: String(row[9] || '').trim()
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
