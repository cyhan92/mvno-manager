import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 특정 작업 업데이트
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const taskId = params.id
    const updateData = await request.json()

    console.log('Updating task:', taskId, 'with data:', updateData)

    // 업데이트할 데이터 준비
    const updates: any = {}

    if (updateData.startDate) {
      updates.start_date = updateData.startDate
    }
    if (updateData.endDate) {
      updates.end_date = updateData.endDate
    }
    if (updateData.percentComplete !== undefined) {
      updates.progress = updateData.percentComplete
    }
    if (updateData.resource) {
      updates.assignee = updateData.resource
    }
    if (updateData.department) {
      updates.department = updateData.department
    }

    // Supabase에 업데이트
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to update task', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    console.log('Task updated successfully:', data[0])

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Task updated successfully'
    })

  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 특정 작업 조회
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const taskId = params.id

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (error) {
      console.error('Supabase select error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch task', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Task fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
