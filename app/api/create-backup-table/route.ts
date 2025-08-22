import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('=== Create backup table API called ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    
    // 환경 변수 다양한 방법으로 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Service Role Key가 없으면 Anon Key 사용 (제한된 권한)
    const effectiveKey = supabaseServiceKey || supabaseAnonKey
    
    // 모든 환경 변수 키 확인 (디버깅용)
    const allEnvKeys = Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || key.includes('NEXT_PUBLIC')
    )
    console.log('Available environment variable keys:', allEnvKeys)
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      hasEffectiveKey: !!effectiveKey,
      usingServiceRole: !!supabaseServiceKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: effectiveKey?.length || 0,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
      keyStart: effectiveKey ? `${effectiveKey.substring(0, 20)}...` : 'MISSING'
    })
    
    // 환경 변수 확인
    if (!supabaseUrl || !effectiveKey) {
      console.error('=== ENVIRONMENT VARIABLES MISSING ===')
      console.error('Missing environment variables:', {
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey,
        EFFECTIVE_KEY: !!effectiveKey
      })
      
      const missingVars = []
      if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!effectiveKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      console.error('Please check Vercel environment variables configuration')
      console.error('Missing variables:', missingVars)
      
      return NextResponse.json({ 
        error: 'Supabase configuration missing',
        details: `Missing environment variables: ${missingVars.join(', ')}`,
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        troubleshooting: {
          message: 'Environment variables not found',
          missingVariables: missingVars,
          instructions: [
            '1. Check Vercel Dashboard > Project Settings > Environment Variables',
            '2. Ensure NEXT_PUBLIC_SUPABASE_URL is set',
            '3. Add SUPABASE_SERVICE_ROLE_KEY for full admin access',
            '4. NEXT_PUBLIC_SUPABASE_ANON_KEY is available as fallback',
            '5. Redeploy after adding variables'
          ]
        }
      }, { status: 500 })
    }
    
    console.log('Creating Supabase client...')
    const supabase = createClient(supabaseUrl, effectiveKey)
    console.log('Supabase client created successfully with', supabaseServiceKey ? 'Service Role' : 'Anon Key')
    
    // 환경 변수 확인
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Supabase configuration missing',
        details: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found'
      }, { status: 500 })
    }
    
    // 먼저 테이블 존재 여부 확인 (select 쿼리로 테스트)
    const { data, error: selectError } = await supabase
      .from('mvno_backup_history')
      .select('id')
      .limit(1)
    
    if (selectError) {
      // 테이블이 존재하지 않거나 접근 권한이 없음
      if (selectError.code === 'PGRST116' || selectError.message.includes('does not exist')) {
        return NextResponse.json({
          tableExists: false,
          message: 'Please create the backup history table manually in Supabase',
          sql: `CREATE TABLE mvno_backup_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_table_name TEXT NOT NULL,
  backup_date DATE NOT NULL,
  backup_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  records_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  backup_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정 (선택사항)
ALTER TABLE mvno_backup_history ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 설정 (보안 요구사항에 따라 조정)
CREATE POLICY "Enable all access for mvno_backup_history" ON mvno_backup_history
FOR ALL USING (true);`
        })
      }
      
      return NextResponse.json({ 
        error: 'Database connection error',
        details: selectError.message
      }, { status: 500 })
    }
    
    // 테이블이 존재함 - 테스트용 데이터 삽입/삭제로 권한 확인
    const testData = {
      backup_table_name: 'test_table',
      backup_date: '2025-01-01',
      backup_timestamp: new Date().toISOString(),
      records_count: 0,
      status: 'test',
      backup_data: JSON.stringify([])
    }
    
    const { error: insertError } = await supabase
      .from('mvno_backup_history')
      .insert(testData)
    
    if (insertError) {
      return NextResponse.json({ 
        error: 'Insert permission error',
        details: insertError.message,
        suggestion: 'Check RLS policies and table permissions'
      }, { status: 500 })
    }
    
    // 테스트 데이터 삭제
    await supabase
      .from('mvno_backup_history')
      .delete()
      .eq('status', 'test')
    
    return NextResponse.json({ 
      tableExists: true,
      message: 'Backup history table exists and is ready',
      status: 'success'
    })
    
  } catch (error) {
    console.error('Error in create-backup-table API:', error)
    return NextResponse.json({ 
      error: 'Failed to test backup table', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
