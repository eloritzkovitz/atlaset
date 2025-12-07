import { defineConfig } from "electron-vite";

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "electron/main.ts",
      },
    },
  },  
});
