import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add ignores as the first item in the array
  {
    ignores: [
      ".next/**",           // Ignore the entire .next directory
      "node_modules/**",    // Ignore node_modules
      "dist/**",            // Build outputs
      "build/**",           // Alternative build folder
      "coverage/**",        // Test coverage reports
      "*.min.js",           // Minified files
      "**/*.min.js",
      ".turbo/**",          // Turbopack cache
      ".vercel/**"          // Vercel build cache
    ]
  },
  // Your existing configs follow
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;