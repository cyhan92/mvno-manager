import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST() {
  try {
    console.log('🔨 데이터베이스 테이블 생성 시도...')
    
    // 테이블 생성 SQL
    const createTableSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create tasks table
      CREATE TABLE IF NOT EXISTS public.tasks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        task_id VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        subcategory VARCHAR(200),
        detail TEXT,
        department VARCHAR(200),
        assignee VARCHAR(200),
        start_date DATE,
        end_date DATE,
        duration INTEGER,
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        status VARCHAR(20) DEFAULT '미완료' CHECK (status IN ('완료', '진행중', '미완료')),
        cost VARCHAR(200),
        notes TEXT,
        major_category VARCHAR(200),
        middle_category VARCHAR(200),
        minor_category VARCHAR(200),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_tasks_task_id ON public.tasks(task_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee);
      CREATE INDEX IF NOT EXISTS idx_tasks_dates ON public.tasks(start_date, end_date);
    `
    
    // SQL 실행
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: createTableSQL 
    })
    
    if (error) {
      console.error('❌ 테이블 생성 실패:', error)
      
      // RPC가 없다면 직접 INSERT로 테이블 존재 여부 확인
      const { error: testError } = await supabase
        .from('tasks')
        .select('count', { count: 'exact', head: true })
      
      if (testError && testError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: '테이블이 존재하지 않습니다.',
          details: '수동으로 Supabase Dashboard에서 테이블을 생성해주세요.',
          sqlFile: 'SUPABASE_SETUP.sql 파일의 내용을 SQL Editor에서 실행하세요.',
          dashboardUrl: 'https://supabase.com/dashboard'
        }, { status: 400 })
      }
      
      return NextResponse.json({
        success: false,
        error: '테이블 생성 중 오류 발생',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    console.log('✅ 테이블 생성 성공')
    
    return NextResponse.json({
      success: true,
      message: '테이블이 성공적으로 생성되었습니다.',
      data: data
    })
    
  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error)
    return NextResponse.json({
      success: false,
      error: '예상치 못한 오류',
      details: error instanceof Error ? error.message : String(error),
      instruction: 'Supabase Dashboard에서 수동으로 테이블을 생성해주세요.'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'POST 요청으로 테이블 생성을 시도하세요.',
    sqlFile: 'SUPABASE_SETUP.sql',
    instruction: [
      '1. Supabase Dashboard (https://supabase.com/dashboard)에 로그인',
      '2. 프로젝트 선택',
      '3. SQL Editor로 이동',
      '4. SUPABASE_SETUP.sql 파일 내용 복사하여 실행',
      '5. 또는 POST /api/create-table로 자동 생성 시도'
    ]
  })
}
