# 기록장

키보드 중심의 개인 일기장 웹앱. 마크다운으로 저장하고 Google Drive와 동기화되는 PWA(Progressive Web App)입니다.

**실행 주소**: https://somaek-gch.github.io/diary/diary-prototype.html

---

## 왜 만들었나

- 특정 회사/앱에 종속되지 않는 오픈 포맷(마크다운) 저장
- 서버 비용 0원 (GitHub Pages + 개인 Google Drive)
- 키보드로 빠르게 쓰고, 10년 치를 한눈에 훑어볼 수 있는 구조

## 주요 기능

- **빠른 기록**: 템플릿 태그(오늘 잘한 것/아쉬운 것/내일의 다짐), `Cmd·Ctrl + Enter` 저장
- **날짜 이동**: 원하는 날짜로 이동해 보기/수정, 타임라인에서 "수정" 버튼으로 바로 편집
- **날씨 자동 기록**: 하루 최초 저장 시 위치 기반으로 자동 기록, 이후 캐시 재사용 (재요청 없음)
- **음력 · 24절기 · 명절**: 음력 날짜, 절기, 설날/추석 자동 표시
- **기념일 관리**: 가족 생일(양력/음력) 등록·수정·삭제, 해당일에 배지 표시
- **10년 다이어리 뷰**: "이 날, 지난 기록들" — 같은 월/일의 과거 기록을 카드로 비교
- **검색**: 타임라인 텍스트 검색 (연도별 그룹)
- **사진 첨부**: 기록에 여러 장 첨부, Drive에 함께 저장
- **기분 트래킹**: 이모지로 그날의 기분 기록
- **삭제**: 기록/사진 개별 삭제 (Drive 휴지통으로 이동, 영구삭제 아님)
- **Google Drive 동기화**: 날짜별 `.md` 파일로 저장, `drive.file` 스코프(앱이 만든 파일에만 접근)
- **PWA**: 홈 화면 설치, 오프라인 캐싱(네트워크 우선 전략)
- **PIN 잠금**: 앱 접근을 숫자 잠금번호로 보호 (SHA-256 해시로 브라우저에 저장)

## 파일 구성

| 파일 | 역할 |
|---|---|
| `diary-prototype.html` | 앱 본체 (HTML/CSS/JS 단일 파일) |
| `manifest.json` | PWA 설치 정보 (앱 이름, 아이콘, 색상) |
| `sw.js` | 서비스 워커 (오프라인 캐싱, network-first) |
| `icon-192.png`, `icon-512.png` | 앱 아이콘 |

## 저장되는 데이터 (Google Drive `기록장-데이터` 폴더)

| 항목 | 파일 |
|---|---|
| 일기 본문 · 날씨 · 기분 · 사진 참조 | `YYYY-MM-DD.md` (frontmatter + 본문) |
| 사진 원본 | 같은 폴더에 이미지 파일로 업로드 |
| 기념일(가족 생일) 목록 | `기념일-데이터.json` |

마크다운 예시:
```
---
date: 2026-07-27
weather: 맑음 27°C
mood: 😊
photos: 1AbCxyz...,1DefUvw...
---
오늘 잘한 것: ...
아쉬운 것: ...
```

## 배포 방법 (GitHub Pages)

1. GitHub 저장소 생성 (Public)
2. 위 5개 파일 업로드
3. Settings → Pages → Source: `main` 브랜치, `/ (root)` → Save
4. `https://[사용자명].github.io/[저장소명]/diary-prototype.html` 로 접속

## Google Drive 연동 설정 (최초 1회)

1. [console.cloud.google.com](https://console.cloud.google.com) → 새 프로젝트 생성
2. **Drive API** 사용 설정
3. **Google Auth Platform**
   - Audience → 테스트 사용자에 본인 계정 추가
   - Data Access → 범위 추가: `https://www.googleapis.com/auth/drive.file`
   - Clients → 클라이언트 만들기 → 유형: **웹 애플리케이션** → 승인된 자바스크립트 원본에 `https://[사용자명].github.io` 추가
4. 발급된 클라이언트 ID를 앱의 "동기화" 섹션에 입력 → Google 계정 연결

> `file://`로 직접 파일을 열면 Google 로그인이 동작하지 않습니다. 반드시 `https://` (또는 로컬 테스트 시 `http://localhost:포트`) 주소로 접속해야 합니다.

## 로컬 개발/테스트

```bash
python -m http.server 8000
```
→ `http://localhost:8000/diary-prototype.html` 접속
(이 경우 Cloud Console의 승인된 자바스크립트 원본에 `http://localhost:8000`도 추가해야 함)

## 알아두면 좋은 점

- 로그인 세션은 새로고침하면 풀립니다. 클라이언트 ID/이메일은 브라우저에 기억되지만, 접속할 때마다 "Google 계정 연결"을 한 번씩 눌러야 합니다.
- PIN을 잊어버리면: 브라우저 개발자도구 → Application → Local Storage → `diary_pin_hash` 삭제로 초기화 가능 (기록 자체는 Drive에 안전하게 보관됨).
- 검색은 단순 텍스트 매칭입니다 (AI 기반 의미 검색 아님).
- 사진은 텍스트보다 용량이 훨씬 크므로, 장기적으로 Drive 용량을 많이 차지할 수 있습니다.

## 기술 스택

- 순수 HTML/CSS/JavaScript (프레임워크 없음)
- [js-calendar-converter](https://unpkg.com/js-calendar-converter) — 음력/절기 변환 (CDN)
- [Open-Meteo API](https://open-meteo.com) — 날씨 (무료, API 키 불필요)
- Google Identity Services + Drive API v3 — 인증 및 동기화
- Service Worker — PWA 오프라인 지원
