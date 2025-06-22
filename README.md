# Chatmon

기업용 맞춤 AI 검색 솔루션 'Chatmon'의 프론트엔드 프로젝트입니다. Vue.js 3, Vite, TypeScript를 기반으로 구축되었으며, 두 개의 AI 모델 응답을 동시에 비교할 수 있는 듀얼 채팅 인터페이스를 제공합니다.

![Chatmon UI](https://i.ibb.co/tBSd9mQ/image.png)

## 1. 주요 기술 스택

-   **프레임워크**: Vue.js 3 (Composition API, `<script setup>`)
-   **빌드 도구**: Vite
-   **언어**: TypeScript
-   **라우팅**: Vue Router
-   **상태 관리**: Pinia
-   **API 통신**: Server-Sent Events (SSE) via `@microsoft/fetch-event-source`
-   **테스팅**: Vitest, Vue Test Utils

## 2. 초기 프로젝트 설정 가이드

이 섹션에서는 프로젝트를 로컬 환경에 설정하고 실행하는 방법을 안내합니다.

### 2.1. 사전 준비사항

-   [Node.js](https://nodejs.org/ko/) `v18.x` 이상 버전이 설치되어 있어야 합니다.
-   `npm` (Node.js 설치 시 자동으로 설치됨)

### 2.2. 의존성 패키지 설치

프로젝트 루트 디렉터리(`chatmon/`)에서 아래 명령어를 실행하여 필요한 모든 패키지를 설치합니다.

```bash
npm install
```

<details>
<summary><b>👉 `npm install` 실행 중 오류가 발생하나요? (클릭하여 확인)</b></summary>

가끔 `npm` 버전이나 캐시 문제로 인해 `Invalid dependency type requested: alias`와 같은 오류가 발생할 수 있습니다. 이 경우, 아래 방법을 순서대로 시도해 보세요.

1.  **기존 `node_modules`와 `package-lock.json` 삭제 후 재설치 (가장 추천하는 방법)**
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

2.  **npm 캐시 정리 후 재설치**
    ```bash
    npm cache clean --force
    npm install
    ```
</details>

### 2.3. 환경 변수 설정

API 서버 주소와 같은 민감한 정보는 `.env` 파일을 통해 관리합니다. 프로젝트 루트에 `.env.example` 파일을 복사하여 `.env` 파일을 생성하세요.

```bash
# Unix/macOS
cp .env.example .env

# Windows
copy .env.example .env
```

그런 다음, 생성된 `.env` 파일을 열어 아래와 같이 환경에 맞는 API 서버 주소를 입력합니다.

```
VITE_API_HOST=http://localhost:8080
```

> **⚠️ 중요**: `.env` 파일은 보안상의 이유로 Git에서 추적하지 않습니다. (`.gitignore`에 등록됨)

## 3. 주요 스크립트 실행

`package.json`에 정의된 주요 스크립트 목록입니다.

-   **`npm run dev`**: **개발 서버 실행**
    -   Vite 개발 서버를 시작합니다. 파일이 변경되면 자동으로 새로고침(HMR) 기능이 적용됩니다.

-   **`npm run test`**: **단위/컴포넌트 테스트 실행**
    -   Vitest를 사용하여 작성된 테스트 코드를 실행합니다.

-   **`npm run build`**: **프로덕션 빌드**
    -   배포를 위한 최적화된 정적 파일을 `dist/` 폴더에 생성합니다.

-   **`npm run lint`**: **코드 정적 분석**
    -   ESLint 규칙에 따라 코드 스타일과 잠재적인 오류를 검사합니다.

-   **`npm run format`**: **코드 자동 포맷팅**
    -   Prettier 규칙에 따라 전체 코드의 스타일을 자동으로 정리합니다.


## 4. 프로젝트 구조

프로젝트의 소스 코드는 `src` 디렉터리 내에 기능별로 체계적으로 구성되어 있습니다.

-   `main.ts`: 애플리케이션의 진입점(Entry Point). Vue 인스턴스, 라우터, Pinia 스토어를 초기화합니다.
-   `router/index.ts`: Vue Router를 설정하여 페이지 간의 내비게이션을 관리합니다. (e.g., `/`, `/login`)
-   `stores/auth.ts`: Pinia를 사용하여 사용자 인증 상태(로그인 여부, 사용자 정보)를 전역적으로 관리합니다.
-   `services/api.ts`: 백엔드 API와의 통신 로직을 담당합니다. SSE 연결을 통해 실시간으로 응답을 스트리밍합니다.
-   `composables/useChat.ts`: 채팅 관련 상태와 로직을 모아둔 컴포저블 함수입니다.
-   `views/`: 주요 페이지 컴포넌트가 위치합니다.
    -   `HomeView.vue`: 메인 채팅 페이지. 사이드바, 헤더, 채팅창 등 모든 핵심 컴포넌트를 조합하여 전체 레이아웃을 구성하고, 채팅 관련 상태를 관리합니다.
    -   `LoginView.vue`: 사용자가 ID와 비밀번호를 입력하여 로그인하는 페이지입니다.
-   `components/`: 재사용 가능한 UI 단위 컴포넌트가 위치합니다.
    -   `CommonHeader.vue`: 애플리케이션의 최상단 헤더. 로고, 모델 비교 토글, 사용자 정보 및 로그아웃 버튼을 포함합니다.
    -   `SidebarMenu.vue`: 좌측 사이드바. 새 채팅 시작, 채팅 목록 관리(이름 변경, 삭제) 기능을 제공합니다.
    -   `ChatHeader.vue`: 각 채팅창의 헤더. 현재 선택된 AI 모델을 표시하고 변경할 수 있습니다.
    -   `ChatWindow.vue`: 대화 내용이 표시되는 창. 사용자 메시지와 AI 응답을 구분하여 보여줍니다.
    -   `ChatInput.vue`: 메시지 입력창. 자동 높이 조절, 전송 버튼 활성화/비활성화 로직을 포함합니다.
    -   `HtmlRenderer.vue`: AI가 생성한 HTML 형식의 응답을 안전하게 렌더링합니다.
-   `tests/`: Vitest 테스트 코드가 위치합니다. (예정)

## 5. 주요 기능

-   **듀얼 채팅 인터페이스**: 두 개의 다른 AI 모델의 응답을 나란히 비교하며 확인할 수 있습니다.
-   **실시간 응답 스트리밍**: SSE를 통해 AI의 답변이 생성되는 과정을 실시간으로 볼 수 있습니다.
-   **현대적인 UI/UX**:
    -   세련된 로고 및 전체적인 디자인 테마 적용
    -   입력 내용에 따라 높이가 자동으로 조절되는 `textarea`
    -   AI 응답 메시지에 대한 '복사' 버튼 제공
    -   상태(로딩, 비활성화)에 따라 동적으로 변경되는 입력창 및 버튼
-   **사용자 인증**: 로그인/로그아웃 기능 및 페이지 접근 제어.
-   **채팅 관리**: 사이드바에서 새 채팅을 시작하고, 기존 채팅의 이름을 변경하거나 삭제할 수 있습니다.