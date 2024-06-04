# 目次
- [目次](#目次)
- [概要と機能](#概要と機能)
- [グラフデータ(json)のサンプル](#グラフデータjsonのサンプル)
- [★このアプリを今すぐ使用する方法](#このアプリを今すぐ使用する方法)
  - [オンライン：GitHub Pagesで使用](#オンラインgithub-pagesで使用)
  - [ローカル・オフライン：ビルド済みの単一htmlを開いて使用](#ローカルオフラインビルド済みの単一htmlを開いて使用)
- [このアプリをビルドなどする方法](#このアプリをビルドなどする方法)
  - [npmとViteを使ってビルドする版](#npmとviteを使ってビルドする版)
    - [説明](#説明)
    - [npmのパッケージのインストール](#npmのパッケージのインストール)
    - [httpプロトコルで動くやつをビルド(デフォルト)](#httpプロトコルで動くやつをビルドデフォルト)
    - [httpプロトコル＋fileプロトコルでも動くやつをビルド](#httpプロトコルfileプロトコルでも動くやつをビルド)
  - [CDNから読み込む版(更新停止)](#cdnから読み込む版更新停止)
- [参考にしたアプリと記事(先駆者様)](#参考にしたアプリと記事先駆者様)
- [使用しているパッケージ(ライブラリ)とフォントのライセンス](#使用しているパッケージライブラリとフォントのライセンス)
  - [パッケージ(ライブラリ)のライセンス](#パッケージライブラリのライセンス)
  - [フォントのライセンス](#フォントのライセンス)
- [このリポジトリのライセンス](#このリポジトリのライセンス)

<br>

# 概要と機能
Cytoscape.jsを利用したグラフ(ネットワーク図)の、ビューワーアプリです。  
何個かの拡張機能を導入しているので、操作しやすい感じになっています。    
Cytoscape.jsのグラフをサクッと閲覧したい・PNG画像に出力したい時に使えます。  
グラフのスタイルはデフォルトからかなり変更しています(ソース参照)  
<br>
[Cytoscape.jsのグラフデータのjsonファイル](https://js.cytoscape.org/#notation/elements-json)を読み込み、グラフを表示します。
  - 各要素のデータ(ID、ラベル、色、形状)をインスペクタから確認できる
  - グラフの「エッジの形式([Edge line](https://js.cytoscape.org/#style/edge-line))」、「ノードの配置形式[(layout)](https://js.cytoscape.org/#layouts)」を選択可能
  - マウスでノードの座標を編集＋編集後のグラフデータをjsonで保存可能
  - マウスによる座標の編集は、取り消し「Ctrl+z」、やり直し「Ctrl+y」が可能
  - グラフをPNG画像で出力(画質、背景色、透過有無、対象範囲を設定可)


<br>

# グラフデータ(json)のサンプル
「sample-json-data」のディレクトリにjson形式で入っています。  
アプリ内の「データを読み込む(json)」ボタンに入力すると、グラフ表示が可能。  
Cytoscape.jsは、グラフのノードを入れ子構造のグループにできます  
おそらく、グラフ系ライブラリの中では唯一の機能です。
- 「00_simple.json」：三角関係みたいなグラフ
- 「01_group.json」：何かのチームの関係性を表すグラフ
- 「02_group2.json」：何かのチームと所属者の関係性を表すグラフ
- 「03_group3.json」：マトリョーシカのような入れ子構造のグループ
- 「04_group4.json」：入れ子構造のグループ同士の関係性のグラフ

# ★このアプリを今すぐ使用する方法
## オンライン：GitHub Pagesで使用
<b>npmとViteを使ってビルドしたものがGitHub Pagesにあります！</b>
https://tweeteafox223.github.io/cy-minimum-graph-viewer/

## ローカル・オフライン：ビルド済みの単一htmlを開いて使用
`npm(Vite)/dist-offline/index.html`をダウンロードし、  
ブラウザでindex.htmlを開くことで使用可能です。  
ローカルかつオフライン環境でも動作可能です。  

下記のリンクに入り、右上の「・・・」ボタンを押すか、  
又は、中央付近にある「↓」のボタンを押すとダウンロードできます。  
https://github.com/TweeTeaFOX223/cy-minimum-graph-viewer/blob/main/npm(Vite)/dist-offline/index.html
<br>

# このアプリをビルドなどする方法

## npmとViteを使ってビルドする版

### 説明  
 `npm(Vite)`のディレクトリに入っているやつです。   
  「vite」と「vite-plugin-singlefile」でビルドする仕様です。  
 `node.js v22.2.0`と`npm v10.7.0`のインストールが必要です。  

### npmのパッケージのインストール  
このリポジトリをCloneし、`./npm(Vite)`でターミナルを開きます。  
npmのコマンドを実行し必要パッケージをローカルにインストールします。  
```
cd npm(Vite)  
npm install
```


###  httpプロトコルで動くやつをビルド(デフォルト)  
```
npm run dev
```
：Viteの機能でDEVサーバを起動してアプリを動作させます。  
：コンソールに出てくるローカルホストにアクセスすると動きます。  
<br>
```
npm run build
```  
：`npm(Vite)/dist`にhtmlとjsとcssが生成されます。  
：それをサーバーに設置してhttpプロトコルでアクセスすると動く。
<hr>

###  httpプロトコル＋fileプロトコルでも動くやつをビルド  
```
npm run build-offline
```
：`npm(Vite)/dist-offline`に`index.html`が生成されます。  
：そのindex.htmlをブラウザで開くと動かすことができます。


## CDNから読み込む版(更新停止)
- `CDN@archived`のディレクトリに入っているやつです。  
html内部で、JavaScriptのライブラリをCDNから読み込んでいます。   
<b>CDNだと使用ライブラリの依存関係の管理が困難なので更新停止しました。</b>  
<br>  

- html＋生のJavaScript+cssだけで作成しており、  
JavaScriptのES Modules機能を使用していないウェブページなので、  
ファイルをDLし`CDN@archived/index.html`をブラウザで開くと動きます。  
htmlとJavaScriptとcssのファイルを直接編集して改変することが可能です。  

※ [同一オリジンポリシー](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy) に違反する機能を利用してないってことです。    
※ CDNからライブラリを読み込んでいるのでインターネット接続が必要です。  

# 参考にしたアプリと記事(先駆者様)

大きく参考にしたアプリと記事(先駆者様)です。これらを見て、cytoscape.jsのグラフに関して「グラフ要素の内部データをサクッと確認できるものがほしい」「画質・背景色・透過有無・出力範囲をサクッと設定して、PNG画像に出力できるものがほしい」「CDN利用でシンプルに動くやつがほしい」と思ったので、作って見ました。

- Cytoscape.js　Demos  
https://js.cytoscape.org/#demos
- cyeditor(アプリケーション)  
https://github.com/demonray/cyeditor
- Cytoscape.jsを試してみた  
https://qiita.com/madilloar/items/bb9e9dddd37639998637
- jQuery: Cytoscape.js お試せた  
https://hhsprings.pinoko.jp/site-hhs/2018/01/jquery-cytoscape-js-%E3%81%8A%E8%A9%A6%E3%81%9B%E3%81%9F/
https://cse.google.com/cse?cx=006012754116484472402%3Aic62g4kqloc&ie=UTF-8&q=Cytoscape&sa=%E6%A4%9C%E7%B4%A2


# 使用しているパッケージ(ライブラリ)とフォントのライセンス
`npm(Vite)/package.json`と  
`CDN@archived/index.html`の下部の内容も参照してください。  

##  パッケージ(ライブラリ)のライセンス

- cytoscape.js ：MIT  
Copyright (c) 2016-2022, The Cytoscape Consortium.  
https://github.com/cytoscape/cytoscape.js/  

- cytoscape.js-undo-redo ：MIT    
Copyright (c) 2019 iVis-at-Bilkent  
https://github.com/iVis-at-Bilkent/cytoscape.js-undo-redo  

- cytoscape.js-panzoom ：MIT  　　
Copyright (c) The Cytoscape Consortium  
https://github.com/cytoscape/cytoscape.js-panzoom  

  - jquery.js ：MIT    
Copyright OpenJS Foundation and other contributors,  
https://openjsf.org/  
https://github.com/jquery/jquery  


- cytoscape.js-dagre ：MIT    
Copyright (c) 2016-2018, 2020, The Cytoscape Consortium.  
https://github.com/cytoscape/cytoscape.js-dagre  

  - dagre.js ：MIT    
Copyright (c) 2012-2014 Chris Pettitt  
https://github.com/dagrejs/dagre  


- FileSaver.js ：MIT    
Copyright © 2016 Eli Grey.  
https://github.com/eligrey/FileSaver.js  
  

- micromodal.js ：MIT    
Copyright (c) 2017 Indrashish Ghosh  
https://github.com/Ghosh/micromodal  
https://gist.github.com/ghosh/4f94cf497d7090359a5c9f81caf60699  


## フォントのライセンス
- Font-Awesome：cytoscape.js-panzoomが依存  
アイコンはCC BY 4.0、フォントはSIL OFL 1.1、コードはMIT  
https://github.com/FortAwesome/Font-Awesome  




# このリポジトリのライセンス
MITライセンスです  
 https://opensource.org/license/mit/　