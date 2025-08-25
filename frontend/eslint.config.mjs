import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Запретить console методы
      "no-console": "error",

      // Для всех комментариев можно использовать кастомное правило
      // Временно закомментировано, так как нет стандартного правила для всех комментариев
      // "no-warning-comments": [
      //   "error",
      //   {
      //     "terms": [""], // пустая строка не сработает для всех комментариев
      //     "location": "anywhere"
      //   }
      // ],

      // Можно также добавить правило для debugger
      "no-debugger": "error",

      // Запретить alert, confirm, prompt
      "no-alert": "error",
    },
  },
];

export default eslintConfig;
