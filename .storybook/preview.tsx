import type { Preview } from '@storybook/react-vite'
import './theme.css'

/**
 * 전역 라이트/다크 테마 토글(툴바). 개별 스토리가 Light/Dark 버전을 따로 만들 필요 없이,
 * 이 데코레이터가 감싸는 컨테이너에 data-theme을 걸어 하위 전체를 스코프한다 — 실제 앱에서
 * <html data-theme="dark">를 거는 것과 같은 메커니즘이다(front/src/index.css 참고).
 * "테마"는 그래서 별도 파운데이션 카테고리가 아니라 이 툴바 하나로 전체 스토리에 적용된다.
 */
const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      // 큰 단위(레이아웃) -> 조합(패턴) -> 개별 컴포넌트 -> 토큰(파운데이션) 순.
      // 그룹 안에서는 알파벳순(영어가 한글보다 코드값이 작아 자연히 영어 먼저 -> 한글 순으로 정렬된다) —
      // 컴포넌트/파운데이션처럼 실제 컴포넌트·토큰 이름을 그대로 쓰는 곳은 영문이라 이 규칙을 그대로 따르고,
      // 레이아웃/패턴처럼 우리가 직접 이름 붙인 시나리오는 전부 한글이라 이 규칙과 무관하게 한글끼리 알파벳(가나다)순이 된다.
      // 다만 레이아웃 안에서는 "로그인"이 맨 위로 오도록 예외로 순서를 지정한다.
      storySort: {
        method: 'alphabetical',
        order: ['레이아웃', ['로그인', '기본틀', '검색'], '패턴', '컴포넌트', '파운데이션'],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: '라이트/다크 테마',
      toolbar: {
        title: '테마',
        icon: 'mirror',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme}
        style={{ minHeight: '100vh', background: 'var(--ds-surface)', color: 'var(--ds-text)', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
