import { NextResponse } from 'next/server';
import { getTasksFromXlsx } from '../../../lib/excel/';

export async function GET() {
  try {
    const result = await getTasksFromXlsx();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get tasks:', error);
    return NextResponse.json({ message: 'Failed to get tasks' }, { status: 500 });
  }
}
