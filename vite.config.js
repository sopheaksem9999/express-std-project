import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
