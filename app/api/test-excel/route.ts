import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'todo_list_copy.xlsx');
    
    // 파일을 버퍼로 읽기
    const fileBuffer = fs.readFileSync(filePath);
    
    // 버퍼에서 워크북 생성
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    return NextResponse.json({ 
      success: true, 
      totalRows: rawData.length,
      sheetNames: workbook.SheetNames,
      firstRows: rawData.slice(0, 5)
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
