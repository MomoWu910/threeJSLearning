# threeJSLearning

(這是第一份工作時用來做部門內部分享時的課程內容，都是很基礎的ThreeJS內容，留著也是用來紀念自己有這樣的分享機會)

以 **Three.js + TypeScript** 打造的 3D 繪圖與 **GLSL Shader** 學習／教學專案。內容涵蓋從相機、場景、渲染器等基礎觀念，到 3D 模型載入、物理模擬，再到自訂 Shader（光暈、太陽、岩漿波浪）的循序漸進範例。

## 技術棧

| 類別 | 使用工具 |
| --- | --- |
| 3D 引擎 | [three.js](https://threejs.org/) `^0.134.0` |
| 語言 | TypeScript `^4.4.4` |
| 物理引擎 | [cannon-es](https://github.com/pmndrs/cannon-es) `^0.18.0` |
| 動畫補間 | [GSAP](https://gsap.com/) `^3.8.0` |
| 打包 | Webpack 5（`ts-loader`、`raw-loader` 載入 `.vert`／`.frag`） |
| 開發伺服器 | webpack-dev-server／Express + webpack-dev-middleware |
| 偵錯 UI | dat.GUI、stats.js |

## 環境需求

- Node.js（建議 16 以上）
- yarn 或 npm

## 安裝與啟動

```bash
# 安裝相依套件
yarn install

# 啟動開發伺服器（webpack-dev-server，預設自動開啟瀏覽器、支援 HMR 熱更新）
yarn dev
```

其他指令：

```bash
yarn build:dev    # development 模式打包並 watch
yarn build:prod   # production 模式打包並 watch
yarn server       # 改用 Express + webpack-dev-middleware 啟動於 http://localhost:3000
```

> 進入點為 `src/app.ts`，最終由 Webpack 打包為 `dist/bundle.js`，掛載於 `index.html` 的 `#main-canvas`。

## 切換範例

所有範例都集中在 `src/app.ts` 以註解方式管理，**取消對應那一行的註解**（並把其他行註解掉）即可切換要顯示的場景：

```ts
// new ViewReward();              // 轉盤抽獎
// new ViewWithPhysics();         // 物理模擬
// new View();                    // 綜合場景

// new ViewLession2_Mesh();       // 物件、材質、形狀
// new ViewLession3_1();          // shader 入門

new ViewLession4_0();             // 上課模板
// new ViewLession4_1();          // 光暈的故事
// new ViewLession4_2();          // 太陽
```

## 專案結構

```
threeJSLearning/
├── index.html              # 載入 bundle.js 的入口頁
├── src/
│   ├── app.ts              # 進入點，以註解切換各範例
│   ├── style.css
│   ├── constants/          # 共用工具
│   │   ├── cannonUtils.ts          # three 幾何 → cannon 物理形狀
│   │   ├── cannonDebugRenderer.ts  # 物理碰撞框視覺化
│   │   └── imageRes.ts
│   └── scene/
│       ├── view.ts                 # 綜合場景（模型 + 貼圖 + 燈光）
│       ├── viewReward.ts           # GSAP 轉盤抽獎
│       ├── viewWithPhysics.ts      # cannon-es 物理模擬
│       ├── lession1/               # 基礎：第一個場景
│       ├── lession2/               # 相機 / 場景 / 渲染器 / Mesh
│       ├── lession3/               # 模型載入與 Shader 入門
│       └── lession4/               # 自訂 Shader
│           ├── shader4_1.ts        # 光暈 GLSL
│           ├── shader4_2.ts        # 光暈 / 太陽 / 岩漿波浪 GLSL
│           ├── viewLession4_0.ts   # 上課模板
│           ├── viewLession4_1.ts   # 光暈的故事
│           └── viewLession4_2.ts   # 太陽
├── res/
│   ├── model/              # 3D 模型（porsche、shiba、godzilla、segamini…）
│   └── texture/            # 貼圖（grass、stone、lava、cloud…）
├── ThreeJSxShader/         # 教學課程子專案（含 PPT 連結）
├── server.js              # Express 啟動腳本
├── webpack.config.js
└── tsconfig.json
```

## 課程內容（lession）

| 章節 | 主題 | 重點 |
| --- | --- | --- |
| **Lession 1** | 第一個 Three.js 場景 | 場景搭建、基本幾何體 |
| **Lession 2** | 三大元件 | 透視／正交相機、Scene、Renderer、Mesh（物件 / 材質 / 形狀） |
| **Lession 3** | 模型與 Shader 入門 | GLTF／OBJ 模型載入、多種貼圖（Roughness／Normal／Diffuse…）、Shader 概念 |
| **Lession 4** | 自訂 GLSL Shader | 光暈、太陽球、傳貼圖到 shader、兩種波浪（岩漿）效果 |

## 進階範例

- **`viewReward.ts`** — 以 GSAP 製作的 3D 轉盤抽獎，物件環狀排列、可旋轉指向獎項。
- **`viewWithPhysics.ts`** — 整合 cannon-es 物理引擎，搭配 `CannonDebugRenderer` 顯示碰撞框。
- **`view.ts`** — 綜合展示：載入多個模型、貼圖、多種燈光（spotLight／pointLight／directLight）與 helper。

## 資源（res）

- **模型**：`porsche`、`shiba`、`godzilla`、`banana`、`rathalos`、`bitcoin`／`bitcoin2`、`segamini`（含完整 PBR 貼圖組）。
- **貼圖**：草地、石頭、岩漿、雲、太陽等，含 Normal Map／Black/White Map。

> 模型授權請參考各資料夾內的 `license.txt`／`url.txt`。


## License

MIT
