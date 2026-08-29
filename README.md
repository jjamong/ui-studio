# ui-studio

jjamong 프로젝트들(asset-studio, post_studio, ...)이 공유하는 UI 컴포넌트 킷. `asset-studio`에서 다듬은
공용 컴포넌트 구조를 초안으로 뽑아냈다.

## 설계 원칙

1. **컴포넌트는 값을 갖지 않는다.** 색상·글자크기는 전부 CSS 변수/Tailwind 유틸리티 "이름"만 참조한다.
   실제 값(hex, rem)은 이 패키지를 설치하는 프로젝트가 자기 테마에서 정의한다. 필요한 변수 전체 목록은
   [TOKENS.md](./TOKENS.md) 참고.
2. **라우터 등 프레임워크에 종속되지 않는다.** 예: `RouteLoadingBar`는 내부에서 `react-router`나
   `next/navigation`을 직접 import하지 않고 `pathname`을 prop으로 받는다. 소비 프로젝트가 자기 라우터의
   훅 값을 넘겨준다.
3. **react, react-dom, lucide-react는 peerDependency.** 소비 프로젝트가 이미 설치한 버전을 그대로 쓰고,
   React 인스턴스가 중복되지 않게 한다.

## 포함된 컴포넌트

`Button`, `Input`, `Select`, `CustomSelect`, `TextArea`, `Switch`, `Skeleton`, `Pagination`,
`SearchActionBar`, `LoadingSpinner`, `Modal`, `Toast`, `RouteLoadingBar`.

레이아웃(사이드바/탑바처럼 프로젝트마다 네비게이션 구성이 다른 것)은 의도적으로 포함하지 않았다 —
공용화하려면 "뼈대 컴포넌트 + 네비 항목/로고는 prop으로 주입" 형태로 별도 설계가 필요하다.

## 설치 (초안 단계 — 아직 GitHub에 push 전)

로컬에서 같은 머신에 있는 동안은 `file:` 의존성으로 바로 쓸 수 있다:

```json
{
  "dependencies": {
    "ui-studio": "file:../ui-studio"
  }
}
```

나중에 GitHub 저장소로 옮기면 태그 기반 git 의존성으로 전환한다 (다른 머신/서버에서도 동작):

```json
{
  "dependencies": {
    "ui-studio": "github:jjamong/ui-studio#v0.1.0"
  }
}
```

## 개발

```bash
npm install
npm run dev     # tsup --watch
npm run build   # dist/ 생성
npm run typecheck
```

## 소비 프로젝트에서 해야 할 설정

1. [TOKENS.md](./TOKENS.md)의 `--ds-*`, `--text-*` 변수를 자기 테마에 정의.
2. Tailwind CSS 진입점에 `@source "../node_modules/ui-studio/dist";` 추가 (v4 기준).
3. `RouteLoadingBar`를 쓴다면 TOKENS.md에 있는 keyframes CSS를 전역 CSS에 추가.
