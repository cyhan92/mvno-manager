import { NextResponse } from 'next/server';
import { getTasksFromXlsx } from '../../../lib/excel';

export async function GET() {
  try {
    const tasks = getTasksFromXlsx();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to get tasks:', error);
    return NextResponse.json({ message: 'Failed to get tasks' }, { status: 500 });
  }
}
