# Ivy Bloom — Ponytail 코드 감사

## 현재 검토 상태와 사용자 코멘트 — 2026-10-11

> **사용자 코멘트:** 나머지 정리 후보는 나중에 체크할 것. 1~4번은 고객 피드백을 받는 중이므로, 피드백을 받은 뒤 정리 여부를 결정할 것.

아래 번호는 사이드창 목업의 1~7번과 같다. 현재는 모두 검토 보류이며, 삭제 승인이나 작업 예약을 뜻하지 않는다.

| 목업 번호 | 후보 | 어떤 내용인지 | 현재 판단 | 사용자 코멘트 |
| --- | --- | --- | --- | --- |
| 1 | components/BlogPreview.tsx | 이전 글 미리보기 카드 3개. 현재 홈페이지는 별도의 ArticlesPreview를 사용한다. | 미사용 · 보류 | 고객 피드백 받은 뒤 나중에 체크할 것. |
| 2 | components/Stats.tsx | 경력·사업 기간·설립연도 표시 섹션. | 미사용 · 보류 | 고객 피드백 받은 뒤 나중에 체크할 것. |
| 3 | components/Testimonials.tsx | 이전 후기·사례 카드 3개. | 미사용 · 보류 | 고객 피드백 받은 뒤 나중에 체크할 것. |
| 4 | sanity/components/WritingGuide.tsx | 이전 글 작성 안내. 현재 사용하는 sanity/journal-components/WritingGuide.tsx는 별도 파일이다. | 미사용 · 보류 | 고객 피드백 받은 뒤 나중에 체크할 것. |
| 5 | lib/structured-data.ts의 articleSchema · blogPostingSchema | 검색 엔진용 글 정보를 만드는 이전 함수 2개. 현재 공개 글은 buildSchemaOrgJsonLd를 사용하며 이 함수는 유지 대상이다. | 이전 함수 2개만 정리 후보 · 보류 | 나중에 체크할 것. |
| 6 | sanity/queries.ts의 postsPreviewQuery | 1번의 이전 글 미리보기에 최신 글 3개를 공급하는 조회. | 1번 정리 여부와 함께 검토 · 보류 | 나중에 체크할 것. |
| 7 | lib/local-images.ts의 localImageUrl | 이미지 주소를 변환하지 않고 그대로 반환하는 함수. 호출자와 관련 검사를 함께 수정해야 한다. | 사용 중이나 간소화 후보 · 보류 | 나중에 체크할 것. |

### 다음 검토 때 확인할 것

- [ ] 1~4번: 고객이 원하는 화면·안내가 현재 구현에 충분한지 확인한 뒤 삭제 또는 재사용 결정.
- [ ] 5번: 이전 두 함수의 호출자가 여전히 없는지 재확인. 현재 buildSchemaOrgJsonLd와 발행 글의 검색용 정보는 보존.
- [ ] 6번: 1번을 제거하기로 결정했을 때 전용 조회도 함께 정리할지 확인.
- [ ] 7번: 주소 안전성 검사를 보존하면서 래퍼·호출자·백업 검사를 함께 간소화할지 확인.

### 별도로 남아 있는 수정 점검 항목

아래는 미사용 코드 삭제 후보와 다른 문제다. 기존 감사에서 발견한 항목을 나중에 다시 점검한다. 이번 문서 기록으로 수정되지는 않았다.

- [ ] 문의 폼의 실제 수신처 연결과 네트워크 오류 처리.
- [ ] 저장·발행 후 목록 조회가 실패해도 이미 성공한 저장을 실패로 표시하지 않도록 처리.
- [ ] 현재 Next.js 버전에 맞는 lint 명령·설정 복구.
- [ ] AI 요청 제한을 서버 전체에서 공유해야 하는지 검토.
- [ ] 홈 글 카드에 story 분류 이름 표시 보완.

### 이미 처리한 범위

- /blog 중복 소스 제거 및 /articles로 이동 설정: 로컬 완료, 이번 정리 배포는 하지 않음.
- 디자인 비교 8개: 바탕화면 /Users/km/Desktop/디자인 페이지 8개로 보관, 각각 설명.md에 내용 기록, 로컬 비교 경로 제거.
- 예시 글: 이후 사용자가 발행했으며 공개 글 주소의 200 응답과 제목 표시를 확인함. 아래 이전 기록의 ‘임시저장’은 당시 검사 상태임.

**아래 감사 내용과 실행 기록은 각 확인 시점의 기록이다. 현재 결정은 이 섹션을 우선한다.**

---

확인일: 2026-10-11 (한국 시간)
대상: /Users/km/Desktop/ivybloom
실행: 설치된 ponytail-audit 지침에 따른 코드 감사 + 임시 Knip 분석 + 기존 회귀 검사
범위: 보고서 작성. 애플리케이션 코드 삭제·수정·재배포 없음.

## 이 프로젝트가 하는 일

Next.js 공개 홈페이지와 같은 프로젝트의 /admin에서 글을 작성하고, 고객 Sanity의 production 데이터셋에 초안·발행본·이미지를 저장한다. /studio에는 별도의 Sanity 편집기가 있다. 관리자 1명 또는 소수, 낮은 공개 트래픽을 전제로 점검했다. Vercel에서는 요청이 서로 다른 서버 인스턴스에 도착할 수 있다.

## 설치 완료

- /Users/km/.codex/skills/ponytail/SKILL.md
- /Users/km/.codex/skills/ponytail-audit/SKILL.md
- 출처: https://github.com/DietrichGebert/ponytail
- 다음 대화 턴부터 설치된 스킬로 사용할 수 있다. 이번 감사는 설치 파일을 직접 읽고 적용했다.

## 반드시 고칠 항목

### 1. 문의 폼의 수신 대상이 예시 값이다

위치: [app/contact/page.tsx](/Users/km/Desktop/ivybloom/app/contact/page.tsx:9)

- 역할: 방문자의 상담 문의를 Formspree로 전송한다.
- 문제: FORMSPREE_ID가 YOUR_FORMSPREE_ID로 고정되어 있어 고객 문의 수신처가 연결되지 않았다. 네트워크 오류에도 catch/finally가 없어 sending 상태에서 멈출 수 있다.
- 최소 수정: 고객의 실제 수신 서비스를 연결한다. 연결 전에는 전송 가능한 폼으로 안내하지 않는다. 네트워크 실패 시 오류 상태와 재시도 버튼을 복구한다.
- 미수정 시: 고객이 문의를 남겨도 업체가 받지 못할 수 있다. 실제 메시지 전송은 이번 감사에서 하지 않았다.

### 2. 저장·발행 성공을 목록 조회 실패 때문에 실패로 표시한다

위치: [app/admin/content/route.ts](/Users/km/Desktop/ivybloom/app/admin/content/route.ts:27), [app/admin/publish/route.ts](/Users/km/Desktop/ivybloom/app/admin/publish/route.ts:12)

- 역할: Sanity에 저장·발행한 결과와 갱신된 목록을 한 응답으로 반환한다.
- 문제: 쓰기가 성공한 뒤 readSource가 실패하면 catch에서 502를 반환한다. 화면은 최신 문서 revision을 받지 못하고 기존 상태를 유지한다.
- 재현: 실제 두 라우트를 메모리 안에서 실행했다. saveDraft/publishDraft는 성공, readSource만 실패하도록 하면 두 라우트 모두 writeCommitted=true인데 응답은 502였다. 네트워크·고객 데이터 쓰기는 사용하지 않았다.
- 최소 수정: 쓰기 성공 결과와 목록 새로고침 실패를 분리한다. 기존 DELETE 라우트의 refreshRequired 방식과 맞추고, 화면에서도 문서·revision을 먼저 적용한다. 이 실패 시나리오를 검사에 추가한다.
- 미수정 시: 이미 저장·발행된 글을 실패로 오해하고 재시도하다 revision 충돌을 겪는다. 성공을 숨기는 문제이며 실제 데이터 손실이 발생했다고 확인한 것은 아니다.

## 정리하거나 개선할 항목

### 3. lint 실행 경로가 현재 Next.js와 맞지 않는다

위치: [package.json](/Users/km/Desktop/ivybloom/package.json:9)

- 역할: 코드 검사 명령이다.
- 문제: next lint를 실행하면 실제로 Invalid project directory ... /ivybloom/lint 오류로 종료한다. 프로젝트 내 ESLint 설정 파일도 발견되지 않았다.
- 최소 수정: 현재 버전에 맞는 ESLint 직접 실행 명령과 필요한 최소 설정을 연결한다. lint를 유지할 계획이면 eslint·eslint-config-next를 미사용 패키지로 삭제하지 않는다.
- 미수정 시: 타입 검사가 통과해도 별도 린트 검사를 실행할 수 없다.

### 4. 미사용 컴포넌트 4개가 남아 있다 — 252줄

| 파일 | 줄 수 |
|---|---:|
| components/BlogPreview.tsx | 149 |
| components/Stats.tsx | 30 |
| components/Testimonials.tsx | 60 |
| sanity/components/WritingGuide.tsx | 13 |

- 역할: 과거 공개 페이지 섹션과 이전 작성 가이드다.
- 문제: Next.js/Sanity/도구/테스트 진입점을 포함한 Knip 분석에서 네 파일이 미사용으로 나왔다. 프로젝트 전체의 이름·경로 검색에서도 호출자가 없었다. 홈페이지는 ArticlesPreview, journalPost는 sanity/journal-components/WritingGuide를 사용한다.
- 최소 수정: 네 파일을 삭제하고 타입·빌드 검사를 수행한다. 사용 중인 journal-components/WritingGuide와 AnimateOnScroll은 보존한다.
- 미수정 시: 기존 화면과 실제 화면의 구분이 흐려지고 수정할 파일을 잘못 선택하기 쉽다. 번들 용량이 반드시 252줄만큼 감소한다는 뜻은 아니다.

### 5. 미사용 JSON-LD 생성 함수가 중복으로 남아 있다

위치: [lib/structured-data.ts](/Users/km/Desktop/ivybloom/lib/structured-data.ts:152)

- 역할: articleSchema와 blogPostingSchema가 각각 구조화 데이터를 만든다.
- 문제: 두 함수의 실제 호출자를 찾지 못했다. 현재 공개 글은 PostArticle → buildSchemaOrgJsonLd를 사용한다. Knip도 두 export를 미사용으로 보고했다.
- 최소 수정: 두 함수만 삭제한다. 현재 사용 중인 buildSchemaOrgJsonLd와 조직 구조화 데이터는 유지한다.
- 미수정 시: URL·업체 정보·스키마 변경을 적용할 함수가 세 곳처럼 보여 오래된 함수를 다시 사용할 수 있다.

### 6. 디자인 비교 페이지 8개가 운영에 공개되어 있다

위치: [app/design-preview/page.tsx](/Users/km/Desktop/ivybloom/app/design-preview/page.tsx:1)와 하위 7개 페이지

- 역할: 서비스·히어로·통계 디자인을 비교하는 페이지다. 합계 952줄이다.
- 문제: 운영의 /design-preview와 /design-preview/hero-bloom이 실제 200으로 열린다. 검색 제외 메타와 X-Robots-Tag가 없다. 이 경로는 Next.js 진입점이므로 정적 분석에서 미사용 파일로 잡히지 않는다.
- 최소 수정: 디자인 확정 후 사용하지 않으면 해당 경로를 제거한다. 비교용으로 계속 필요하면 운영 공개·색인 정책을 정하고 noindex 또는 접근 제한을 적용한다.
- 미수정 시: 임시 디자인 내용과 중복 페이지가 운영에서 발견될 수 있다. 실제 Google 색인 여부까지 확인한 것은 아니다.
- 삭제 판단: 사용 목적을 확인해야 하는 조건부 후보다. 952줄을 확정 삭제량으로 계산하지 않는다.

### 7. /blog와 /articles가 같은 글을 별도 코드로 표시한다

위치: [app/blog/[slug]/page.tsx](/Users/km/Desktop/ivybloom/app/blog/[slug]/page.tsx:1), [app/articles/[slug]/page.tsx](/Users/km/Desktop/ivybloom/app/articles/[slug]/page.tsx:1), 두 목록 페이지

- 역할: 같은 Sanity 글 조회와 PostArticle 렌더링을 수행한다.
- 문제: 두 상세 파일은 38줄 전체가 바이트 단위로 동일했다. 목록도 같은 조회·필터·카드 구조를 복사했지만 /articles에만 story 분류와 강조 섹션이 있어 차이가 벌어졌다.
- 최소 수정: 대표 경로 /articles로 모으고 /blog는 필요한 기존 URL·검색 파라미터를 보존하는 리다이렉트로 유지한다. 별도 화면이 업무상 필요하면 공통 부분만 재사용한다.
- 미수정 시: 한쪽만 수정되어 메뉴·분류·오류 처리에 차이가 생긴다. 현재 canonical이 /articles로 지정되어 있으므로 중복 URL만으로 검색 페널티가 있다고 단정하지 않는다.

### 8. AI 요청 제한이 서버 전체에서 공유되지 않는다

위치: [app/admin/ai/route.ts](/Users/km/Desktop/ivybloom/app/admin/ai/route.ts:5), [app/admin/ai/image/route.ts](/Users/km/Desktop/ivybloom/app/admin/ai/image/route.ts:5)

- 역할: 진행 중인 생성과 15분 내 요청 횟수를 제한한다.
- 문제: 제한 상태가 각 서버의 Map에만 있다. 같은 계정의 요청이 서로 다른 Vercel 인스턴스에 도착하면 각 인스턴스가 별도로 허용한다.
- 재현: 글 작성 라우트를 두 독립 메모리 인스턴스로 로드했다. 동일 관리자 동시 요청이 두 인스턴스에서는 둘 다 200이고, 같은 인스턴스의 추가 동시 요청은 429였다. AI 응답은 가짜 응답이며 유료 호출은 하지 않았다.
- 최소 수정: 서버 전체의 비용·동시 요청 제한이 필요하면 기존 공유 저장소의 revision 잠금 등으로 제한 상태를 공유한다. 화면의 aiBusy와 서버 한 인스턴스의 busy는 서로 다른 역할이다.
- 미수정 시: 안내한 20회/10회 제한이 계정 전체의 상한이 되지 않으며 여러 탭·인스턴스에서 동시 유료 요청이 가능하다. 키 유출이나 실제 과금 초과를 확인한 것은 아니다.

## 작은 정리 항목

### 9. 이미지 URL의 아무 일도 하지 않는 래퍼

위치: [lib/local-images.ts](/Users/km/Desktop/ivybloom/lib/local-images.ts:1), [lib/local-studio.ts](/Users/km/Desktop/ivybloom/lib/local-studio.ts:114)

- 역할: localImageUrl이 받은 문자열을 그대로 반환한다.
- 문제: 이미지 URL 변환·매핑이 없으므로 함수·파일·import를 거칠 이유가 없다.
- 최소 수정: 호출자가 value를 직접 반환하고, 백업 검사에서 해당 모듈 모킹을 함께 정리한다. URL 허용 검사 자체는 유지한다.
- 미수정 시: 실제 처리가 있는 것처럼 보여 유지보수 탐색이 한 단계 늘어난다. 성능 문제로 분류하지 않는다.

### 10. 홈 글 카드의 story 분류 이름이 빠져 있다

위치: [components/ArticlesSliderClient.tsx](/Users/km/Desktop/ivybloom/components/ArticlesSliderClient.tsx:11)

- 역할: 홈 글 카드의 분류를 사람이 읽는 이름으로 표시한다.
- 문제: 관리자와 /articles는 story를 지원하지만 홈 카드의 CATEGORY_LABELS에는 story가 없어 Article이라는 일반 이름으로 출력된다.
- 최소 수정: 현재 분류 이름을 한 항목 추가한다. 추후 분류 변경 시 소비 위치를 함께 확인한다.
- 미수정 시: 같은 글의 분류명이 홈과 글 목록에서 달라진다.

## 검사 결과와 오탐 처리

- 타입 검사: tsc --noEmit 통과.
- 기존 관리자 회귀 검사 6개: auth, ai, services, seo, backup, navigation 전부 종료 코드 0. auth는 14개 항목 통과.
- 신규 실패 재현 2종: 저장/발행 성공 후 목록 읽기 실패, 독립 서버 인스턴스 간 AI 제한 차이를 가짜 저장소·가짜 AI 응답으로 확인.
- Knip: 임시 설정에서 Next.js 기본 진입점, sanity.config.ts, sanity.cli.ts, tools, tests를 포함했다. 결과가 있어 종료 코드 1로 끝났으며 분석 오류로 취급하지 않았다.
- Knip이 미사용으로 표시한 validateWriting·validatePreparation·hashPassword 등의 export는 VM으로 실행하는 테스트가 문자열로 접근한다. 이들은 삭제 후보에서 제외했다.
- @sanity/ui·@sanity/icons·server-only는 실제 import가 있다. 미등록 의존성 경고를 미사용 의존성으로 해석하지 않았다.
- 기존 post 스키마와 그 편집 컴포넌트는 sanity.config.ts에 연결되어 있다. 별도 양식이라는 이유만으로 삭제하지 않는다.
- 설치한 스킬 외 프로젝트 패키지에 Knip을 추가하지 않았다. 분석은 임시 npx 실행으로 수행했다.
- Knip 임시 결과: /private/tmp/ivybloom-ponytail-knip-results.json

## 판단

문의 폼 연결과 저장·발행 성공 응답을 먼저 고친 뒤, 미사용 4파일과 오래된 JSON-LD 함수부터 정리하는 것이 적절하다. 디자인 비교 경로와 /blog는 실제 사용 목적·기존 URL을 보존하면서 정리한다.

정리 예상: 미사용 4파일의 **252줄**을 우선 삭제할 수 있다. 미사용 구조화 데이터 함수 56줄과 단순 래퍼도 추가 후보다. 디자인 비교 952줄은 조건부 후보다. **확정 제거 패키지는 0개**다. 모든 수치는 아직 적용 전이다.

## 확인하지 않은 것

- 모든 117개 파일을 한 줄씩 전부 읽은 것은 아니다. 인증·저장·발행·AI·공개 글·폼 경로와 설정/테스트를 집중 검토하고, 나머지는 진입점·사용처 검색으로 확인했다.
- 실제 문의 메시지 전송, 고객 데이터 생성·삭제·발행, 실제 유료 AI 생성, OpenAI 이미지 모델 접근 권한은 이번 감사에서 실행하지 않았다.
- 공개 홈의 시간 캐시가 실제 발행 직후 어떻게 바뀌는지 새 운영 글을 만들어 재검사하지 않았다.
- 전체 브라우저 클릭·모바일 레이아웃·부하 테스트·새 빌드·재배포는 실행하지 않았다.
- 이번 감사는 모든 보안 취약점이 없다는 보증이 아니다. 이전 문서의 의존성 경고도 이 실행만으로 해결되지 않는다.

## 2026-10-11 사용자 선택 반영

- /blog 목록·상세 중복 소스를 제거했습니다. next.config.mjs의 308 이동 설정으로 기존 /blog 주소와 카테고리 등 쿼리는 /articles에서 이어집니다.
- 디자인 비교용 8개 원본(952줄)을 /Users/km/Desktop/디자인 페이지 8개/design-preview로 보관하고 로컬 app/design-preview에서 제거했습니다. 각 내용은 바탕화면 폴더의 설명.md에 기록했습니다. 복사본 8개가 원본과 SHA-256 일치한 뒤 원본 경로를 제거했습니다.
- 빌드·타입 검사 통과. 로컬 실제 HTTP 검사: blog 목록/카테고리/상세 이동 308, 디자인 8개 주소 404, 홈·서비스·articles 200.
- 고객 Sanity 16s9d1s4 / production에 예시 글을 실제 관리자 API로 임시저장하고 리비전 기반 수정·재조회했습니다. 제목·본문·표·체크리스트·검색 설정·FAQ가 저장 값과 일치하며 Sanity 원본에서도 확인했습니다.
- 예시: [[Sample Draft] A Checklist for Planning US College Applications](https://ivybloom-consulting.vercel.app/admin/edit/ivy-example-880dd8cf-4954-4a8d-87bf-285877bc4cbb). 발행본 없음·공개 글 주소 404 확인. 사용자가 볼 수 있도록 임시저장 예시 1개를 남겼습니다.
- 이번 예시의 이미지 업로드·유료 AI 생성·브라우저 화면 조작은 검사하지 않았습니다.
- 다른 삭제 후보는 변경하지 않았습니다. 이번 로컬 정리는 배포하지 않았습니다. 현재 운영 사이트의 blog/디자인 경로는 기존 배포 상태입니다.
