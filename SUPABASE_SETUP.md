# Supabase 설정 가이드

MealTrack 앱을 위한 Supabase 프로젝트 생성 및 설정 가이드입니다.

## 1. Supabase 프로젝트 생성

### 1-1. Supabase 계정 생성 및 프로젝트 생성
1. [supabase.com](https://supabase.com)에 접속하여 계정을 생성하거나 로그인
2. "New Project" 버튼 클릭
3. 프로젝트 정보 입력:
   - **Name**: `mealtrack`
   - **Database Password**: 안전한 비밀번호 생성 (기억해두세요!)
   - **Region**: `Northeast Asia (ap-northeast-1)` (한국에서 가장 가까운 지역)
4. "Create new project" 클릭

### 1-2. 프로젝트 설정 확인
- 프로젝트가 생성되면 Dashboard로 이동
- 왼쪽 사이드바의 Settings → API에서 다음 정보 확인:
  - **Project URL** (SUPABASE_URL)
  - **anon public key** (SUPABASE_ANON_KEY)

## 2. 데이터베이스 스키마 설정

### 2-1. SQL Editor에서 테이블 생성
1. 왼쪽 사이드바에서 "SQL Editor" 선택
2. "New query" 버튼 클릭
3. `database/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭하여 실행

### 2-2. 샘플 음식 데이터 삽입
1. 새로운 쿼리 생성
2. `database/sample_foods.sql` 파일의 내용을 복사하여 붙여넣기
3. "Run" 버튼 클릭하여 실행

## 3. Google OAuth 설정

### 3-1. Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" → "Credentials" 이동
4. "Create Credentials" → "OAuth 2.0 Client IDs" 선택
5. Application type: "Web application"
6. Name: `MealTrack OAuth`
7. Authorized redirect URIs 추가:
   ```
   https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
   ```
   (프로젝트 ID는 Supabase Dashboard의 Settings → General에서 확인)
8. "Create" 버튼 클릭
9. Client ID와 Client Secret 복사 (보관 필요)

### 3-2. Supabase에서 Google OAuth 설정
1. Supabase Dashboard에서 Authentication → Providers 이동
2. Google 제공업체 클릭
3. "Enable Google provider" 토글 활성화
4. Google Cloud Console에서 복사한 정보 입력:
   - **Client ID**: Google OAuth Client ID
   - **Client Secret**: Google OAuth Client Secret
5. "Save" 버튼 클릭

### 3-3. 사이트 URL 설정
1. Authentication → URL Configuration 이동
2. Site URL에 개발 및 배포 URL 추가:
   ```
   http://localhost:3000
   https://your-vercel-app.vercel.app (배포 후)
   ```
3. Redirect URLs에도 동일한 URL들 추가

## 4. 환경변수 설정

### 4-1. .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4-2. Vercel 환경변수 설정 (배포 시)
1. Vercel Dashboard에서 프로젝트 선택
2. Settings → Environment Variables 이동
3. 위의 환경변수들을 추가

## 5. 테스트 및 확인

### 5-1. 로컬 개발 서버에서 테스트
```bash
npm run dev
```

### 5-2. 확인 사항
1. Google 로그인이 정상 작동하는지 확인
2. 로그인 후 프로필이 자동으로 생성되는지 확인
3. 데이터베이스에 사용자 정보가 저장되는지 확인

## 6. 보안 설정 확인

### 6-1. RLS (Row Level Security) 확인
- SQL Editor에서 다음 쿼리로 RLS가 활성화되었는지 확인:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

### 6-2. 정책 확인
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 트러블슈팅

### 문제 1: Google OAuth 로그인이 작동하지 않을 때
- Google Cloud Console에서 Authorized redirect URIs가 올바르게 설정되었는지 확인
- Supabase에서 Site URL과 Redirect URLs가 올바른지 확인

### 문제 2: 데이터베이스 연결 오류
- 환경변수 `.env.local`이 올바르게 설정되었는지 확인
- 프로젝트 URL과 anon key가 정확한지 확인

### 문제 3: RLS 오류로 데이터 접근 불가
- 사용자가 로그인된 상태인지 확인
- RLS 정책이 올바르게 설정되었는지 확인

## 다음 단계
모든 설정이 완료되면:
1. 앱을 다시 시작: `npm run dev`
2. Google 로그인 테스트
3. 식사 기록 추가/조회 기능 테스트
4. Vercel에 배포 후 운영 환경에서도 테스트