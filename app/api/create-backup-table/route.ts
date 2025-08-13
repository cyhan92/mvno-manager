import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // 백업 이력 테이블 생성
    const { error } = await supabase
      .from('mvno_backup_history')
      .insert({
        backup_table_name: 'test_table',
        backup_date: '2025-01-01',
        backup_timestamp: new Date().toISOString(),
        records_count: 0,
        status: 'test',
        backup_data: JSON.stringify([])
      })
    
    if (error && error.code === 'PGRST116') {
      // 테이블이 존재하지 않음, 수동으로 생성 필요
      return NextResponse.json({
        message: 'Please create the backup history table manually in Supabase',
        sql: `
CREATE TABLE mvno_backup_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_table_name TEXT NOT NULL,
  backup_date DATE NOT NULL,
  backup_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  records_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  backup_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `
      })
    }
    
    if (error) {
      return NextResponse.json({ error: 'Error testing table', details: error }, { status: 500 })
    }
    
    // 테스트 데이터 삭제
    await supabase
      .from('mvno_backup_history')
      .delete()
      .eq('status', 'test')
    
    return NextResponse.json({ message: 'Backup history table exists and is ready' })
    
  } catch (error) {
    console.error('Error in create-backup-table API:', error)
    return NextResponse.json({ 
      error: 'Failed to test backup table', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
