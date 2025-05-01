// Type definitions for Vite environment variables
// No external references to avoid missing dependency errors

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}