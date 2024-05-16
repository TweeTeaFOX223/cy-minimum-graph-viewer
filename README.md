# 目次
- [目次](#目次)
- [概要と機能](#概要と機能)
- [このアプリを使用する方法](#このアプリを使用する方法)
- [グラフデータ(json)のサンプル](#グラフデータjsonのサンプル)
- [参考にしたアプリと記事(先駆者様)](#参考にしたアプリと記事先駆者様)
- [使用しているライブラリとフォントのライセンス](#使用しているライブラリとフォントのライセンス)
  - [ライブラリのライセンス](#ライブラリのライセンス)
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


# このアプリを使用する方法
- オンライン：このリポジトリのGitHub Pagesにて使用できます。

- ローカル：`html+JavaScript+css`だけで作られているウェブページなので、  
このリポジトリのファイルをDLし、`index.html`をブラウザで開くと動きます。  
※CDNからライブラリを読み込んでいるのでネット接続が必要です。  

# グラフデータ(json)のサンプル
「sample-json-data」のディレクトリにjson形式で入っています。  
アプリ内の「データを読み込む(json)」ボタンに入力すると、グラフを表示させることが可能です。  
Cytoscape.jsは、グラフのノードを入れ子構造のグループにすることが可能(グラフ系ライブラリの中では唯一？)
- 「00_simple.json」：三角関係みたいなグラフ
- 「01_group.json」：何かのチームの関係性を表すグラフ
- 「02_group2.json」：何かのチームと所属者の関係性を表すグラフ
- 「03_group3.json」：マトリョーシカのような入れ子構造のグループ
- 「04_group4.json」：入れ子構造のグループ同士の関係性のグラフ

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


# 使用しているライブラリとフォントのライセンス

##  ライブラリのライセンス
全てMITライセンスです  
 https://opensource.org/license/mit/　

- cytoscape.js(3.25.0)  
Copyright (c) 2016-2022, The Cytoscape Consortium.  
https://github.com/cytoscape/cytoscape.js/  

- cytoscape.js-undo-redo  
Copyright (c) 2019 iVis-at-Bilkent  
https://github.com/iVis-at-Bilkent/cytoscape.js-undo-redo  

- cytoscape.js-panzoom(2.5.3)  
Copyright (c) The Cytoscape Consortium  
https://github.com/cytoscape/cytoscape.js-panzoom  

  - jquery.js(3.6.0)  
Copyright OpenJS Foundation and other contributors,  
https://openjsf.org/  
https://github.com/jquery/jquery  


- cytoscape.js-dagre(2.5.0)  
Copyright (c) 2016-2018, 2020, The Cytoscape Consortium.  
https://github.com/cytoscape/cytoscape.js-dagre  

  - dagre.js(0.8.2)  
Copyright (c) 2012-2014 Chris Pettitt  
https://github.com/dagrejs/dagre  


- FileSaver.js(2.0.5)  
Copyright © 2016 Eli Grey.  
https://github.com/eligrey/FileSaver.js  
  

- micromodal.min.js(0.4.10)  
Copyright (c) 2017 Indrashish Ghosh  
https://github.com/Ghosh/micromodal  
https://gist.github.com/ghosh/4f94cf497d7090359a5c9f81caf60699  


## フォントのライセンス
- Font-Awesome(4.0.3)：cytoscape.js-panzoomが依存  
アイコンはCC BY 4.0、フォントはSIL OFL 1.1、コードはMIT  
https://github.com/FortAwesome/Font-Awesome  




# このリポジトリのライセンス
MITライセンスです  
 https://opensource.org/license/mit/　