import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 환경 변수를 함수 내에서 직접 가져와서 사용

export async function POST(request: NextRequest) {
  try {
    console.log('=== Backup API POST called ===')
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
    
    // 현재 날짜
    const now = new Date()
    const backupDate = now.toISOString().split('T')[0] // YYYY-MM-DD 형식
    
    console.log('Creating backup for date:', backupDate)
    
    // 현재 데이터 조회 (테이블명 확인: tasks)
    const { data: currentData, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
    
    if (fetchError) {
      console.error('Error fetching current data:', fetchError)
      return NextResponse.json({ 
        error: 'Failed to fetch current data from tasks table', 
        details: fetchError.message,
        suggestion: 'Please ensure the tasks table exists in your Supabase database'
      }, { status: 500 })
    }
    
    if (!currentData || currentData.length === 0) {
      return NextResponse.json({ 
        message: 'No data to backup from tasks table',
        backupDate,
        recordsCount: 0,
        timestamp: now.toISOString()
      })
    }

    // 백업 메타데이터 테이블 확인
    const { data: metaTableCheck, error: metaCheckError } = await supabase
      .from('mvno_backup_history')
      .select('id')
      .limit(1)
    
    if (metaCheckError && (metaCheckError.code === 'PGRST116' || metaCheckError.code === '42P01')) {
      // 백업 히스토리 테이블이 존재하지 않음
      return NextResponse.json({
        error: 'Backup history table does not exist',
        details: 'Please create the mvno_backup_history table first',
        backupDate,
        recordsCount: currentData.length,
        rawData: currentData, // 임시로 데이터 반환
        suggestion: 'Use the "테이블 설정하기" button to create the backup history table'
      }, { status: 400 })
    }
    
    // 기존 백업이 있는지 확인하고 삭제 (최신 백업 하나만 유지)
    const { data: existingBackups } = await supabase
      .from('mvno_backup_history')
      .select('*')
    
    if (existingBackups && existingBackups.length > 0) {
      // 모든 기존 백업 삭제
      const { error: deleteError } = await supabase
        .from('mvno_backup_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 레코드 삭제
      
      if (deleteError) {
        console.warn('Warning: Failed to delete existing backups:', deleteError)
      } else {
        console.log('Deleted existing backups, maintaining only the latest one')
      }
    }
    
    // 새로운 백업 이력 기록 (최신 백업으로 교체)
    const backupMetadata = {
      backup_table_name: `tasks_backup`,
      backup_date: backupDate,
      backup_timestamp: now.toISOString(),
      records_count: currentData.length,
      status: 'completed',
      backup_data: JSON.stringify(currentData) // 실제 데이터도 JSON으로 저장
    }
    
    // 새로운 백업 이력에 기록
    const { error: metaError } = await supabase
      .from('mvno_backup_history')
      .insert(backupMetadata)
    
    if (metaError) {
      console.error('Failed to record backup metadata:', metaError)
      
      return NextResponse.json({
        error: 'Failed to save backup metadata',
        details: metaError.message,
        backupDate,
        recordsCount: currentData.length,
        timestamp: now.toISOString(),
        suggestion: 'Check backup history table structure and permissions'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Latest backup completed successfully',
      backupTableName: backupMetadata.backup_table_name,
      backupDate,
      recordsCount: currentData.length,
      timestamp: now.toISOString()
    })
    
  } catch (error) {
    console.error('Backup process failed:', error)
    return NextResponse.json({ 
      error: 'Backup process failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('=== Backup API GET called ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    
    // 환경 변수 가져오기
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Service Role Key가 없으면 Anon Key 사용 (제한된 권한)
    const effectiveKey = supabaseServiceKey || supabaseAnonKey
    
    console.log('GET Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      hasEffectiveKey: !!effectiveKey,
      usingServiceRole: !!supabaseServiceKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: effectiveKey?.length || 0
    })
    
    // 환경 변수 확인
    if (!supabaseUrl || !effectiveKey) {
      console.error('GET: Missing environment variables:', {
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey,
        EFFECTIVE_KEY: !!effectiveKey
      })
      
      const missingVars = []
      if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!effectiveKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      return NextResponse.json({ 
        backupHistory: [],
        error: 'Supabase configuration missing',
        details: `Missing environment variables: ${missingVars.join(', ')}`,
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, effectiveKey)
    
    // 최신 백업 하나만 조회
    const { data: latestBackup, error } = await supabase
      .from('mvno_backup_history')
      .select('*')
      .order('backup_timestamp', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      console.error('Error fetching latest backup:', error)
      return NextResponse.json({ 
        backupHistory: [],
        error: 'Failed to fetch backup history (table may not exist yet)' 
      })
    }
    
    // 단일 백업을 배열로 감싸서 반환 (기존 UI 호환성 유지)
    return NextResponse.json({ 
      backupHistory: latestBackup ? [latestBackup] : [],
      latestBackup
    })
    
  } catch (error) {
    console.error('Error in backup API:', error)
    return NextResponse.json({ 
      backupHistory: [],
      error: 'Failed to fetch backup history', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
