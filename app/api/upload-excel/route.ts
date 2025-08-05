import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

export async function POST(request: Request) {
  console.log('=== EXCEL UPLOAD API STARTED ===')
  console.log('Timestamp:', new Date().toISOString())
  
  try {
    // Supabase 클라이언트 생성
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing')
      return NextResponse.json(
        { success: false, message: 'Supabase 설정이 누락되었습니다.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. 폼 데이터에서 파일 추출
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: '파일이 업로드되지 않았습니다.' },
        { status: 400 }
      )
    }

    console.log('File received:', file.name, file.size, 'bytes')

    // 2. 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // 3. XLSX로 워크북 파싱
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    if (!worksheet) {
      return NextResponse.json(
        { success: false, message: '워크시트를 찾을 수 없습니다.' },
        { status: 400 }
      )
    }

    console.log('Worksheet found:', sheetName)

    // 4. 시트를 JSON 배열로 변환 (header: 1은 배열 형태 반환)
    const excelData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '', // 빈 셀을 빈 문자열로 처리
      raw: false // 날짜/숫자를 문자열로 변환
    }) as any[][]

    console.log('Total Excel rows:', excelData.length)

    // 헤더와 데이터 행 확인 (디버깅용)
    if (excelData.length >= 6) {
      console.log('Row 4 (possible header):', excelData[3]) // 4행 확인
      console.log('Row 5 (possible data 1):', excelData[4]) // 5행 확인 
      console.log('Row 6 (possible data 2):', excelData[5]) // 6행 확인
    }

    // 실제 데이터 행 추출 (5행부터 시작할 수도 있음, 배열 인덱스 4부터)
    const dataRows = excelData.slice(4) // 5행부터 모든 데이터 포함 (0-based index에서 4)

    console.log('Data rows from row 5:', dataRows.length)
    if (dataRows.length > 0) {
      console.log('First data row (raw):', dataRows[0]) // 첫 번째 데이터 행 확인
      console.log('First data row B column (B1):', dataRows[0] ? dataRows[0][1] : 'undefined') // B1 데이터 명시적 확인
      console.log('First data row H column (세부업무):', dataRows[0] ? dataRows[0][7] : 'undefined') // H1 데이터 확인
      console.log('Second data row (raw):', dataRows[1]) // 두 번째 데이터 행 확인
      if (dataRows[1]) {
        console.log('Second data row B column (B2):', dataRows[1][1]) // B2 데이터 확인
        console.log('Second data row H column (세부업무):', dataRows[1][7]) // H2 데이터 확인
      }
    }

    // 데이터 변환 및 검증
    const tasks = dataRows
      .filter(row => {
        // 행이 존재하고 길이가 있으며, 주요 데이터 컬럼 중 하나라도 값이 있는 경우
        if (!row || row.length === 0) return false
        
        // 주요 컬럼들(대분류, 중분류, 소분류, 세부업무) 중 하나라도 값이 있으면 포함
        const hasMainData = row[0] || row[1] || row[2] || row[7] // A, B, C, H열
        
        if (hasMainData) {
          console.log('Processing row:', {
            originalIndex: dataRows.indexOf(row),
            A: row[0],
            B: row[1],
            C: row[2],
            H: row[7],
            I: row[8],
            O: row[14]
          })
        }
        
        return hasMainData
      })
      .map((row, index) => {
        try {
          // 날짜 파싱 함수
          const parseDate = (dateValue: any): string | null => {
            if (!dateValue) return null
            
            if (typeof dateValue === 'number') {
              try {
                // Excel 날짜 시리얼 번호
                const date = XLSX.SSF.parse_date_code(dateValue)
                return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
              } catch (e) {
                return null
              }
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
            category: String(row[0] || row[1] || '미분류').trim(), // A열 (대분류) 또는 B열 fallback
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
            major_category: String(row[0] || row[1] || '미분류').trim(), // A열 (대분류) 또는 B열 fallback
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
    
    // 처리된 작업 데이터 상세 로그
    tasks.forEach((task, index) => {
      console.log(`Task ${index + 1}:`, {
        task_id: task.task_id,
        title: task.title,
        category: task.category,
        subcategory: task.subcategory,
        detail: task.detail,
        major_category: task.major_category,
        middle_category: task.middle_category,
        minor_category: task.minor_category
      })
    })

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
    console.log('Tasks to insert:', tasks.map(t => ({ task_id: t.task_id, title: t.title, middle_category: t.middle_category })))
    
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
    
    // 삽입된 데이터 확인
    if (insertedData && insertedData.length > 0) {
      console.log('First inserted record:', {
        task_id: insertedData[0].task_id,
        title: insertedData[0].title,
        middle_category: insertedData[0].middle_category,
        major_category: insertedData[0].major_category
      })
    }

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
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: `업로드 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}
