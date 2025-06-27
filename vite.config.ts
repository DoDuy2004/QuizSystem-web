import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  // define: {
  //   global: "window", 
  // },
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "@mui/icons-material",
      "@mui/material",
      "@mui/base",
      "@mui/styles",
      "@mui/system",
      "@mui/utils",
      "@emotion/cache",
      "@emotion/react",
      "@emotion/styled",
      "date-fns",
      "lodash",
    ],
    exclude: [],
    esbuildOptions: {},
  },
});
