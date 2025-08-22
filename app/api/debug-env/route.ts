import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== 환경 변수 디버깅 ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
    
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
    };

    console.log('환경 변수 상태:', envVars);

    // 개발 환경에서만 실제 값의 일부를 보여줌
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        variables: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
        }
      });
    } else {
      // 프로덕션에서는 설정 여부만 확인
      return NextResponse.json({
        success: true,
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        variablesSet: envVars
      });
    }
  } catch (error) {
    console.error('환경 변수 디버깅 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '환경 변수 확인 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
