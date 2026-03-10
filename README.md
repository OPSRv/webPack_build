<div align="center">

# ⚡ React + Webpack 5 Boilerplate

**Production-ready starter with React 19, TypeScript 5 and Webpack 5**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-5-8DD6F9?style=flat-square&logo=webpack&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-30-C21325?style=flat-square&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?style=flat-square&logo=prettier&logoColor=black)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=flat-square&logo=pnpm&logoColor=white)

</div>

---

## Features

- **⚡ Fast builds** — Webpack filesystem cache + Babel `cacheDirectory`
- **🔥 HMR** — instant style and component updates without page reload
- **🔒 Strict TypeScript** — `strict`, `noUnusedLocals`, `verbatimModuleSyntax`
- **🎨 SCSS + CSS Modules** — scoped styles with PostCSS + Autoprefixer
- **📦 Smart bundling** — separate `react-vendor`, `vendors` and `runtime` chunks
- **🗜️ Compression** — gzip + brotli via CompressionPlugin
- **🧹 Code quality** — ESLint with `jsx-a11y`, `security`, `simple-import-sort`
- **🪝 Git hooks** — lint-staged on pre-commit, tests on pre-push
- **🔍 Bundle Analyzer** — visualize bundle size with `pnpm analyze`

---

## Stack

| Category  | Technologies                                |
| --------- | ------------------------------------------- |
| UI        | React 19, TypeScript 5                      |
| Build     | Webpack 5, Babel 7                          |
| Styles    | SCSS, CSS Modules, PostCSS, Autoprefixer    |
| Linting   | ESLint 10 + jsx-a11y + security, Prettier 3 |
| Testing   | Jest 30, React Testing Library              |
| Git hooks | Husky 9, lint-staged                        |

---

## Requirements

- Node.js >= 20
- pnpm >= 10

---

## Getting Started

```bash
# Clone the repository
git clone <url> && cd <project>

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.development

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | Dev server at `localhost:3000` with HMR |
| `pnpm build`         | Production build to `dist/`             |
| `pnpm analyze`       | Build + Bundle Analyzer                 |
| `pnpm test`          | Run tests                               |
| `pnpm test:watch`    | Tests in watch mode                     |
| `pnpm test:coverage` | Tests + coverage report (70% threshold) |
| `pnpm lint`          | ESLint check                            |
| `pnpm lint:fix`      | ESLint auto-fix                         |

---

## Project Structure

```
├── config/
│   ├── webpack.common.js       # shared: entry, loaders, aliases, cache
│   ├── webpack.dev.js          # dev: HMR, source maps, style-loader
│   └── webpack.prod.js         # prod: minification, gzip/brotli, splitting
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── ...icons
├── src/
│   ├── components/
│   ├── styles/
│   │   └── global.scss
│   ├── types/
│   │   └── declarations.d.ts   # CSS Modules, image type declarations
│   ├── __mocks__/
│   ├── setupTests.ts
│   └── index.tsx
├── .env.example
├── .babelrc
├── .prettierrc
├── eslint.config.mjs
├── jest.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## Environment Variables

Create `.env.development` or `.env.production` from the example:

```bash
cp .env.example .env.development
```

Variables prefixed with `REACT_APP_` are available in code:

```ts
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## Path Aliases

```ts
import { Button } from '@components/Button';
import styles from '@styles/variables.scss';
import { helper } from '@/utils/helper';
```

Aliases are configured in both `tsconfig.json` and `webpack.common.js`.

---

## Build Details

<details>
<summary><strong>Development</strong></summary>

- `cheap-module-source-map` — fast, accurate source maps
- `style-loader` — injects CSS via `<style>` tags for instant HMR
- Filesystem cache — near-instant rebuilds after first run

</details>

<details>
<summary><strong>Production</strong></summary>

- **TerserPlugin** — JS minification, removes `console.log` / `debugger` / comments
- **MiniCssExtractPlugin** — separate `.css` files with `contenthash` for caching
- **CompressionPlugin** — gzip + brotli pre-compressed assets for the server
- **Code splitting:**
    - `react-vendor` — React + ReactDOM (changes rarely)
    - `vendors` — all other `node_modules`
    - `runtime` — webpack runtime chunk (prevents cache invalidation)
- **CopyWebpackPlugin** — copies `manifest.json`, icons, `browserconfig.xml` to `dist/`

</details>

---

## Testing

```bash
pnpm test:coverage
```

Coverage threshold: **70%** across branches, functions, lines and statements.

| What         | How                                                   |
| ------------ | ----------------------------------------------------- |
| CSS Modules  | replaced with `identity-obj-proxy`                    |
| Images / SVG | replaced with string stub via `__mocks__/fileMock.ts` |
| Path aliases | mirrored from `tsconfig.json` in `moduleNameMapper`   |

---

## Git Hooks

| Hook         | Action                                               |
| ------------ | ---------------------------------------------------- |
| `pre-commit` | lint-staged: ESLint --fix + Prettier on staged files |
| `pre-push`   | runs full test suite                                 |
