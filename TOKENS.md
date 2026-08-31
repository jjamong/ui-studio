# 디자인 토큰 계약 (Token Contract)

`ui-studio`의 컴포넌트는 색상·글자크기 값을 직접 갖지 않는다. 전부 아래 CSS 커스텀 프로퍼티(`var(--...)`)나
Tailwind 유틸리티 클래스 이름만 참조하므로, **이 패키지를 쓰는 프로젝트는 자기 테마 파일에서 이 이름들을
반드시 정의**해야 한다. 값(색상 hex, 폰트 크기 rem 등)은 프로젝트마다 완전히 달라도 되고, 그게 이 패키지의
핵심 설계 의도다 — 컴포넌트 재사용, 테마는 자유.

## 1. 색상/보더/그림자 토큰 (`--ds-*`)

Atlaskit Design Tokens(`@atlaskit/tokens`)의 변수 이름 규칙을 그대로 차용했다. Atlaskit을 쓰는 프로젝트는
`setGlobalTheme()` 한 줄로 아래 변수가 전부 자동 주입되고, Atlaskit을 안 쓰는 프로젝트는 직접 `:root`에
같은 이름으로 정의하면 된다.

| 카테고리 | 변수 |
|---|---|
| 배경(브랜드/주요 액션) | `--ds-background-brand-bold`, `--ds-background-brand-bold-hovered` |
| 배경(중립) | `--ds-background-neutral`, `--ds-background-neutral-hovered` |
| 배경(위험) | `--ds-background-danger`, `--ds-background-danger-hovered` |
| 배경(선택됨) | `--ds-background-selected` |
| 배경(정보/성공 — Toast용) | `--ds-background-information`, `--ds-background-success` |
| 배경(비활성) | `--ds-background-disabled` |
| 서페이스 | `--ds-surface`, `--ds-surface-sunken`, `--ds-surface-overlay` |
| 스켈레톤 | `--ds-skeleton` |
| 모달/블랭킷(배경 딤) | `--ds-blanket` |
| 텍스트 | `--ds-text`, `--ds-text-subtle`, `--ds-text-subtlest`, `--ds-text-disabled`, `--ds-text-inverse`, `--ds-text-selected` |
| 텍스트(위험/정보/성공 — Toast용) | `--ds-text-danger`, `--ds-text-information`, `--ds-text-success` |
| 아이콘 | `--ds-icon-brand` |
| 보더 | `--ds-border`, `--ds-border-focused`, `--ds-border-danger` |
| 보더(정보/성공 — Toast용) | `--ds-border-information`, `--ds-border-success` |
| 그림자 | `--ds-shadow-raised`, `--ds-shadow-overlay` |

## 2. 타이포그래피 스케일 (`--text-*`)

Tailwind v4의 `@theme` 블록에서 아래 이름으로 글자 크기(및 line-height)를 정의해야 `text-2xs` 같은 유틸리티
클래스가 실제로 생성된다. 값은 예시일 뿐 프로젝트마다 자유롭게 조정 가능하다.

```css
@theme {
  --text-2xs: 0.625rem;
  --text-2xs--line-height: 0.9rem;
  --text-xs: 0.6875rem;
  --text-xs--line-height: 1rem;
  --text-sm: 0.75rem;
  --text-sm--line-height: 1.1rem;
  --text-base: 0.8125rem;
  --text-base--line-height: 1.2rem;
}
```

`Modal`은 `text-base`를, 나머지 대부분 컴포넌트는 `text-2xs`/`text-xs`/`text-sm`를 쓴다. 글자 굵기는 Tailwind
기본 유틸리티(`font-medium`/`font-semibold`/`font-bold`)를 그대로 쓰므로 별도 토큰이 필요 없다.

## 3. 모서리(radius) 스케일

Tailwind v4의 `@theme` 블록에서 아래 이름으로 정의하면 `rounded-sm` 같은 유틸리티가 실제로 생성된다.
값은 예시이며 프로젝트마다 조정 가능하다. (지금 컴포넌트 대부분은 아직 Tailwind 기본값인 `rounded`를
쓰고 있어 이 스케일에 걸리지 않는다 — 새로 만드는 컴포넌트부터 아래 이름을 쓰기를 권장한다.)

```css
@theme {
  --radius-sm: 0.25rem;  /* 4px — 배지, 인풋 */
  --radius-md: 0.375rem; /* 6px — 카드, 팝오버 */
  --radius-lg: 0.625rem; /* 10px — 모달 */
  --radius-full: 9999px; /* 완전한 원형(아바타, 스위치 등) */
}
```

## 4. z-index 스케일 (`--ds-z-*`)

겹쳐 뜨는 UI(드롭다운/토스트/모달/로딩바)가 서로 올바른 순서로 쌓이도록 하는 공용 스케일. 컴포넌트마다
숫자를 따로 정하면 나중에 순서가 꼬이기 쉬우므로 이 이름들을 그대로 쓴다.

| 변수 | 값 | 쓰는 곳 |
|---|---|---|
| `--ds-z-dropdown` | 50 | `CustomSelect` 팝업, `Popover`, `DropdownMenu`, `Tooltip` |
| `--ds-z-toast` | 100 | `Toast` |
| `--ds-z-modal` | 150 | `Modal` |
| `--ds-z-route-loading` | 200 | `RouteLoadingBar` (항상 최상단) |

## 5. 모션(motion) 토큰 (`--ds-motion-*`)

전환 애니메이션의 속도/이징을 통일하기 위한 값. Tailwind의 `duration-*`/`ease-*` 유틸리티가 아니라
`transition-[...] duration-[var(--ds-motion-duration-base)]`처럼 임의값 문법으로 참조한다.

```css
:root {
  --ds-motion-duration-fast: 120ms;  /* 호버/포커스처럼 즉각 반응해야 하는 것 */
  --ds-motion-duration-base: 200ms;  /* 대부분의 전환(배경색, 트리 접힘/펼침 폭 등) */
  --ds-motion-duration-slow: 320ms;  /* 모달/오버레이 등 큰 요소의 등장 */
  --ds-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

## 6. 간격(spacing)

별도의 `--ds-spacing-*` 토큰을 두지 않는다 — Tailwind v4는 `p-4`, `gap-2`, `h-8` 같은 모든 간격
유틸리티가 하나의 `--spacing` 배수(기본 0.25rem)에서 파생되므로, 이미 그 자체로 토큰이다. 컴포넌트
전체의 간격 밀도를 한 번에 바꾸고 싶으면 소비 프로젝트의 `@theme` 블록에서 `--spacing` 값 하나만
재정의하면 된다.

```css
@theme {
  --spacing: 0.25rem; /* 기본값. 예: 0.2rem으로 낮추면 전체가 더 촘촘해짐 */
}
```

## 7. Tailwind 설정

컴포넌트가 컴파일된 `dist/`의 JS 파일에는 Tailwind 클래스 문자열이 그대로 들어있다. Tailwind는 기본적으로
`node_modules`를 스캔하지 않으므로, 소비하는 프로젝트의 CSS 진입점에 아래처럼 스캔 대상을 추가해야
`ui-studio`가 쓰는 클래스가 purge되지 않는다.

```css
@import "tailwindcss";
@source "../node_modules/ui-studio/dist";
```

## 4. `RouteLoadingBar` 전용 CSS

`RouteLoadingBar`는 `.route-loading-bar-fill` 클래스에 걸린 CSS 애니메이션에 의존한다. Tailwind 유틸리티가
아니라 순수 CSS라서, 소비 프로젝트의 전역 CSS에 아래 keyframes를 직접 추가해야 한다.

```css
@keyframes route-loading-bar-grow {
  0% {
    width: 0%;
    opacity: 1;
  }
  80% {
    width: 80%;
  }
  100% {
    width: 90%;
  }
}

.route-loading-bar-fill {
  width: 0%;
  animation: route-loading-bar-grow 3.5s cubic-bezier(0.1, 0.6, 0.3, 1) forwards;
}
```
