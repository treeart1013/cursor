# Chatmon

기업용 맞춤 AI 검색 솔루션 'Chatmon'의 프론트엔드 프로젝트입니다. Vue.js 3, Vite, TypeScript를 기반으로 구축되었으며, 두 개의 AI 모델 응답을 동시에 비교할 수 있는 듀얼 채팅 인터페이스를 제공합니다.

![Chatmon UI](https://i.ibb.co/tBSd9mQ/image.png)

## 1. 초기 프로젝트 설정

본 프로젝트는 다음의 주요 기술 스택으로 구성되어 있습니다:

-   **프레임워크**: Vue.js 3 (Composition API, `<script setup>`)
-   **빌드 도구**: Vite
-   **언어**: TypeScript
-   **라우팅**: Vue Router
-   **상태 관리**: Pinia
-   **API 통신**: Server-Sent Events (SSE) via `@microsoft/fetch-event-source`

## 2. 기본 구조 및 컴포넌트 설명

프로젝트의 소스 코드는 `src` 디렉터리 내에 기능별로 체계적으로 구성되어 있습니다.

-   `main.ts`: 애플리케이션의 진입점(Entry Point). Vue 인스턴스, 라우터, Pinia 스토어를 초기화합니다.
-   `router/index.ts`: Vue Router를 설정하여 페이지 간의 내비게이션을 관리합니다. (e.g., `/`, `/login`)
-   `stores/auth.ts`: Pinia를 사용하여 사용자 인증 상태(로그인 여부, 사용자 정보)를 전역적으로 관리합니다.
-   `services/api.ts`: 백엔드 API와의 통신 로직을 담당합니다. SSE 연결을 통해 실시간으로 응답을 스트리밍합니다.
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

## 3. API 연동 및 핵심 로직

### API 통신 (SSE)

-   `@microsoft/fetch-event-source` 라이브러리를 사용하여 Server-Sent Events(SSE) 방식으로 서버와 통신합니다.
-   이를 통해 AI의 응답이 생성되는 대로 실시간으로 토큰 단위로 받아와 사용자에게 즉각적으로 보여줄 수 있어, 긴 답변을 기다리는 지연 시간을 최소화합니다.
-   `services/api.ts`의 `fetchChatResponse` 함수에서 SSE 연결 및 이벤트(onopen, onmessage, onerror, onclose) 처리를 담당합니다.

### 상태 관리

-   **채팅 상태**: 메인 페이지인 `HomeView.vue` 내에서 `ref`를 사용하여 채팅 메시지, 현재 선택된 모델, 로딩 상태 등을 지역적으로 관리합니다.
-   **인증 상태**: 사용자의 로그인 정보와 같은 전역 상태는 Pinia를 이용해 `stores/auth.ts`에서 중앙 관리합니다. 라우터 가드(`router/index.ts`)는 이 스토어의 상태를 확인하여 인증되지 않은 사용자의 접근을 로그인 페이지로 리디렉션합니다.

## 4. 주요 기능

-   **듀얼 채팅 인터페이스**: 두 개의 다른 AI 모델의 응답을 나란히 비교하며 확인할 수 있습니다.
-   **실시간 응답 스트리밍**: SSE를 통해 AI의 답변이 생성되는 과정을 실시간으로 볼 수 있습니다.
-   **현대적인 UI/UX**:
    -   세련된 로고 및 전체적인 디자인 테마 적용
    -   입력 내용에 따라 높이가 자동으로 조절되는 `textarea`
    -   AI 응답 메시지에 대한 '복사' 버튼 제공
    -   상태(로딩, 비활성화)에 따라 동적으로 변경되는 입력창 및 버튼
-   **사용자 인증**: 로그인/로그아웃 기능 및 페이지 접근 제어.
-   **채팅 관리**: 사이드바에서 새 채팅을 시작하고, 기존 채팅의 이름을 변경하거나 삭제할 수 있습니다.

## 5. 프로젝트 설정 및 실행 방법

### 의존성 설치

프로젝트 루트 디렉터리에서 아래 명령어를 실행하여 필요한 모든 패키지를 설치합니다.

```bash
npm install
```

### 환경 변수 설정

API 서버의 주소를 설정하기 위해 프로젝트 루트에 `.env` 파일을 생성하고 아래와 같이 내용을 작성합니다.

```
VITE_API_HOST=http://localhost:8080
```

### 사용 가능한 스크립트

-   **개발 서버 실행**:
    ```bash
    npm run dev
    ```
-   **프로덕션 빌드**:
    ```bash
    npm run build
    ```
-   **코드 린팅**:
    ```bash
    npm run lint
    ```