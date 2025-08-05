-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE public.tasks (
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
CREATE INDEX idx_tasks_task_id ON public.tasks(task_id);
CREATE INDEX idx_tasks_category ON public.tasks(category);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee);
CREATE INDEX idx_tasks_dates ON public.tasks(start_date, end_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON public.tasks 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS (Row Level Security) - 필요시
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 정책 설정 (개발용)
-- CREATE POLICY "Allow all operations for authenticated users" ON public.tasks FOR ALL USING (true);
