import { NextResponse } from 'next/server'

/**
 * 비밀번호 검증 API
 * 현재 로그인된 사용자의 비밀번호를 검증합니다.
 */
export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({
        success: false,
        error: '비밀번호를 입력해주세요.'
      }, { status: 400 })
    }

    // TODO: 실제 환경에서는 세션이나 JWT 토큰에서 현재 사용자 정보를 가져와야 합니다.
    // 현재는 하드코딩된 계정 정보로 검증합니다.
    const validCredentials = [
      { username: 'nable', password: 'nable123!' },
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' },
      { username: 'user', password: 'user123' },
      { username: 'test', password: 'test123' }
    ]
    
    // 간단한 비밀번호 검증 (실제로는 현재 로그인된 사용자의 비밀번호와 비교해야 함)
    const isValid = validCredentials.some(cred => cred.password === password)
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: '비밀번호가 일치하지 않습니다.'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: '비밀번호가 확인되었습니다.'
    })
    
  } catch (error) {
    console.error('비밀번호 검증 오류:', error)
    
    return NextResponse.json({
      success: false,
      error: '비밀번호 검증 중 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
