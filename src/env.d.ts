/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_OIDC_AUTHORITY_SERVER: string
  readonly VITE_OIDC_SCOPE: string
  readonly VITE_OIDC_CLIENT_ID: string
  readonly VITE_DEFAULT_LANG: 'en' | 'zh-Hans'
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
