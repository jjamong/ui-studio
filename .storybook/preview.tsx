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
