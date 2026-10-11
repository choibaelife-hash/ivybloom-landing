---
title: Ivy Bloom Consulting — 관리자·Sanity·도메인·검색 출시 가이드
status: 고객 Sanity·Vercel 배포 및 운영 로그인·발행 검증 완료 / DNS·검색 등록 미실행
tags: [도메인, DNS, HTTPS, SEO, AEO, GEO, 검색콘솔]
---

# Ivy Bloom Consulting — 관리자·Sanity·도메인·검색 출시 가이드

완성된 웹사이트에 고객 소유 도메인을 연결하고, 공개 페이지가 정상 작동하고 검색엔진에 발견될 수 있는지 확인하는 절차다. 호스팅·DNS·CMS 제품에 관계없이 적용하며, 각 서비스 화면에 표시된 값과 실제 프로젝트 구조를 우선한다. 이 문서 자체는 특정 프로젝트의 연결이나 검색 등록이 완료되었다는 증거가 아니다.

## 0. Ivy Bloom 현재 구성과 완료 상태

확인일: 2026-10-11 (한국 시간).

| 항목 | 실제 값 / 확인 상태 |
|---|---|
| 구매한 도메인 | `ivybloomconsulting.com` — 고객 구매 완료 |
| 예정된 대표 도메인 | `https://ivybloomconsulting.com` — DNS·HTTPS 연결 미검증 |
| 현재 운영 홈페이지 | `https://ivybloom-consulting.vercel.app` |
| 현재 운영 관리자 | `https://ivybloom-consulting.vercel.app/admin` — 같은 홈페이지 프로젝트의 경로 |
| 도메인 연결 후 관리자 | `https://ivybloomconsulting.com/admin` |
| 고객 Vercel 계정·팀 | `ivyjenniehomepage@gmail.com` / `ivybloom-homepage-project` |
| Vercel 프로젝트 | `ivybloom-consulting` / `prj_b9RLEMijquOz7c23AGRcBeDuD6Kc` — Git 미연결, 로컬 코드 직접 배포 |
| Sanity 고객 계정 | `ivyjenniehomepage@gmail.com` — Google 인증 성공 |
| Sanity 조직 | `Jennie Ivybloom` / `ouh8f8aa3` — 위 계정이 조직 관리자 |
| Ivy 전용 Sanity 프로젝트 | `Ivy Bloom Consulting` / `16s9d1s4` |
| 데이터셋 | `production` — 공개 글 조회용 public 데이터셋 |
| 관리자 로그인 이메일 | `ivybloom.consulting@gmail.com` |
| Sanity 편집기 | 같은 홈페이지 프로젝트의 `/studio` — 운영 응답 200 및 검색 제외 헤더 확인 |
| 로컬 코드 위치 | `/Users/km/Desktop/ivybloom` |
| 관리자 디자인 | Ivy 홈페이지의 버건디·로즈·크림 색상으로 적용 |
| 실제 운영 검증 | `https://ivybloom-consulting.vercel.app`에서 요청 계정 로그인·관리자 열기, 이미지 업로드, 초안 저장·재조회, 초안 공개 404, 발행·본문/FAQ/canonical/JSON-LD 표시, 수정 초안 비공개 유지, 재발행 즉시 반영, 테스트 글·이미지 삭제 — 12개 항목 통과 |
| 최종 배포 | `dpl_8SxFZ2dFdsbDkcKnsrBSRE5pMG41` / Production READY / Next.js 16.3.8 |
| 기존 Ivy 자료 보존 | 기존 빈 초안 2개와 이미지 1개를 백업하고 고객 프로젝트로 복사 |
| 운영 서비스 상태 | 고객 Vercel 배포 완료. DNS 변경, Search Console 등록·색인 요청은 미실행 |

Sanity 로그인과 맞춤형 `/admin` 로그인은 별도 계정이다. 글 양식과 관리자 디자인을 재사용했으며 다른 고객의 저장소·게시글·비밀값을 연결하지 않았다. 비밀번호와 API 토큰은 이 문서에 기록하지 않는다.

### Sanity를 고객사 소유로 운영하는 순서

1. 고객 계정으로 Sanity에 로그인하고, 프로젝트가 고객 계정이 관리하는 조직에 속하는지 확인한다.
2. Ivy 전용 프로젝트와 `production` 데이터셋을 만들고, 글 양식·업체명·글 분류를 Ivy에 맞춘다. 현재 이 단계는 완료했다.
3. 공개 홈페이지는 게시된 문서만 읽고, 초안·버전 문서·관리자 인증 문서는 공개 글 목록에서 제외한다.
4. 관리자 서버에서만 사용할 쓰기 토큰을 만들고 `SANITY_API_WRITE_TOKEN`에 둔다. 브라우저에 전달하는 `NEXT_PUBLIC_` 변수에 토큰을 넣지 않는다.
5. `NEXT_PUBLIC_SANITY_PROJECT_ID=16s9d1s4`, `NEXT_PUBLIC_SANITY_DATASET=production`을 홈페이지와 관리자에 동일하게 적용한다. 고객 프로젝트 연결과 Vercel Production·Preview 환경변수 등록을 완료했다.
6. 운영 배포 전 같은 프로젝트 ID·데이터셋·서버 비밀값을 호스팅의 운영 환경에도 설정한다. 계정 암호화 키와 세션 키는 안전하게 인계하고 유지한다.
7. 운영 브라우저에서 `/studio`를 사용할 경우 실제 운영 원점만 Sanity CORS에 추가한다. 현재 `http://127.0.0.1:3015`와 운영 원점 `https://ivybloom-consulting.vercel.app`을 연결했다. 사용자 도메인은 DNS 연결 후 추가·검증한다. CORS는 관리자 인증을 대신하지 않는다.
8. 운영 환경에서도 이미지 → 초안 저장 → 발행 → 공개 URL → 수정·재발행을 다시 확인한다. 로컬 통과를 운영 서비스 통과로 기록하지 않는다.

### 관리자 검색 제외

- `/admin`, `/admin/login`, `/admin/*`, `/studio/*`는 `noindex` 메타 또는 `X-Robots-Tag`로 검색 제외한다.
- 관리자 콘텐츠·저장·발행 API는 서버에서 로그인과 요청 출처를 확인한다. 검색 제외만으로 데이터를 보호하지 않는다.
- 관리자와 로그인 경로를 사이트맵에 넣지 않는다.
- `robots.txt`로 해당 경로의 크롤링을 막으면 `noindex`를 읽지 못할 수 있으므로 두 설정을 혼동하지 않는다.

### Ivy용 실제 주소 점검표

| 확인할 주소 | 기대 결과 |
|---|---|
| `https://ivybloomconsulting.com/robots.txt` | 크롤링 규칙 및 Ivy 사이트맵 주소 |
| `https://ivybloomconsulting.com/sitemap.xml` | 공개·게시·색인 가능한 정식 URL만 포함 |
| `https://ivybloomconsulting.com/articles/<글-주소>` | 실제 공개 본문, 제목·설명·공유 이미지·자기 canonical |
| `https://ivybloomconsulting.com/admin` | 비로그인 사용자는 로그인 화면으로 이동 |
| `https://ivybloomconsulting.com/admin/content` | 비로그인 사용자는 401 |
| `https://www.ivybloomconsulting.com/<경로>` | 대표 도메인의 동일 경로로 영구 이동하도록 운영 설정 |

Search Console에는 도메인 속성 `ivybloomconsulting.com`을 추가하고 고객 DNS에 발급된 TXT를 넣는다. 확인 후 `https://ivybloomconsulting.com/sitemap.xml`을 제출하고 홈·주요 서비스·실제 게시글 URL을 검사한다. 실제 DNS 값은 Vercel과 Search Console이 제시한 값을 사용한다.

## 1. 프로젝트별로 먼저 채울 정보

| 항목 | 기록 |
|---|---|
| 프로젝트 / 운영 담당자 |  |
| 도메인 / 등록업체 / DNS 관리업체 |  |
| 호스팅 서비스 / 운영 프로젝트 / 현재 배포 주소 |  |
| 대표 주소 | `https://<대표-도메인>` |
| 보조 주소와 이동 방향 | 예: `www` → 비 `www` |
| 이메일 운영 여부와 담당자 |  |
| 관리자·비공개 경로 | 해당하는 경우만 기록 |
| 기존 사이트 주소와 이전 대상 URL | 해당하는 경우만 기록 |
| 검색 등록 계정과 소유자 |  |

고객이 소유한 도메인·호스팅·검색 등록 계정을 사용하고, 실제 관리 권한과 인계 담당자를 확인한다. 계정명은 기록하되 비밀번호·API 토큰은 이 문서에 적지 않는다.

## 2. 도메인을 바꾸기 전 완료 조건

- [x] 운영 공개 홈·관리자 로그인·이미지 업로드·글 저장·발행 API를 확인했다. 문의 폼의 실제 메시지 전달과 화면 클릭 조작은 미검증이다.
- [x] 운영 환경변수와 고객 Sanity 연결을 확인했고 게시·수정·삭제 → 공개 페이지 반영을 검증했다.
- [ ] 대표 호스트를 정했다. `www` 사용 여부와 기존 주소의 이동 방향을 결정했다.
- [ ] DNS의 현재 레코드와 네임서버를 저장했다. 특히 MX, SPF, DKIM, DMARC 등 이메일 관련 레코드를 확인했다.
- [ ] 기존 사이트가 있다면 주요 URL, 검색 유입 페이지, 리다이렉트 대응표를 확보했다.
- [ ] 연결 직후 확인할 사람, 예상 변경 시각, 장애 시 이전 DNS·배포로 되돌릴 방법을 정했다.

DNS 변경은 운영 중인 웹사이트와 이메일에 영향을 줄 수 있다. 네임서버를 옮길 때는 기존에 필요한 모든 DNS 레코드를 새 DNS 업체에 먼저 재현한다. 레코드 값과 전파 시간은 업체 안내를 따르며 임의의 IP·CNAME 값을 사용하지 않는다.

## 3. 호스팅에 도메인 등록 및 DNS 연결

1. **올바른 운영 프로젝트**에 루트 도메인과 사용할 서브도메인(예: `www`)을 등록한다.
2. 호스팅 화면이 제시하는 DNS 레코드와 소유권 확인 절차를 기록한다. 도메인 소유권 확인용 TXT와 웹사이트 연결용 A/AAAA/CNAME은 목적이 다르므로 각각 확인한다.
3. DNS 관리업체에서 필요한 레코드만 추가·수정한다. 같은 호스트의 충돌하는 웹용 레코드를 점검하고 이메일 레코드는 보존한다.
4. DNS 조회 결과와 호스팅의 도메인 상태를 확인한다. 소유권 확인, DNS 연결, HTTPS 인증서 발급은 각각 완료 여부를 확인한다.
5. 대표 주소로 이동하도록 보조 주소의 영구 리다이렉트를 설정한다. 기존 사이트를 옮겼다면 URL 대응표에 따라 개별 경로도 이동시킨다.

**Vercel을 쓰는 경우:** 해당 프로젝트의 `Settings → Domains`에서 도메인을 추가하고 화면에 표시된 레코드를 사용한다. 루트 도메인은 A, 서브도메인은 CNAME을 안내할 수 있으나 실제 제시값이 기준이다. 다른 계정에서 쓰던 도메인은 별도 소유권 확인이 필요할 수 있다.

## 4. 연결 직후 실제 주소 검증

- [ ] 대표 주소의 HTTPS 접속이 성공하고 인증서가 유효하다.
- [ ] `http`와 보조 호스트가 의도한 HTTPS 대표 주소로 이동한다. 이동 중 반복·오류가 없다.
- [ ] 홈과 주요 내부 페이지가 정상 응답하며 이미지, 폰트, 폼, API가 작동한다.
- [ ] 내부 링크·공유 미리보기·canonical·사이트맵에 이전 임시 주소가 남아 있지 않다.
- [ ] 관리자·초안·개인정보 경로는 인증과 서버 권한 검사를 통과한 사용자에게만 보인다.
- [ ] DNS 변경 후 이메일 송수신 등 기존 도메인 서비스가 정상이다.

문제가 있으면 DNS 조회, 호스팅의 도메인 상태, 인증서, 배포 로그를 따로 확인한다. 되돌릴 때는 변경 전 저장한 레코드와 배포 상태를 기준으로 복원하고 다시 접속·이메일을 검증한다.

## 5. 검색 노출을 위한 기본 점검

- [ ] 공개할 페이지가 200 응답을 반환하고, 검색을 막는 `noindex` 또는 인증 제한이 없다.
- [ ] 각 공개 페이지에 고유한 제목·설명, 읽기 쉬운 본문, 명확한 제목 계층이 있다.
- [ ] canonical은 색인 가능한 대표 URL을 가리키며 내부 링크도 같은 주소를 쓴다.
- [ ] 다국어 사이트라면 언어별 URL과 `hreflang` 관계를 실제 페이지에 맞게 설정한다.
- [ ] 이미지 대체 텍스트, 모바일 표시, 주요 성능 지표를 확인한다.
- [ ] 구조화 데이터는 페이지의 공개 내용과 일치하는 유형만 사용하고 검증 도구로 검사한다.
- [ ] `robots.txt`와 `sitemap.xml`이 대표 도메인에서 열리고, 사이트맵에는 실제 공개·색인 가능·정식 URL만 들어 있다.
- [ ] 초안, 로그인, 관리자, 404, 리다이렉트, `noindex` 페이지는 사이트맵에서 제외한다.

`robots.txt`는 크롤링 지침이며 비공개 보호나 검색 결과 삭제 수단이 아니다. 검색 제외가 필요한 공개 접근 가능 페이지에는 `noindex` 메타 태그 또는 `X-Robots-Tag`를 사용한다. 크롤러가 `noindex`를 읽어야 하므로 같은 URL을 `robots.txt`로 막지 않는다. 개인정보·관리자 데이터는 인증과 서버 권한 검사로 보호한다.

**Next.js App Router를 쓰는 경우:** `app/robots.ts`, `app/sitemap.ts`, 페이지별 metadata를 사용할 수 있다. 실제 라우트·게시 상태·대표 도메인에 맞게 생성 결과를 검사한다. 다른 프레임워크는 동등한 공개 파일과 응답 메타데이터를 사용한다.

## 6. 검색 서비스 등록

1. 도메인 소유자의 계정으로 Google Search Console에 속성을 추가한다. 가능한 경우 도메인 속성을 사용하고, 제시된 DNS TXT로 소유권을 확인한다.
2. 대표 주소의 사이트맵을 제출한다. 홈과 주요 페이지는 URL 검사로 실제 선택된 canonical·색인 가능 상태를 확인한다.
3. 필요한 URL에 색인 요청을 하고, 이후 페이지 색인 및 검색 실적 보고서를 점검한다.
4. 대상 시장에 맞춰 Bing Webmaster Tools, 네이버 서치어드바이저 등에도 소유권 확인과 사이트맵 제출을 진행한다.

소유권 확인, 사이트맵 제출, 색인 요청은 별개의 단계다. 어느 단계도 실제 색인, 순위 또는 방문자 증가를 보장하지 않는다.

## 7. AEO·GEO 콘텐츠 점검

AEO·GEO는 검색 질문과 AI 응답에서 콘텐츠를 이해하기 쉽게 만드는 운영 관점이다. 별도 등록 버튼이나 노출 보장 절차로 취급하지 않는다.

- [ ] 중요한 질문에는 페이지 본문에서 먼저 짧고 직접적으로 답한다.
- [ ] 답의 근거, 적용 범위, 제한, 출처와 수정일을 확인할 수 있게 한다.
- [ ] 서비스·제품 설명은 대상, 제공 내용, 절차, 조건을 구체적으로 적는다.
- [ ] 중요한 정보가 이미지에만 있지 않고 HTML 본문에도 있다.
- [ ] FAQ·구조화 데이터는 실제 보이는 콘텐츠와 일치한다.
- [ ] AI 크롤러 접근 여부는 콘텐츠 소유자의 정책에 따라 정한다.

운영 후에는 검색 콘솔의 노출·클릭·검색어와 실제 검색 결과를 살펴보고 필요한 공개 콘텐츠를 갱신한다. AI 검색에서의 인용 여부는 서비스마다 달라진다. Google AI 검색에는 별도 전용 스키마나 AI 텍스트 파일이 필수가 아니며, 일반 검색의 색인·콘텐츠 품질 요건을 먼저 충족한다. [Google 공식 AI 검색 안내](https://developers.google.com/search/docs/appearance/ai-features).

## 8. 출시 기록과 인계

| 확인 항목 | 결과 / 증거 URL / 담당자 |
|---|---|
| 도메인 소유권 확인 |  |
| DNS 연결 및 현재 레코드 |  |
| HTTPS 인증서와 대표 주소 이동 |  |
| 홈·주요 페이지·폼·관리자 테스트 |  |
| `robots.txt`·`sitemap.xml`·canonical |  |
| 검색 서비스 소유권 확인 |  |
| 사이트맵 제출·중요 URL 검사 |  |
| 이메일 등 기존 도메인 서비스 |  |
| 남은 문제와 재확인 날짜 |  |

인계할 때 도메인 등록업체, DNS·호스팅·검색 서비스 계정의 소유자와 관리자 권한, 변경한 레코드, 검증 결과, 미완료 항목을 함께 기록한다. 출시 후에는 색인 상태·오류·인증서·도메인 갱신 책임자를 정해 점검한다.

## 공식 참고문서

- [Vercel — 도메인 추가](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Next.js — robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js — sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Search Central — noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google Search Central — 사이트맵 만들기 및 제출](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Console](https://search.google.com/search-console/)

## 이번 배포의 제한과 후속 작업

- 2026-10-11 고객이 `OPENAI_API_KEY`를 Vercel Production에 등록한 것을 확인했다. 관리자 메뉴 수정 재배포에 설정을 반영하며, 유료 AI 글·이미지 생성 자체는 아직 호출·검증하지 않았다. 직접 작성과 이미지 업로드는 검증을 완료했다.
- 고객 도메인 DNS·HTTPS와 Search Console 소유권 확인·사이트맵 제출은 아직 실행하지 않았다. 현재 canonical과 사이트맵은 예정된 대표 도메인 `https://ivybloomconsulting.com`을 사용하므로, 검색 등록은 도메인 연결 뒤 진행한다.
- Next.js 16.3.8과 tar 패치 적용 후 운영 의존성 감사에서 critical 0개를 확인했다. Sanity 도구 의존성 등의 high 16개·moderate 10개 경고는 남아 있으며 모든 취약점이 해결된 상태로 기록하지 않는다.
- Chrome에 관리자 로그인 화면을 띄웠다. 현재 Computer Use 도구는 작업 경로의 바로가기 문제로 시작되지 않고 Chrome JavaScript 자동 제어도 허용되지 않아, 화면 클릭에 의한 편집 검증은 하지 못했다. 운영 검증은 실제 배포 주소의 로그인·저장·발행 요청과 공개 응답으로 수행한다.

### 운영 글 반영 방식

발행 전 방문한 글 주소의 404가 운영 캐시에 남는 현상을 실제 검증에서 발견했다. 공개 글 상세·목록과 사이트맵은 최신 Sanity 데이터를 조회하도록 수정했고, 최종 배포에서 초안 404 → 발행 200 → 수정 재발행 반영 → 삭제 404 흐름을 확인했다. 테스트 문서는 검색 제외로 만들었고, 검증 후 문서와 전용 이미지 모두 삭제했다. 기존 고객 자료는 보존했다.

### 2026-10-11 관리자 상단 메뉴 수정

관리자 레이아웃에 홈페이지 공용 `Nav`를 추가했다. 고정 메뉴 높이 64px만큼 관리자 화면의 시작 위치를 내렸고, 사이드바의 기존 위치와 맞췄다. 고객 Vercel에 재배포한 뒤 실제 로그인 상태의 `/admin`, `/admin/write`, `/admin/mypage` 응답에서 홈페이지 메뉴, 상단 여백, 관리자 내용, 검색 제외 헤더를 확인했다. API 키 등록과 배포 반영은 확인했지만 유료 AI 생성은 호출하지 않았다.
