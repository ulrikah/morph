import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    if (command === "build") {
        return {
            build: { sourcemap: true },
            base: command === "build" ? "/morph/" : "/",
        };
    } else {
        return { build: { sourcemap: true } };
    }
});
