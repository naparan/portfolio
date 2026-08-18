# Portfolio

なぱらん/Naparan のポートフォリオサイト。素の HTML / CSS / JavaScript で作られていて、
ビルド工程はありません。GitHub Pages でそのまま配信できます。

**公開URL:** https://naparan.github.io/portfolio/ （GitHub Pages を有効化すると公開されます）

## 構成

```
.
├── index.html      トップ（ヒーロー + カテゴリ紹介）
├── profile.html    プロフィール
├── works.html      作品一覧（カテゴリー絞り込み付き）
├── style.css       全ページ共通のスタイル
├── script.js       全ページ共通のスクリプト
└── sorce/
    ├── images/     サイトが参照するメディア（Web用に圧縮済み）
    ├── links/      YouTube にアップした動画のURL一覧
    └── _original/  動画の原本。.gitignore 済みでローカルにのみ存在
```

## 動画の扱い

動画には2通りの載せ方があり、作品ごとに使い分けています。

**1. YouTube に上げてリンクする** — 長い動画向け。サムネイル画像を `<a>` で包み、
別タブで YouTube を開きます。リポジトリには動画本体が入らないので軽くなります。
URL は `sorce/links/links.json` に記録してあります。

| キー | 作品 | URL |
|---|---|---|
| `ymm4_effect` | YMM4 エフェクトプラグイン開発 | https://youtu.be/HaPd6Gdtti4 |
| `AE_prac` | After Effects モーショングラフィックス | https://youtu.be/If-DrjgAwEg |

**2. リポジトリに置いて `<video>` で再生する** — 短い動画や、並べて比較したいもの向け。
現在はスケーリング比較の2本（各20秒）だけがこの方式です。**この2本はまだ YouTube に
上げていません。**

新しく YouTube に上げたら、`links.json` に追記して `works.html` のカードを
`<video>` から `<a class="card-thumb thumb-link">` に差し替え、`sorce/images/` の
動画ファイルを削除してください（ポスター画像は残します）。

## メディアの圧縮について

`sorce/images/` に入っているのは **Web 配信用に再エンコードした版**です（計 976KB）。
原本は計 120MB あり、Git はバイナリを差分圧縮できないので `sorce/_original/` に分けて
`.gitignore` してあります。原本を差し替えたら、圧縮版も作り直してください。

```bash
# 動画の圧縮（1280px 幅、CRF 27 前後が目安）
ffmpeg -i 原本.mp4 -vf scale=1280:-2 -c:v libx264 -crf 27 -preset slow \
       -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart 出力.mp4

# ポスター画像の切り出し（4 は秒数）
ffmpeg -ss 4 -i 入力.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 4 出力_poster.jpg
```

各 `<video>` には `preload="none"` と `poster` を付けてあります。これを外すと
ページを開いた瞬間に全動画がダウンロードされるので、そのままにしておくのが無難です。

## ローカルで確認する

リポジトリ直下で静的サーバーを立てるだけです。`file://` で直接開くと動画が
読めないので、必ずサーバー経由で見てください。

```bash
npx --yes http-server . -p 8080 -c-1
```

## ライセンス

掲載している作品・画像・動画の権利は制作者に帰属します。
