# React + Webpack з нуля: Повний покроковий гайд

## Зміст

1. [Навіщо Webpack, якщо є Vite/CRA?](#1-навіщо-webpack)
2. [Ініціалізація проєкту](#2-ініціалізація-проєкту)
3. [Встановлення залежностей](#3-встановлення-залежностей)
4. [Структура проєкту](#4-структура-проєкту)
5. [TypeScript конфігурація](#5-typescript-конфігурація)
6. [Babel конфігурація](#6-babel-конфігурація)
7. [Webpack: спільний конфіг (common)](#7-webpack-спільний-конфіг)
8. [Webpack: dev конфіг](#8-webpack-dev-конфіг)
9. [Webpack: prod конфіг](#9-webpack-prod-конфіг)
10. [ESLint конфігурація](#10-eslint-конфігурація)
11. [Prettier конфігурація](#11-prettier-конфігурація)
12. [Тестування (Jest + React Testing Library)](#12-тестування)
13. [Скрипти package.json](#13-скрипти-packagejson)
14. [Довідник: що робить кожен пакет](#14-довідник-пакетів)
15. [Запуск та перевірка](#15-запуск-та-перевірка)

---

## 1. Навіщо Webpack?

Create React App (CRA) — мертвий проєкт, який більше не підтримується. Vite — чудова альтернатива для більшості випадків. Але Webpack все ще потрібен, коли:

- Потрібен тонкий контроль над збіркою (Module Federation, складні chunk-стратегії)
- Працюєш із legacy-проєктом
- Потрібна інтеграція з нестандартними інструментами/плагінами
- Хочеш розуміти, як працює збірка "під капотом"

Цей гайд використовує **Webpack 5** — актуальну на 2025–2026 рр. версію.

---

## 2. Ініціалізація проєкту

```bash
mkdir my-react-app && cd my-react-app
pnpm init
git init
```

Створи `.gitignore`:

```
node_modules/
dist/
coverage/
.env
.env.local
*.log
```

---

## 3. Встановлення залежностей

### 3.1. React

```bash
pnpm add react react-dom
```

### 3.2. TypeScript

```bash
pnpm add -D typescript @types/react @types/react-dom
```

### 3.3. Babel (транспіляція JSX/TS → JS)

```bash
pnpm add -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
```

### 3.4. Webpack (ядро та інструменти)

```bash
pnpm add -D webpack webpack-cli webpack-dev-server webpack-merge
```

### 3.5. Webpack плагіни

```bash
pnpm add -D html-webpack-plugin mini-css-extract-plugin css-minimizer-webpack-plugin terser-webpack-plugin copy-webpack-plugin dotenv-webpack fork-ts-checker-webpack-plugin
```

### 3.6. Webpack лоадери

```bash
pnpm add -D css-loader style-loader sass sass-loader file-loader @svgr/webpack
```

### 3.7. ESLint + Prettier

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier prettier
```

### 3.8. Тестування

```bash
pnpm add -D jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

---

## 4. Структура проєкту

```
my-react-app/
├── config/
│   ├── webpack.common.js      # спільні налаштування
│   ├── webpack.dev.js          # dev-специфічні
│   └── webpack.prod.js         # prod-специфічні
├── public/
│   ├── index.html              # HTML-шаблон
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── App/
│   │       ├── App.tsx
│   │       ├── App.module.scss
│   │       └── App.test.tsx
│   ├── index.tsx               # точка входу
│   ├── styles/
│   │   └── global.scss
│   └── types/
│       └── declarations.d.ts   # типи для CSS/зображень
├── .babelrc
├── .prettierrc
├── eslint.config.mjs
├── jest.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. TypeScript конфігурація

**`tsconfig.json`** — кажемо TypeScript, як перевіряти типи і де шукати файли.

```json
{
  "compilerOptions": {
    /* Основа */
    "target": "ES2020",              // у який стандарт JS компілювати типи
    "lib": ["DOM", "DOM.Iterable", "ES2020"],  // які API доступні (браузер + сучасний JS)
    "module": "ESNext",              // формат імпорту/експорту (ESM для tree-shaking)
    "moduleResolution": "bundler",   // як шукати модулі (оптимізовано під webpack/vite)

    /* JSX */
    "jsx": "react-jsx",              // автоматичний React 17+ трансформ (не потрібен import React)

    /* Строгість */
    "strict": true,                  // всі строгі перевірки увімкнені
    "noUnusedLocals": true,          // помилка на невикористані змінні
    "noUnusedParameters": true,      // помилка на невикористані параметри
    "noFallthroughCasesInSwitch": true,  // кожен case у switch має break/return
    "forceConsistentCasingInFileNames": true,  // App.tsx !== app.tsx

    /* Шляхи */
    "baseUrl": ".",                  // базовий шлях для алісів
    "paths": {
      "@/*": ["src/*"],              // import { Button } from '@/components/Button'
      "@components/*": ["src/components/*"],
      "@styles/*": ["src/styles/*"]
    },

    /* Вивід */
    "noEmit": true,                  // TS лише перевіряє типи, Babel робить компіляцію
    "isolatedModules": true,         // кожен файл — окремий модуль (потрібно для Babel)
    "esModuleInterop": true,         // import React from 'react' замість import * as React
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,       // дозволяє import data from './data.json'
    "skipLibCheck": true             // не перевіряти типи в node_modules (швидкість)
  },
  "include": ["src"],               // які файли перевіряти
  "exclude": ["node_modules", "dist"]
}
```

**Ключове:** `"noEmit": true` — TypeScript НЕ компілює код, а лише перевіряє типи. Компіляцію виконує Babel через webpack. Це швидше, бо Babel просто видаляє типи без їх перевірки.

---

## 6. Babel конфігурація

**`.babelrc`** — кажемо Babel, які трансформації застосувати до коду.

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": "> 0.25%, not dead",
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ],
    "@babel/preset-typescript"
  ]
}
```

Що робить кожен пресет:

- **`@babel/preset-env`** — перетворює сучасний JS (ES2020+) у JS, зрозумілий цільовим браузерам. `targets` вказує, які браузери підтримувати. `useBuiltIns: "usage"` додає поліфіли тільки для фіч, які реально використовуються в коді.
- **`@babel/preset-react`** — перетворює JSX у `React.createElement()` виклики. `runtime: "automatic"` — не потрібно писати `import React` у кожному файлі (React 17+).
- **`@babel/preset-typescript`** — просто видаляє TypeScript-типи. Не перевіряє типи (це робить `tsc` або `fork-ts-checker-webpack-plugin`).

---

## 7. Webpack: спільний конфіг

**`config/webpack.common.js`** — те, що однакове для dev і prod.

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
  // ── Точка входу ──────────────────────────────────────────────
  // Webpack починає обхід графа залежностей звідси.
  // Усе, що не імпортовано (прямо чи транзитивно) з цього файлу,
  // НЕ потрапить у фінальний бандл.
  entry: path.resolve(__dirname, '..', 'src', 'index.tsx'),

  // ── Вивід ────────────────────────────────────────────────────
  output: {
    // Куди складати зібрані файли
    path: path.resolve(__dirname, '..', 'dist'),

    // [name] = ім'я чанка (main за замовчуванням)
    // [contenthash] = хеш від вмісту файлу (для кешування в браузері)
    filename: 'js/[name].[contenthash:8].js',

    // Те саме для динамічних чанків (code splitting)
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',

    // Базовий шлях для всіх ресурсів у HTML (/ = від кореня сервера)
    publicPath: '/',

    // Видаляти папку dist перед кожною збіркою
    clean: true,

    // Для зображень/шрифтів, оброблених через asset modules
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },

  // ── Модулі (правила обробки файлів) ─────────────────────────
  module: {
    rules: [
      // JS/TS/JSX/TSX → Babel
      {
        test: /\.(ts|tsx|js|jsx)$/,       // які файли обробляти
        exclude: /node_modules/,           // не чіпати залежності
        use: {
          loader: 'babel-loader',          // який лоадер використати
          options: {
            cacheDirectory: true,          // кешувати результати (швидкість)
          },
        },
      },

      // Зображення → вбудований asset module (без file-loader у webpack 5)
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset',                     // webpack сам вирішує: inline чи окремий файл
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,            // < 10KB → base64 inline, >= 10KB → файл
          },
        },
      },

      // SVG → React-компонент (SVGR) або URL
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,             // тільки з JS/TS файлів
        use: ['@svgr/webpack'],            // import { ReactComponent as Logo } from './logo.svg'
      },

      // Шрифти
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',            // завжди окремий файл
      },
    ],
  },

  // ── Resolve (як webpack шукає модулі) ───────────────────────
  resolve: {
    // Які розширення пробувати при імпорті без розширення:
    // import App from './App' → пробує App.tsx, App.ts, App.js, App.jsx
    extensions: ['.tsx', '.ts', '.js', '.jsx'],

    // Аліси шляхів (дублюємо з tsconfig.json для webpack)
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
      '@components': path.resolve(__dirname, '..', 'src', 'components'),
      '@styles': path.resolve(__dirname, '..', 'src', 'styles'),
    },
  },

  // ── Плагіни ─────────────────────────────────────────────────
  plugins: [
    // Генерує index.html з автоматичними <script> та <link> тегами
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
      favicon: path.resolve(__dirname, '..', 'public', 'favicon.ico'),
    }),

    // Перевіряє TypeScript типи В ОКРЕМОМУ ПРОЦЕСІ
    // Не блокує збірку — помилки типів з'являються як overlay/console warnings
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, '..', 'tsconfig.json'),
      },
    }),

    // Завантажує змінні з .env файлу → process.env.REACT_APP_*
    new DotenvWebpackPlugin({
      systemvars: true,   // дозволяє і системні env-змінні
      safe: false,        // не вимагає .env.example
    }),
  ],
};
```

---

## 8. Webpack: dev конфіг

**`config/webpack.dev.js`** — максимум швидкості та зручності розробки.

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  // ── Режим ───────────────────────────────────────────────────
  // 'development' вмикає:
  // - readable імена модулів (замість числових ID)
  // - корисні повідомлення про помилки
  // - вимикає мініфікацію
  mode: 'development',

  // ── Source Maps ─────────────────────────────────────────────
  // 'eval-source-map' — найкращий для dev:
  // - Швидка початкова збірка
  // - Швидкий rebuild при змінах
  // - Точне відображення рядків у DevTools
  // Альтернативи: 'cheap-module-source-map' (швидше, менш точно)
  devtool: 'eval-source-map',

  // ── CSS правило (для dev) ───────────────────────────────────
  module: {
    rules: [
      {
        test: /\.s?css$/,                    // .css та .scss файли
        use: [
          'style-loader',                    // Вставляє CSS як <style> тег (швидко, HMR працює)
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.\w+$/,      // Тільки файли *.module.scss мають CSS Modules
                localIdentName: '[name]__[local]--[hash:base64:5]',  // Читабельні імена класів
              },
              sourceMap: true,
            },
          },
          'sass-loader',                     // SCSS → CSS
        ],
      },
    ],
  },

  // ── Dev Server ──────────────────────────────────────────────
  devServer: {
    port: 3000,                              // порт сервера
    open: true,                              // автовідкриття в браузері
    hot: true,                               // Hot Module Replacement (оновлення без F5)

    // Для SPA: всі шляхи повертають index.html
    // (інакше /about дасть 404)
    historyApiFallback: true,

    // Overlay з помилками компіляції у браузері
    client: {
      overlay: {
        errors: true,                        // показувати помилки
        warnings: false,                     // не показувати попередження (занадто шумно)
      },
    },
  },
});
```

**Чому `style-loader` в dev, а не `MiniCssExtractPlugin`?** Бо `style-loader` вставляє CSS через JS у `<style>` теги, що дозволяє HMR миттєво оновлювати стилі без перезавантаження сторінки. В production нам потрібні окремі .css файли для кешування.

---

## 9. Webpack: prod конфіг

**`config/webpack.prod.js`** — максимум оптимізації для продакшену.

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  // ── Режим ───────────────────────────────────────────────────
  // 'production' вмикає:
  // - Tree shaking (видалення невикористаного коду)
  // - Мініфікацію (за замовчуванням Terser)
  // - Scope hoisting (менший бандл)
  // - Детерміновані module/chunk ID (стабільне кешування)
  mode: 'production',

  // ── Source Maps ─────────────────────────────────────────────
  // 'source-map' — окремий .map файл
  // Браузер не завантажує його, поки не відкриєш DevTools
  // Можна взагалі вимкнути (false) для безпеки
  devtool: 'source-map',

  // ── CSS правило (для prod) ──────────────────────────────────
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,       // Витягує CSS в окремі файли (замість style-loader)
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.\w+$/,
                localIdentName: '[hash:base64:8]',  // Короткі хешовані імена (менший розмір)
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  // ── Плагіни ─────────────────────────────────────────────────
  plugins: [
    // Витягує CSS в окремі файли з хешем для кешування
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),

    // Копіює статичні файли з public/ у dist/
    // (favicon, robots.txt, manifest.json тощо)
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html'],       // index.html генерує HtmlWebpackPlugin
          },
        },
      ],
    }),
  ],

  // ── Оптимізація ─────────────────────────────────────────────
  optimization: {
    minimize: true,
    minimizer: [
      // Мініфікація JS
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,              // Видалити console.log() з продакшену
            drop_debugger: true,             // Видалити debugger
          },
          format: {
            comments: false,                 // Видалити коментарі
          },
        },
        extractComments: false,              // Не створювати LICENSE.txt
      }),

      // Мініфікація CSS
      new CssMinimizerPlugin(),
    ],

    // ── Code Splitting ──────────────────────────────────────────
    splitChunks: {
      chunks: 'all',                         // Розділяти і sync, і async чанки

      cacheGroups: {
        // Окремий чанк для бібліотек з node_modules
        // Бібліотеки змінюються рідко → кешуються довше
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },

        // Спільний код, імпортований у 2+ місцях
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },

    // Виділяє webpack runtime в окремий файл
    // Зміни в коді не інвалідують кеш vendors чанка
    runtimeChunk: 'single',
  },

  // ── Performance ─────────────────────────────────────────────
  performance: {
    hints: 'warning',
    maxAssetSize: 250000,                    // попередження якщо файл > 250KB
    maxEntrypointSize: 500000,               // попередження якщо entry point > 500KB
  },
});
```

---

## 10. ESLint конфігурація

**`eslint.config.mjs`** — flat config (новий формат ESLint 9+).

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Базові рекомендовані правила JS
  js.configs.recommended,

  // TypeScript правила
  ...tseslint.configs.recommended,

  // Prettier — ВИМИКАЄ правила ESLint, що конфліктують з Prettier
  // Має бути ОСТАННІМ у масиві
  prettierConfig,

  // Наші налаштування
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },         // автоматично визначити версію React
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',    // не потрібно з React 17+ (automatic runtime)
      'react/prop-types': 'off',             // використовуємо TypeScript замість PropTypes

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',       // помилка: хуки тільки на верхньому рівні
      'react-hooks/exhaustive-deps': 'warn',        // попередження: неповні залежності у useEffect

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',             // дозволяє _unusedParam
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',  // не змушувати писати : JSX.Element
      '@typescript-eslint/no-explicit-any': 'warn',               // попереджувати про any

      // Загальні
      'no-console': 'warn',                 // попередження на console.log
    },
  },

  // Ігнорувати зібрані файли
  {
    ignores: ['dist/', 'coverage/', 'node_modules/', 'config/'],
  },
];
```

---

## 11. Prettier конфігурація

**`.prettierrc`** — єдині правила форматування для всієї команди.

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "lf",
  "arrowParens": "always",
  "bracketSpacing": true,
  "jsxSingleQuote": false
}
```

**`.prettierignore`:**

```
dist/
coverage/
node_modules/
*.min.js
```

---

## 12. Тестування

**`jest.config.ts`:**

```ts
import type { Config } from 'jest';

const config: Config = {
  // Середовище — імітація браузерного DOM
  testEnvironment: 'jsdom',

  // Трансформація TS → JS для Jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Де шукати тести
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/*.spec.{ts,tsx}',
  ],

  // Маппінг для імпортів, які Jest не розуміє
  moduleNameMapper: {
    // CSS Modules → порожній об'єкт
    '\\.(css|scss)$': 'identity-obj-proxy',

    // Зображення → рядок з ім'ям файлу
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',

    // Аліси (дублюємо з tsconfig)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },

  // Запустити перед кожним тестовим файлом
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Покриття
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
};

export default config;
```

Додай допоміжний файл для `identity-obj-proxy`:

```bash
pnpm add -D identity-obj-proxy
```

**`src/__mocks__/fileMock.ts`:**

```ts
export default 'test-file-stub';
```

**`src/setupTests.ts`:**

```ts
import '@testing-library/jest-dom';
```

**Приклад тесту — `src/components/App/App.test.tsx`:**

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});
```

---

## 13. Скрипти package.json

```json
{
  "scripts": {
    "start": "webpack serve --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js",
    "build:analyze": "WEBPACK_BUNDLE_ANALYZER=true webpack --config config/webpack.prod.js",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss,css,json}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Що робить кожен скрипт:

- `pnpm start` — запускає dev-сервер з HMR на localhost:3000
- `pnpm build` — створює оптимізовану збірку в dist/
- `pnpm lint` — перевіряє код ESLint-ом
- `pnpm format` — форматує код Prettier-ом
- `pnpm type-check` — перевіряє типи без компіляції
- `pnpm test` — запускає тести
- `pnpm test:coverage` — тести + звіт покриття

---

## 14. Довідник пакетів

### Основні залежності (dependencies)

| Пакет | Що робить |
|-------|-----------|
| `react` | Бібліотека для побудови UI через компоненти |
| `react-dom` | Рендерить React-компоненти в браузерний DOM |

### Webpack ядро

| Пакет | Що робить |
|-------|-----------|
| `webpack` | Збирає модулі в бандли, аналізує граф залежностей |
| `webpack-cli` | CLI-інтерфейс для запуску webpack з терміналу |
| `webpack-dev-server` | Локальний HTTP-сервер з HMR для розробки |
| `webpack-merge` | Об'єднує кілька webpack конфігів (common + dev/prod) |

### Webpack лоадери

| Пакет | Що робить |
|-------|-----------|
| `babel-loader` | Пропускає JS/TS файли через Babel |
| `css-loader` | Розуміє @import та url() у CSS, резолвить шляхи |
| `style-loader` | Вставляє CSS у DOM через `<style>` теги (dev) |
| `sass-loader` | Компілює SCSS/SASS → CSS |
| `sass` | Компілятор SCSS (dart-sass) |
| `file-loader` | Копіює файли у dist та повертає URL (legacy, webpack 5 має asset modules) |

### Webpack плагіни

| Пакет | Що робить |
|-------|-----------|
| `html-webpack-plugin` | Генерує HTML з автовставкою script/link тегів |
| `mini-css-extract-plugin` | Витягує CSS в окремі .css файли (prod) |
| `css-minimizer-webpack-plugin` | Мініфікує CSS (видаляє пробіли, скорочує) |
| `terser-webpack-plugin` | Мініфікує JS (видаляє console.log, коментарі, скорочує) |
| `copy-webpack-plugin` | Копіює статичні файли (favicon тощо) у dist/ |
| `dotenv-webpack` | Завантажує змінні з .env у process.env |
| `fork-ts-checker-webpack-plugin` | Перевіряє TS-типи в окремому процесі (не блокує збірку) |

### Babel

| Пакет | Що робить |
|-------|-----------|
| `@babel/core` | Ядро Babel — парсить і трансформує код |
| `@babel/preset-env` | Компілює сучасний JS для цільових браузерів |
| `@babel/preset-react` | Перетворює JSX → JavaScript |
| `@babel/preset-typescript` | Видаляє TypeScript-типи (без перевірки типів) |

### TypeScript

| Пакет | Що робить |
|-------|-----------|
| `typescript` | Компілятор TypeScript (тут використовується лише для перевірки типів) |
| `@types/react` | Типи для React API |
| `@types/react-dom` | Типи для ReactDOM |

### ESLint

| Пакет | Що робить |
|-------|-----------|
| `eslint` | Статичний аналізатор коду, знаходить помилки і bad practices |
| `@eslint/js` | Базові рекомендовані правила для JS |
| `typescript-eslint` | Парсер + правила ESLint для TypeScript |
| `eslint-plugin-react` | Правила для React (key у списках, alt у img тощо) |
| `eslint-plugin-react-hooks` | Правила для хуків (залежності useEffect, порядок виклику) |
| `eslint-config-prettier` | Вимикає правила ESLint, що конфліктують з Prettier |

### Тестування

| Пакет | Що робить |
|-------|-----------|
| `jest` | Тест-раннер — шукає і запускає тести |
| `ts-jest` | Дозволяє Jest запускати TypeScript тести без попередньої компіляції |
| `jest-environment-jsdom` | Імітація браузерного DOM для тестів (document, window) |
| `@testing-library/react` | Утиліти для тестування React-компонентів (render, screen) |
| `@testing-library/jest-dom` | Додаткові матчери (toBeInTheDocument, toHaveClass) |
| `@testing-library/user-event` | Симуляція користувацьких дій (click, type, hover) |
| `identity-obj-proxy` | Заглушка для CSS Modules у тестах |

---

## 15. Запуск та перевірка

### Створи мінімальні файли для запуску

**`public/index.html`:**

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**`src/index.tsx`:**

```tsx
import { createRoot } from 'react-dom/client';
import App from '@components/App/App';
import '@styles/global.scss';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(<App />);
```

**`src/components/App/App.tsx`:**

```tsx
import styles from './App.module.scss';

const App = () => {
  return (
    <div className={styles.app}>
      <h1>Hello, Webpack + React + TypeScript!</h1>
      <p>Dev/Prod конфігурація працює.</p>
    </div>
  );
};

export default App;
```

**`src/components/App/App.module.scss`:**

```scss
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  h1 {
    color: #1a1a2e;
  }
}
```

**`src/styles/global.scss`:**

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}
```

**`src/types/declarations.d.ts`:**

```ts
// Дозволяє TypeScript імпортувати CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Дозволяє імпортувати зображення
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
```

### Команди для перевірки

```bash
# Розробка
pnpm start                 # → localhost:3000

# Продакшен-збірка
pnpm build                 # → dist/

# Перевірка типів
pnpm type-check

# Лінтинг
pnpm lint

# Тести
pnpm test
```

---

## Що далі?

Після засвоєння базового сетапу, варто додати:

- **PostCSS + Autoprefixer** — автододавання vendor-префіксів для CSS
- **Bundle Analyzer** (`webpack-bundle-analyzer`) — візуалізація розміру бандла
- **PWA** (`workbox-webpack-plugin`) — Service Worker для офлайн-режиму
- **Module Federation** — мікрофронтенди
- **Husky + lint-staged** — автозапуск лінтера перед комітом
- **CI/CD** — GitHub Actions для автотестів та деплою

---

*Створено: березень 2026. Webpack 5, React 18/19, TypeScript 5.*
