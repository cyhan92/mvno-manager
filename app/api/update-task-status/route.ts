import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 생성 함수 (런타임에 환경변수 체크)
function getSupabaseClient() {
  console.log('=== Update Task Status API - Environment Check ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Service Role Key가 없으면 Anon Key 사용 (제한된 권한)
  const effectiveKey = serviceKey || anonKey
  
  console.log('Environment variables check:', {
    hasUrl: !!url,
    hasServiceKey: !!serviceKey,
    hasAnonKey: !!anonKey,
    hasEffectiveKey: !!effectiveKey,
    usingServiceRole: !!serviceKey
  })
  
  if (!url || !effectiveKey) {
    const missingVars = []
    if (!url) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!effectiveKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    throw new Error(`Supabase environment variables are not configured: ${missingVars.join(', ')}`)
  }
  
  console.log('Creating Supabase client with', serviceKey ? 'Service Role Key' : 'Anon Key')
  return createClient(url, effectiveKey)
}

/**
 * 완료율에 따른 상태값 결정
 */
const getStatusByProgress = (percentComplete: number): string => {
  if (percentComplete >= 100) return '완료'
  if (percentComplete > 0) return '진행중'
  return '미완료'  // DB 제약조건에 맞게 '미완료' 사용
}

/**
 * DB의 모든 작업 상태를 완료율에 따라 일괄 업데이트
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 작업 상태 일괄 업데이트 시작...')

    const supabase = getSupabaseClient()

    // 1. 모든 작업 조회
    const { data: tasks, error: fetchError } = await supabase
      .from('tasks')
      .select('id, progress, status')

    if (fetchError) {
      console.error('❌ 작업 조회 실패:', fetchError)
      return NextResponse.json({
        success: false,
        message: '작업 조회 중 오류가 발생했습니다.',
        error: fetchError.message
      }, { status: 500 })
    }

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: '업데이트할 작업이 없습니다.',
        data: { updatedCount: 0, totalCount: 0 }
      })
    }

    console.log(`📊 총 ${tasks.length}개 작업 조회 완료`)

    // 2. 완료율에 따른 새로운 상태 계산 및 업데이트 대상 필터링
    const updates = []
    const statusChanges = {
      completed: 0,      // 완료로 변경
      inProgress: 0,     // 진행중으로 변경  
      notStarted: 0,     // 미완료로 변경
      unchanged: 0       // 변경 없음
    }

    for (const task of tasks) {
      const currentStatus = task.status || '미완료'
      const percentComplete = task.progress || 0
      const newStatus = getStatusByProgress(percentComplete)

      if (currentStatus !== newStatus) {
        updates.push({
          id: task.id,
          newStatus,
          currentStatus,
          percentComplete
        })

        // 통계 업데이트
        if (newStatus === '완료') statusChanges.completed++
        else if (newStatus === '진행중') statusChanges.inProgress++
        else if (newStatus === '미완료') statusChanges.notStarted++
      } else {
        statusChanges.unchanged++
      }
    }

    console.log(`📈 업데이트 대상: ${updates.length}개`)
    console.log('📊 상태 변경 통계:', statusChanges)

    // 3. 일괄 업데이트 실행
    let updatedCount = 0
    const errors = []

    if (updates.length > 0) {
      // 각 작업을 개별적으로 업데이트 (안전한 방법)
      for (const update of updates) {
        try {
          const { error: updateError } = await supabase
            .from('tasks')
            .update({ status: update.newStatus })
            .eq('id', update.id)

          if (updateError) {
            console.error(`❌ 작업 ${update.id} 업데이트 실패:`, updateError)
            errors.push(`작업 ${update.id}: ${updateError.message}`)
          } else {
            updatedCount++
            if (updatedCount % 50 === 0) {
              console.log(`✅ ${updatedCount}개 작업 업데이트 완료...`)
            }
          }
        } catch (error) {
          console.error(`❌ 작업 ${update.id} 처리 중 예외:`, error)
          errors.push(`작업 ${update.id}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
        }
      }
    }

    // 4. 결과 반환
    const result = {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `${updatedCount}개 작업의 상태가 성공적으로 업데이트되었습니다.`
        : `${updatedCount}개 작업 업데이트 완료, ${errors.length}개 배치에서 오류 발생`,
      data: {
        totalTasks: tasks.length,
        updatedCount,
        unchangedCount: statusChanges.unchanged,
        statusChanges,
        errors: errors.length > 0 ? errors : undefined
      }
    }

    console.log('🎉 작업 상태 일괄 업데이트 완료:', result)

    return NextResponse.json(result, { 
      status: errors.length === 0 ? 200 : 207 // 207: Multi-Status (부분 성공)
    })

  } catch (error) {
    console.error('❌ 작업 상태 일괄 업데이트 실패:', error)
    
    return NextResponse.json({
      success: false,
      message: '작업 상태 일괄 업데이트 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}

/**
 * 현재 작업 상태 통계 조회
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 작업 상태 통계 조회 시작...')
    
    const supabase = getSupabaseClient()
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('progress, status')

    if (error) {
      console.error('❌ Supabase 조회 오류:', error)
      return NextResponse.json({
        success: false,
        message: '작업 조회 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code
      }, { status: 500 })
    }

    console.log(`📊 조회된 작업 수: ${tasks?.length || 0}`)

    // 현재 상태 통계
    const currentStats = {
      completed: tasks?.filter(t => t.status === '완료').length || 0,
      inProgress: tasks?.filter(t => t.status === '진행중').length || 0,
      notStarted: tasks?.filter(t => t.status === '미완료').length || 0,
      total: tasks?.length || 0
    }

    console.log('📈 현재 상태 통계:', currentStats)

    // 완료율 기준 예상 상태 통계
    const expectedStats = {
      completed: tasks?.filter(t => (t.progress || 0) >= 100).length || 0,
      inProgress: tasks?.filter(t => (t.progress || 0) > 0 && (t.progress || 0) < 100).length || 0,
      notStarted: tasks?.filter(t => (t.progress || 0) === 0).length || 0,
      total: tasks?.length || 0
    }

    // 불일치 작업 수
    const mismatchCount = tasks?.filter(task => {
      const currentStatus = task.status || '미완료'
      const expectedStatus = getStatusByProgress(task.progress || 0)
      return currentStatus !== expectedStatus
    }).length || 0

    return NextResponse.json({
      success: true,
      data: {
        currentStats,
        expectedStats,
        mismatchCount,
        needsUpdate: mismatchCount > 0
      }
    })

  } catch (error) {
    console.error('❌ 작업 상태 통계 조회 실패:', error)
    
    return NextResponse.json({
      success: false,
      message: '작업 상태 통계 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
