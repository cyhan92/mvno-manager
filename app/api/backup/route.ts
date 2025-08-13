import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // 현재 날짜
    const now = new Date()
    const backupDate = now.toISOString().split('T')[0] // YYYY-MM-DD 형식
    
    console.log('Creating backup for date:', backupDate)
    
    // 현재 데이터 조회
    const { data: currentData, error: fetchError } = await supabase
      .from('mvno_tasks')
      .select('*')
    
    if (fetchError) {
      console.error('Error fetching current data:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch current data', details: fetchError }, { status: 500 })
    }
    
    if (!currentData || currentData.length === 0) {
      return NextResponse.json({ 
        message: 'No data to backup',
        backupDate,
        recordsCount: 0
      })
    }

    // 백업 메타데이터 테이블이 없으면 생성
    const { error: createMetaError } = await supabase
      .from('mvno_backup_history')
      .select('id')
      .limit(1)
    
    if (createMetaError && createMetaError.code === 'PGRST116') {
      // 테이블이 존재하지 않으므로 일단 백업 데이터를 JSON으로 저장
      console.log('Backup history table does not exist, will store backup info in response')
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
      backup_table_name: `latest_backup`,
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
      console.warn('Warning: Failed to record backup metadata:', metaError)
      
      return NextResponse.json({
        message: 'Backup completed (metadata save failed)',
        backupDate,
        recordsCount: currentData.length,
        timestamp: now.toISOString(),
        warning: 'Backup metadata could not be stored in database'
      })
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
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
