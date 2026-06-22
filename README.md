Artlog Frontend

Artlog Frontend는 전시 관람 경험, 작품 기록, 감상문을 기록하고 공개 감상을 공유할 수 있는 문화예술 기록 서비스 Artlog의 사용자 화면입니다.

React와 TypeScript 기반으로 구현했으며, 사용자는 전시 기록, 작품 기록, 감상 기록을 작성하고 관리할 수 있습니다. 또한 공개 감상 목록을 조회하고 좋아요, 북마크, 댓글을 통해 다른 사용자의 감상에 반응할 수 있습니다.

⸻

프로젝트 목적

Artlog Frontend는 사용자가 자신의 문화예술 경험을 직관적으로 기록하고 탐색할 수 있도록 하는 것을 목표로 합니다.

주요 목적은 다음과 같습니다.

* 전시 관람 기록 작성 및 관리
* 작품 기록 작성 및 관리
* 감상문 작성 및 공개 설정
* 공개 감상 피드 탐색
* 좋아요, 북마크, 댓글 기능 제공
* 개인 통계 시각화
* 캘린더 기반 관람 기록 확인
* 반응형 UI 기반 사용자 경험 개선
* AWS EC2 기반 배포 환경 구성
* GitHub Actions 기반 CI/CD 자동 배포 구성

⸻

기술 스택

Frontend

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* CSS

Deployment

* Docker
* Nginx
* Docker Compose
* AWS EC2

CI/CD

* GitHub Actions
* SSH 기반 EC2 자동 배포
* Docker Compose 기반 Frontend 컨테이너 재빌드 및 재시작

⸻

주요 기능

인증 화면

* 회원가입
* 로그인
* JWT 기반 로그인 상태 유지
* 로그인 사용자 기준 화면 분기
* Protected Route 적용

홈 화면

* 로그인 여부에 따른 홈 화면 분기
* 내 기록 요약 정보 표시
* 최근 작성한 감상 기록 표시
* 최근 공개 감상 기록 표시

전시 기록 화면

* 전시 기록 목록 조회
* 전시 기록 상세 조회
* 전시 기록 등록
* 전시 기록 수정
* 전시 기록 삭제
* 전시 검색 및 필터링
* 페이징 처리

작품 기록 화면

* 특정 전시에 대한 작품 기록 조회
* 작품 기록 등록
* 작품 기록 상세 조회
* 작품 기록 수정
* 작품 기록 삭제
* 작품 검색 및 필터링

감상 기록 화면

* 전시 감상 작성
* 작품 감상 작성
* 감상 기록 상세 조회
* 감상 기록 수정
* 감상 기록 삭제
* 공개 / 비공개 설정
* 다중 이미지 업로드
* 감정 태그 설정
* 재방문 의사 설정
* 평점 입력

공개 감상 화면

* 공개 감상 목록 조회
* 공개 감상 상세 조회
* 좋아요
* 좋아요 취소
* 북마크
* 북마크 취소
* 댓글 작성
* 댓글 삭제

마이페이지

* 내 정보 조회
* 닉네임 수정
* 비밀번호 변경
* 내가 북마크한 감상 목록 조회

통계 화면

* 전체 기록 요약
* 월별 관람 횟수
* 자주 방문한 미술관
* 평점 분포
* 감정 태그 통계

캘린더 화면

* 날짜별 전시 관람 기록 확인
* 월 단위 기록 확인
* 특정 날짜의 기록 목록 확인

UI 피드백

* Toast 메시지
* Confirm Modal
* 삭제 확인 모달
* API 요청 성공 / 실패 피드백

⸻

배포 구조

Artlog Frontend는 Vite로 빌드한 정적 파일을 Nginx 컨테이너에서 서빙합니다.

사용자
  ↓
EC2 Public IP
  ↓
Frontend Container - Nginx + React Build File
  ↓
Backend Container - Spring Boot API
  ↓
AWS RDS MySQL

배포 방식

* React 프로젝트를 Vite로 빌드
* 빌드 결과물인 dist 디렉터리를 Nginx 컨테이너에 복사
* Docker Compose를 통해 Frontend 컨테이너 실행
* Backend API 주소는 VITE_API_BASE_URL 환경변수로 관리

⸻

CI/CD

GitHub Actions를 사용하여 main 브랜치에 코드가 반영되면 EC2 서버에 자동 배포되도록 구성했습니다.

Frontend 배포 흐름

main 브랜치 push 또는 merge
  ↓
GitHub Actions 실행
  ↓
EC2 서버 SSH 접속
  ↓
Frontend Repository 최신 코드 pull
  ↓
Docker Compose로 Frontend 이미지 재빌드
  ↓
Frontend 컨테이너 재시작
  ↓
Frontend Health Check 수행

GitHub Actions 주요 작업

* EC2 SSH 접속
* git pull origin main
* docker compose build frontend
* docker compose up -d frontend
* curl http://localhost:3000 기반 배포 확인
* 사용하지 않는 Docker 이미지 정리

⸻

환경변수

Frontend는 API 서버 주소를 환경변수로 관리합니다.

로컬 환경

VITE_API_BASE_URL=http://localhost:8080

배포 환경

VITE_API_BASE_URL=http://13.125.206.86:8080

⸻

로컬 실행 방법

1. 패키지 설치

npm install

2. 개발 서버 실행

npm run dev

기본 실행 주소는 다음과 같습니다.

http://localhost:5173

3. 프로덕션 빌드

npm run build

4. 빌드 결과 미리보기

npm run preview

⸻

Docker 실행 방법

이미지 빌드

docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080 \
  -t artlog-frontend .

컨테이너 실행

docker run -p 3000:80 artlog-frontend

실행 후 아래 주소에서 확인할 수 있습니다.

http://localhost:3000

⸻

배포 서버 접속 주소

현재 배포된 Frontend는 아래 주소에서 확인할 수 있습니다.

http://13.125.206.86:3000

Backend API 문서는 아래 주소에서 확인할 수 있습니다.

http://13.125.206.86:8080/swagger-ui.html

⸻

배포 관련 트러블슈팅 경험

프로젝트를 AWS EC2 환경에 배포하는 과정에서 다음 문제를 직접 해결했습니다.

* Vite 환경변수 기반 API 서버 주소 설정
* Dockerfile을 통한 React 빌드 및 Nginx 서빙 구성
* Nginx에서 React Router 새로고침 시 404가 발생하지 않도록 try_files 설정
* EC2 보안 그룹 포트 설정
* Backend CORS Origin 설정
* GitHub Actions SSH 배포 키 설정
* GitHub Actions에서 EC2 접근을 위한 보안 그룹 설정
* Docker Compose 기반 Frontend / Backend 컨테이너 연동
* 배포 후 API 요청 주소가 localhost로 향하는 문제 해결

⸻

프로젝트 의의

Artlog Frontend는 단순한 화면 구현을 넘어, 실제 배포 환경을 고려한 프론트엔드 애플리케이션입니다.

React와 TypeScript를 기반으로 사용자 인증, 기록 관리, 공개 감상 조회, 좋아요, 북마크, 댓글, 통계, 캘린더 기능을 구현했습니다. 또한 Docker와 Nginx를 활용하여 정적 파일 배포 환경을 구성하고, GitHub Actions를 통해 EC2 자동 배포 파이프라인을 구축했습니다.

이를 통해 프론트엔드 개발뿐만 아니라 API 연동, 배포 환경 구성, CI/CD 자동화까지 전체 서비스 흐름을 경험했습니다.
