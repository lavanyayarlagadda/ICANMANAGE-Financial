/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_PROD: string;
  readonly VITE_API_URL_TEST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
