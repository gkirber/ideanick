/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_WEBAPP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
