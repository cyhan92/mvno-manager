import { NextResponse } from 'next/server'
import { loadTasksFromExcel } from '../../../lib/excel/loader'
import { syncTasksFromExcel } from '../../../lib/database'

/**
 * Excel 파일을 읽어서 데이터베이스에 동기화
 */
export async function POST() {
  try {
    console.log('🔄 Excel → Database 동기화 시작...')
    
    // Excel 파일에서 작업 데이터 읽기
    const excelResult = await loadTasksFromExcel()
    
    if (excelResult.errors.length > 0) {
      console.warn('⚠️ Excel 파싱 경고:', excelResult.errors)
    }
    
    if (excelResult.tasks.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Excel 파일에서 유효한 작업을 찾을 수 없습니다.',
        errors: excelResult.errors
      }, { status: 400 })
    }
    
    // 데이터베이스에 동기화
    const syncedTasks = await syncTasksFromExcel(excelResult.tasks)
    
    console.log(`✅ ${syncedTasks.length}개 작업이 데이터베이스에 동기화되었습니다.`)
    
    return NextResponse.json({
      success: true,
      message: `${syncedTasks.length}개 작업이 성공적으로 동기화되었습니다.`,
      data: {
        totalExcelTasks: excelResult.totalRows,
        filteredTasks: excelResult.filteredRows,
        syncedTasks: syncedTasks.length,
        errors: excelResult.errors
      }
    })
    
  } catch (error) {
    console.error('❌ Excel 동기화 실패:', error)
    
    let errorMessage = '동기화 중 오류가 발생했습니다.'
    let errorDetails = error instanceof Error ? error.message : '알 수 없는 오류'
    let statusCode = 500
    
    // Supabase 테이블 관련 오류 처리
    if (errorDetails.includes('Could not find') && errorDetails.includes('in the schema cache')) {
      errorMessage = '데이터베이스 테이블이 생성되지 않았습니다.'
      errorDetails = 'Supabase에서 tasks 테이블을 생성해주세요.'
      statusCode = 400
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: errorDetails,
      troubleshooting: {
        step1: '1. Supabase Dashboard (https://supabase.com/dashboard)에 로그인',
        step2: '2. 프로젝트 선택 → SQL Editor로 이동',
        step3: '3. SUPABASE_SETUP.sql 파일 내용을 복사하여 실행',
        step4: '4. 또는 GET /api/create-table에서 안내 확인',
        sqlFile: 'SUPABASE_SETUP.sql'
      }
    }, { status: statusCode })
  }
}

/**
 * 현재 동기화 상태 조회
 */
export async function GET() {
  try {
    // Excel 파일 정보
    const excelResult = await loadTasksFromExcel()
    
    // Database 작업 개수 조회 (간접적으로)
    // getAllTasks를 사용하면 순환 참조가 될 수 있으므로 직접 supabase 쿼리
    const { supabase } = await import('../../../lib/supabase')
    const { count: dbTaskCount, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      throw new Error(`데이터베이스 조회 실패: ${error.message}`)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        excel: {
          totalRows: excelResult.totalRows,
          validTasks: excelResult.tasks.length,
          errors: excelResult.errors
        },
        database: {
          totalTasks: dbTaskCount || 0
        },
        inSync: (excelResult.tasks.length === (dbTaskCount || 0)) && excelResult.errors.length === 0
      }
    })
    
  } catch (error) {
    console.error('❌ 동기화 상태 조회 실패:', error)
    
    return NextResponse.json({
      success: false,
      message: '동기화 상태 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
