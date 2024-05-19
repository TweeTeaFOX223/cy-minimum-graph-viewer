"use strict";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import undoRedo from "cytoscape-undo-redo";
import panzoom from "cytoscape-panzoom";
import { saveAs } from "file-saver";
import MicroModal from "micromodal";

cytoscape.use(dagre);
undoRedo(cytoscape);
panzoom(cytoscape);

//インスペクタの表示中の要素のJSON
let nowSelectedElemData;

//モーダルウィンドウの設定
MicroModal.init({
  awaitOpenAnimation: true, //開くときのアニメーション
  awaitCloseAnimation: true, //閉じるときのアニメーション
  disableScroll: false, //モーダルを開いた時でもスクロールできるよう
});

//cytoscape.jsのグラフの設定
let cy = (window.cy = cytoscape({
  container: document.getElementById("cy"), //コンテナ

  autoungrabify: false, //ノードを掴めないのONにするか？
  autolock: false, //ノードをロックするか？
  boxSelectionEnabled: true, //ctrlによるボックス選択を可能にするか？

  //これがtrueだとクリックした時に自動選択されなくなる
  autounselectify: false, //クリックによる自動選択を有効にするか？

  //マウスホイールズームの感度
  wheelSensitivity: 0.1, //これがおそらくちょうどよい

  layout: {
    //結局は後で変えるので何でもOK
    //ノードの配置を動かしたのがページ更新で消えると困るので、
    //ここで色々変更することはしない
    name: "dagre", //階層構造で表示
  },

  style: [
    {
      //ノードのデフォルトスタイル
      selector: "node",
      css: {
        // 'border-width': 4,
        // 'border-color': 'green',
        shape: "rectangle", //四角形
        "background-color": "#9dbaea", //背景は
        content: "data(label)", //文字はラベルの内容
        "text-valign": "center", //文字を中央に配置
        "text-halign": "center", //文字を中央に配置
        width: "label", //ラベルの幅に合わせる
        // "width": function (ele) {
        //   if (ele.data("label").length === 0) {
        //     return "12px";
        //   } else {
        //     return "lable";
        //   }
        // },//ラベルの幅に合わせる
        height: "label", //ラベルの高さに合わせる
        padding: "12px",
        "text-wrap": "wrap", //【重要】ラベルに改行を使用可能にする
        //https://qiita.com/madilloar/items/bb9e9dddd37639998637
      },
    },
    {
      //labelの内容が空のノード用のスタイル
      //node全体ではwidthとheightを「label」にしているため、
      //labelが無のノードは消滅したようになってしまう
      selector: `node[label =""]`,
      css: {
        width: "12px",
        height: "12px",
      },
    },
    {
      //親(parent)のノードのデフォルトスタイル
      selector: ":parent",
      css: {
        "background-color": "white", //背景は白色
        "text-valign": "top", //文字をノードの上に配置
        "text-halign": "center", //文字を中央に配置
      },
    },
    {
      //エッジのデフォルトスタイル
      selector: "edge",
      style: {
        "text-background-opacity": 1,
        "text-background-color": "#ffffff",
        width: 4, //普通の幅の線
        content: "data(label)", //ノードに表示するのはラベルの値
        "target-arrow-shape": "triangle", //エッジの先端の形状
        "line-color": "#DA1725", //エッジの色
        "target-arrow-color": "#DA1725", //エッジの先端の色

        "text-valign": "top", //文字をエッジの上に配置
        "curve-style": `${edge_curve.value}`, //選択後にページ更新で変わるように

        "text-wrap": "wrap", //【重要】ラベルに改行を使用可能にする
        //https://qiita.com/madilloar/items/bb9e9dddd37639998637
      },
    },
    {
      //選択したノードやエッジのスタイル
      selector: ":selected",
      style: {
        //'background-color': 'red'//選択したやつを赤くする
      },
    },
  ],
}));

//重要
//ここでパンズーム(ズームバー)を表示させる
cy.panzoom();

// cyのズーム値が変更された時の処理
const magnificationZoomNum = document.getElementById("magnification-zoom-num");
magnificationZoomNum.value = cy.zoom(); //初期状態での場合に表示しておく
cy.on("scrollzoom", function () {
  //ズーム倍率が変更されたら更新する
  magnificationZoomNum.value = cy.zoom();
});

//キャンバスの何もない部分をクリックした時の処理
//https://stackoverflow.com/questions/18051195/binding-a-click-on-the-canvas-excluding-the-node-edge-cytoscape-js-elements-to
//https://js.cytoscape.org/#cy.on
cy.on("click", function (event) {
  //キャンバスの何もない部分をクリックした時の処理を書く
  if (event.target === cy) {
    //インスペクターのエディタ設定のパネルを表示する
    document
      .getElementById("editor-setting-panel")
      .classList.remove("disabled");
    //インスペクターのノードorエッジ設定のパネルを非表示にする
    document
      .getElementById("node-or-edge-setting-panel")
      .classList.add("disabled");

    // console.log("キャンバスの何もない部分をクリック");
  } else {
    // console.log("何かある部分をクリック");
  }
});

//ノードとエッジをクリックした時の処理(インスペクタ用)
cy.on("click", "node, edge", function (event) {
  //インスペクターのエディタ設定のパネルを非表示にする
  document.getElementById("editor-setting-panel").classList.add("disabled");
  //インスペクターのノードorエッジ設定のパネルを表示する
  document
    .getElementById("node-or-edge-setting-panel")
    .classList.remove("disabled");

  //console.log(event.target.data('id'));

  //インスペクタに出ているものを、編集の方に回す用
  nowSelectedElemData = event.target;
  //console.log(nowSelectedElemData);

  //共通の情報
  console.log(event.target.group());
  now_elem_group.value = event.target.group(); //要素は種類は固定
  now_elem_id.value = event.target.data("id"); //idは変更不可能
  now_changelabel.value = event.target.data("label");
  now_pos_x.value = event.target.position("x");
  now_pos_y.value = event.target.position("y");

  if (event.target.selected() === true) {
    //選択されてる＝背景色変わってるのでインスペクタに反映はしない
  } else {
    now_labelcolor.value = ColorToHex(event.target.style("color"));
    now_labelcolor_str.value = ColorToHex(event.target.style("color"));
  }

  //ノードとエッジのインスペクター
  const inspectorNode = document.getElementById("inspector-node");
  const inspectorEdge = document.getElementById("inspector-edge");

  //ノードだけの情報
  if (event.target.group() === "nodes") {
    inspectorNode.classList.remove("disabled");
    inspectorEdge.classList.add("disabled");

    now_elem_type_node.checked = true;

    //ノードだけの情報をインスペクタに反映する
    now_parent.value = event.target.data("parent");

    if (event.target.selected() === true) {
      //選択されてる＝背景色変わってるのでインスペクタに反映はしない
    } else {
      now_backgroundcolor.value = ColorToHex(
        event.target.style("background-color")
      );
      now_backgroundcolor_str.value = ColorToHex(
        event.target.style("background-color")
      );
    }
    now_shape.value = event.target.style("shape");

    now_source.value = "";
    now_target.value = "";
    now_linecolor.value = "";
    now_linecolor_str.value = "";
    now_t_arr_color.value = "";
    now_t_arr_color_str.value = "";
    now_t_arr_shape.value = "";
    now_s_arr_color.value = "";
    now_s_arr_color_str.value = "";
    now_s_arr_shape.value = "";
  } else {
    //エッジのみの情報

    inspectorNode.classList.add("disabled");
    inspectorEdge.classList.remove("disabled");

    now_elem_type_edge.checked = true;

    now_parent.value = "";
    now_backgroundcolor.value = "";
    now_backgroundcolor_str.value = "";
    now_shape.value = "";

    //エッジだけの情報をインスペクタに反映する
    now_source.value = event.target.data("source");
    now_target.value = event.target.data("target");

    now_t_arr_shape.value = event.target.style("target-arrow-shape");
    now_s_arr_shape.value = event.target.style("source-arrow-shape");
    if (event.target.selected() === true) {
      //選択されてる＝背景色変わってるのでインスペクタに反映はしない
    } else {
      now_linecolor.value = ColorToHex(event.target.style("line-color"));
      now_linecolor_str.value = ColorToHex(event.target.style("line-color"));
      now_t_arr_color.value = ColorToHex(
        event.target.style("target-arrow-color")
      );
      now_t_arr_color_str.value = ColorToHex(
        event.target.style("target-arrow-color")
      );
      now_s_arr_color.value = ColorToHex(
        event.target.style("source-arrow-color")
      );
      now_s_arr_color_str.value = ColorToHex(
        event.target.style("source-arrow-color")
      );
    }
  }

  console.log(event.target.style("background-color"));

  //console.log(typeof (event.target.style('background-color')));
  //ColorToHex
});

//現在のマウスカーソルの座標を取得する
//selectorを無しにすれば、とりあえずの座標を取得することができる

cy.on("mousemove", function (event) {
  // console.log(event.renderedPosition.x);

  //htmlのキャンバス上でのマウスカーソルの座標
  //https://stackoverflow.com/questions/19115940/adding-cytoscape-node-at-the-location-of-mouse-cursor
  // document.getElementById("mousecursor-x-pos").value = event.renderedPosition.x;
  // document.getElementById("mousecursor-y-pos").value = event.renderedPosition.y;

  //cytoscape.jsのデータ上での座標
  const pos = event.position || event.cyPosition;
  document.getElementById("mousecursor-x-pos").value = pos.x;
  document.getElementById("mousecursor-y-pos").value = pos.y;
});

cy.on("mouseover", "node, edge", function (event) {
  //クイック編集機能の所に表示する機能
  qmenu_mouseover_elem_id.value = event.target.data("id");
  qmenu_mouseover_elem_label.value = event.target.data("label");
});

//超超超超超超重要メモ：ノードをマウスクリックで選択した時のイベントの順番
//select => free =>unselect
//grab => select => drag => free => unselect

//選択されたノードの色を変更する
//https://js.cytoscape.org/#events/collection-events
//https://stackoverflow.com/questions/68112947/cytoscape-js-check-when-all-nodes-are-unselected
//styleで指定されてるやつは、jsonで直接色指定している場合は使えない
//なので、このようにselectイベント発生時に変える必要がある
//selectされたやつがfreeになったら色を元に戻す

//コンテキストメニューでの色変更に関して、
//「選択(select)での色変更」→「コンテキストメニューでの色変更」→「非選択(unselect)での色変更」
//となってしまうのを防ぐためにこのような「selectで色反転→unselect元に戻す」
//「コンテキストの方はunselect後のstyle変更時に色変更」という処理をしている

cy.on("select", "node, edge", function (event) {
  let select_elem_prop_color;
  let select_elem_prop_back_color;

  if (event.target.group() === "nodes") {
    select_elem_prop_color = event.target.style("color");
    select_elem_prop_back_color = event.target.style("background-color");

    //親の時は背景色に色溶け込むのを防ぐために、色を赤にする
    if (event.target.isParent() === true) {
      event.target.style("color", `#fc4d4d`);
    } else {
      event.target.style("color", `white`);
    }

    event.target.style("background-color", `#3894fc`);
  } else {
    select_elem_prop_color = event.target.style("color");
    select_elem_prop_back_color = event.target.style("line-color");

    event.target.style("color", `#fc4d4d`);
    event.target.style("line-color", `#3894fc`);
    event.target.style("target-arrow-color", `#3894fc`);
    event.target.style("source-arrow-color", `#3894fc`);
  }

  /*色反転にしていたときのやつ
  if (event.target.group() === "nodes") {
    let rgb = ColorToHex(event.target.style('background-color'));
    event.target.style('background-color', `${ invertColor(rgb) }`);
 
  } else {
    let rgb = ColorToHex(event.target.style('line-color'));
    event.target.style('line-color', `${ invertColor(rgb) }`);
    event.target.style('target-arrow-color', `${ invertColor(rgb) }`);
    event.target.style('source-arrow-color', `${ invertColor(rgb) }`);
  }
  */

  //ここでoneにしないと、一回選択されたやつが解除される度に実行されてしまう
  event.target.one("unselect", function () {
    console.log("test:unselect");
    if (event.target.group() === "nodes") {
      event.target.style("color", select_elem_prop_color);
      event.target.style("background-color", select_elem_prop_back_color);
    } else {
      event.target.style("color", select_elem_prop_color);
      event.target.style("line-color", select_elem_prop_back_color);
      event.target.style("target-arrow-color", select_elem_prop_back_color);
      event.target.style("source-arrow-color", select_elem_prop_back_color);
    }
  });
});

//cytoscape.jsの[ノードかエッジ].style('color')で
//出てくる色データが文字列の「rgb(000,000,000)」なので
//それをHEXに変換するための関数
const ColorToHex = function (color) {
  let num_pick = /\d+/g;
  let three_num = color.match(num_pick);
  //console.log(three_num);

  let resultHex = "#";
  three_num.forEach(function (num) {
    //文字列なので、数値に直してから、再度16進数文字列にする
    let hex_part = parseInt(num).toString(16);
    if (hex_part.length == 1) {
      //長さが1個だった場合は左側に0を付ける
      resultHex += "0" + hex_part;
    } else {
      //長さが2個だった場合は普通にそのまま
      resultHex += hex_part;
    }
  });
  //console.log(resultHex);
  return resultHex;
};

//HEXの色を反転してリターンする
//"#000000"の文字列にのみ対応
//https://www.web-dev-qa-db-ja.com/ja/javascript/823691380/
const invertColor = function (hex) {
  hex = hex.slice(1);

  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1); //最初の#を消す
  }

  // RGBに変換して、255から引いたものが反転色＆再度HEXに変換
  let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
  let g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
  let b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

  // 長さがゼロだった場合は左側に0をつける
  return "#" + padZero(r) + padZero(g) + padZero(b);
};

//HEXの色を補色にしてリターンする
//"#000000"の文字列にのみ対応
//https://q-az.net/complementary-color-javascript/
const compleColor = function (hex) {
  hex = hex.slice(1);

  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1); //最初の#を消す
  }

  // HEXをRGBに変換する
  //.toString(16)
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  let max = Math.max(r, Math.max(g, b)); //RGBの最大値
  let min = Math.min(r, Math.min(g, b)); //RGBの最小値
  let sum = max + min;

  let comp_r = Math.abs(r - sum).toString(16); //引いてから絶対値にして変換
  let comp_g = Math.abs(g - sum).toString(16); //引いてから絶対値にして変換
  let comp_b = Math.abs(b - sum).toString(16); //引いてから絶対値にして変換

  // 長さがゼロだった場合は左側に0をつける
  return "#" + padZero(comp_r) + padZero(comp_g) + padZero(comp_b);
};

const padZero = function (hex_part) {
  let r_hex_part = "";

  if (hex_part.length == 1) {
    //長さが1個だった場合は左側に0を付ける
    r_hex_part = "0" + hex_part;
  } else {
    r_hex_part = hex_part;
  }

  return r_hex_part;
};

//各位置にある、文字列HEXコードをカラーピッカーに反映する
const apply_colorpick = function (colorpick_id, inputcolor_id) {
  const colorpicker = document.getElementById(colorpick_id);
  const input_color = document.getElementById(inputcolor_id);

  colorpicker.value = input_color.value;
};

//ファイルに使用できない記号を置換する
const filename_replace = function (target_string) {
  let string = target_string;
  //ウィンドウズのファイル名で使用できない記号
  let marks = ["\\", "/", ":", "*", "?", "<", ">", "|"];

  //全部置き換えて消す
  marks.forEach(function (element) {
    string = string.replace(element, "ぬ");
  });
  return string;
};

//PNG画像のスケールの値を入力する欄
const pngScale = document.getElementById("png-scale");
const pngScaleNum = document.getElementById("png-scale-num");
//PNGの画質(range)を数値として表示する
pngScale.addEventListener("change", function () {
  pngScaleNum.value = pngScale.value;
});
//PNGの画質(input)を、rangeの方に反映させる
pngScaleNum.addEventListener("change", function () {
  pngScale.value = pngScaleNum.value;
});

//png画像生成の処理(共通)
//png画像のオプションを返す
const confPngFunc = function () {
  let option = {
    output: "blob",
    scale: parseFloat(document.getElementById("png-scale").value),
  };

  const backColor = document.getElementById("color-picker").value;
  if (document.getElementById("png-tras-yes").checked === true) {
    option["bg"] = "#00000000";
    //console.log("testtete")
  } else {
    option["bg"] = backColor;
  }

  //画像の対象とする範囲
  if (document.getElementById("png-full-yes").checked === true) {
    option["full"] = true; //画面に写っていない範囲も含めて全部含める
  } else {
    option["full"] = false; //画面に写っている範囲だけ
  }

  return option;
};

//png画像を閲覧する処理
const viewPngPage = function () {
  const option = confPngFunc();

  const blob = new Blob([window.cy.png(option)], { type: "image/png" });

  const url = URL.createObjectURL(blob);

  window.open(url, "_target"); //別窓でblobのURLを開く

  //blobのメモリが開放されるようにする
  //http://var.blog.jp/archives/87131148.html
  URL.revokeObjectURL(url);
};
document
  .getElementById("view-png-page-button")
  .addEventListener("click", viewPngPage);

//png画像で保存する処理
const downloadPng = function () {
  const a = document.createElement("a");

  const option = confPngFunc();

  const blob = new Blob([window.cy.png(option)], {
    type: "application/octet-stream",
  });

  const filename = document.getElementById("png-name").value;

  //FileSaver.jsで保存する
  saveAs(blob, filename_replace(filename) + ".png");

  //blobのメモリが開放されるようにする
  //http://var.blog.jp/archives/87131148.html
  // URL.revokeObjectURL(url);
};
document
  .getElementById("download-png-button")
  .addEventListener("click", downloadPng);

//レイアウトを選択して変更する処理
const changeLayout = function () {
  let layout = cy.layout({
    name: `${selectLayout.value}`,
    fit: true,
    animate: true,
  });
  layout.run();
};

//図のJSONをテキストエリアから読み込む
document
  .getElementById("load-text-json-button")
  .addEventListener("click", function () {});

//図のJSONをファイルから読み込むボタン
document
  .getElementById("load-json-file")
  .addEventListener("change", (event) => {
    let input = event.target;

    //ファイルが選択されていなかった場合はリターン
    if (input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    //データが読み込まれたら確認枠に出すようにする
    const reader = new FileReader();
    reader.onload = () => {
      const loadedJson = document.getElementById("loaded-graph-json");
      loadedJson.value = reader.result;

      //読み込んだJSONをグラフに反映する
      readGraphJson(reader.result);
    };

    reader.readAsText(file); //データを読み込む

    //JSON読み込みのマイクロモーダルを閉じる
    MicroModal.close("read-json-data-window");
  });

//図のJSONをテキストエリアに入力し読み込むボタン
document
  .getElementById("load-text-json-button")
  .addEventListener("click", function () {
    const loadedJson = document.getElementById("load-text-json-data").value;
    readGraphJson(loadedJson); //読み込んだJSONをグラフに反映する

    //JSON読み込みのマイクロモーダルを閉じる
    MicroModal.close("read-json-data-window");
  });

//図のJSONを読み込む処理
const readGraphJson = function (loadJsonData) {
  //現在、グラフ上にある要素を全部消す
  let elements = cy.elements();
  cy.remove(elements);

  const jsonData = loadJsonData;

  //JSONにケツカンマがあった場合は削除する。
  const loadingData = jsonData
    .replaceAll(/ {2,}/g, " ")
    .replaceAll(/, *}/g, "}")
    .replaceAll(/} +}/g, "}}")
    .replaceAll(/,\n*]/g, "\n]");
  console.log(loadingData);

  cy.add(JSON.parse(loadingData));
};

//図のJSONをファイルから追加するボタン
document.getElementById("add-json-file").addEventListener("change", (event) => {
  let input = event.target;

  //ファイルが選択されていなかった場合はリターン
  if (input.files.length === 0) {
    return;
  }
  const file = input.files[0];

  //データが読み込まれたら確認枠に出すようにする
  const reader = new FileReader();
  reader.onload = () => {
    const addedJson = document.getElementById("added-graph-json");
    addedJson.value = reader.result;

    //読み込んだJSONをグラフに反映する
    addGraphJson(reader.result);
  };

  reader.readAsText(file); //データを読み込む

  //JSON読み込みのマイクロモーダルを閉じる
  MicroModal.close("add-json-data-window");
});

//図のJSONをテキストエリアに入力し追加するボタン
document
  .getElementById("graph-add-text-json-button")
  .addEventListener("click", function () {
    const addedJson = document.getElementById("graph-add-text-json-data").value;
    addGraphJson(addedJson); //読み込んだJSONをグラフに反映する

    //JSON読み込みのマイクロモーダルを閉じる
    MicroModal.close("add-json-data-window");
  });

//図のJSONに要素を追加する処理
const addGraphJson = function (addJsonData) {
  const jsonData = addJsonData;

  //JSONにケツカンマがあった場合は削除する。
  const addingData = jsonData
    .replaceAll(/ {2,}/g, " ")
    .replaceAll(/, *}/g, "}")
    .replaceAll(/} +}/g, "}}")
    .replaceAll(/,\n*]/g, "\n]");
  cy.add(JSON.parse(addingData));
};

//図のJSONを保存する処理
//ケツカンマは読み込み時に消すのであってもOK
//数字は文字列にするとエラーなのでそのまま出す
const graphJsonSave = function () {
  let s = "";
  s += "[\n";

  let node_json = "";
  let edge_json = "";

  //いま出ているノードのJSONを文字列に変換
  let nodes = cy.nodes();

  nodes.forEach(function (node) {
    console.log(node.style());
    //console.log(nodes.json());
    console.log(JSON.stringify(node.json()));
    node_json += JSON.stringify(node.json());

    //Styleを足す部分(node.jsonだとスタイル出ないため)
    node_json = node_json.slice(0, -1); //最後の},を一旦消す
    node_json += `, "style": {`;
    node_json += `"background-color": "${ColorToHex(
      node.style("background-color")
    )}", `;
    node_json += `"color": "${ColorToHex(node.style("color"))}", `;
    node_json += `"shape": "${node.style("shape")}"},`; //最後の「}」忘れずに

    node_json += "},\n";
  });

  let edges = cy.edges();

  edges.forEach(function (edge) {
    edge_json += JSON.stringify(edge.json());

    //Styleを足す部分(node.jsonだとスタイル出ないため)
    edge_json = edge_json.slice(0, -1); //最後の},を一旦消す
    edge_json += `, "style": {`;
    edge_json += `"color": "${ColorToHex(edge.style("color"))}", `;
    edge_json += `"line-color": "${ColorToHex(edge.style("line-color"))}", `;
    edge_json += `"target-arrow-color": "${ColorToHex(
      edge.style("target-arrow-color")
    )}", `;
    edge_json += `"target-arrow-shape": "${edge.style(
      "target-arrow-shape"
    )}", `;
    edge_json += `"source-arrow-color": "${ColorToHex(
      edge.style("source-arrow-color")
    )}", `;
    edge_json += `"source-arrow-shape": "${edge.style(
      "source-arrow-shape"
    )}"},`; //最後の「}」忘れずに

    edge_json += "},\n";
  });

  s += node_json + edge_json;
  s += "]\n";

  return s;
};

const graphJsonSave_ALL = function () {
  //「.」は任意の1文字(改行以外)、「*?」は直前の繰り返し(最短)のもの、「|」で区切る
  const non_basic =
    /"removed":.*?,|"selected":.*?,|"selectable":.*?,|"locked":.*?,|"grabbable":.*?,|"pannable":.*?,/gi;

  let s = graphJsonSave();
  console.log(s);
  s = s.replaceAll(non_basic, "");
  document.getElementById("save-json-data").value = s;
};

//ケツカンマを消して保存
const graphJsonSave_P = function () {
  //「.」は任意の1文字(改行以外)、「*?」は直前の繰り返し(最短)のもの、「|」で区切る
  const non_basic =
    /"removed":.*?,|"selected":.*?,|"selectable":.*?,|"locked":.*?,|"grabbable":.*?,|"pannable":.*?,/gi;

  let s = graphJsonSave();
  s = s
    .replaceAll(non_basic, "")
    .replaceAll(",}", "}")
    .replaceAll(/,\n*]/g, "\n]");

  document.getElementById("save-json-data").value = s;
};

//保存したグラフのJSONを、クリップボードにコピーする処理
const graphJsonCopy = function (target_string) {
  console.log(target_string);

  let Json = $(`#${target_string}`).val();
  navigator.clipboard.writeText(Json);
};

//保存したグラフのJSONを、blobにして別ページで見る処理
const graphJsonView = function () {
  const blob = new Blob([document.getElementById("save-json-data").value], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  window.open(url, "_target"); //別窓でblobのURLを開く

  //blobのメモリが開放されるようにする
  //http://var.blog.jp/archives/87131148.html
  URL.revokeObjectURL(url);
};
document
  .getElementById("graph-json-view-button")
  .addEventListener("click", graphJsonView);

//グラフのjsonをファイルに保存する処理
const graphJsonFileSave = function (type) {
  const blob = new Blob([document.getElementById("save-json-data").value], {
    type: "application/json",
  });

  const fileName = document.getElementById("json-data-filename").value;
  saveAs(blob, filename_replace(fileName) + type);

  console.log("save as" + type);
};

document
  .getElementById("graph-json-save-txt-button")
  .addEventListener("click", function () {
    graphJsonFileSave(".txt");
  });
document
  .getElementById("graph-json-save-json-button")
  .addEventListener("click", function () {
    graphJsonFileSave(".json");
  });

const chamgeElemJson_handle = function () {
  console.log("1:変更ボタンが押された");
  if (nowSelectedElemData.selected() === true) {
    console.log("2:選択中の要素だった");

    //unselectで色反転が終了してから、
    // one(一回限り)にしないとtargetの選択が外される度に発動するので注意
    //https://js.cytoscape.org/#cy.one
    nowSelectedElemData.one("unselect", function () {
      console.log("3:選択が解除された");

      changeElemJson();
      //targetのスタイルのどれかの値が変更されたら(超重要なイベントです)
      //https://js.cytoscape.org/#events/collection-events
      //＝色反転が終了したら
      // nowSelectedElemData.one('style', function () {
      //   console.log("4:スタイルの変更を実施");
      //   //プロパティを変更する
      //   changeElemJson();

      // });
    });
  } else {
    //普通の場合は普通にそのまま処理すればいい
    changeElemJson();
  }
};

//インスペクタ上から要素を編集する
const changeElemJson = function () {
  //共通の情報

  nowSelectedElemData.group(`${now_elem_group.value}`);
  nowSelectedElemData.data("id", `${now_elem_id.value}`);
  nowSelectedElemData.data("label", `${now_changelabel.value}`);
  nowSelectedElemData.position("x", parseFloat(now_pos_x.value)); //座標は数字のまま
  nowSelectedElemData.position("y", parseFloat(now_pos_y.value)); //座標は数字のまま
  nowSelectedElemData.style("color", `${now_labelcolor.value}`);

  //ColorToHex(nowSelectedElemData.style('color', now_labelcolor_str.value));

  if (now_elem_group.value === "nodes") {
    //ノードだけの情報

    //※ノードの場合、parentだけはこの方法で変更する(公式ドキュメント参照)
    //親無しにしたい場合は値を「null」に指定する
    //存在しないidを指定すると、自動的に弾かれて元のままになるようだった
    //https://js.cytoscape.org/#eles.move

    if (now_parent.value === "") {
      //空白の場合＝親削除する場合は、parentをnullにする
      nowSelectedElemData = nowSelectedElemData.move({
        parent: null,
      });
    } else {
      //空白ではない場合は、parentの値を変更する
      nowSelectedElemData = nowSelectedElemData.move({
        parent: `${now_parent.value}`,
      });
    }

    console.log(`${now_backgroundcolor.value}`);
    nowSelectedElemData.style(
      "background-color",
      `${now_backgroundcolor.value}`
    );
    console.log(nowSelectedElemData.style("background-color") + "WTF");
    //ColorToHex(nowSelectedElemData.style('background-color', now_backgroundcolor_str.value));
    nowSelectedElemData.style("shape", `${now_shape.value}`);
  } else if (now_elem_group.value === "edges") {
    //エッジだけの情報

    //※エッジの場合、sourceとtargetだけはこの方法で変更する(公式ドキュメント参照)
    //存在しないidを指定すると、自動的に弾かれて元のままになるようだった
    //https://js.cytoscape.org/#eles.move
    nowSelectedElemData = nowSelectedElemData.move({
      source: `${now_source.value}`,
      target: `${now_target.value}`,
    });

    nowSelectedElemData.data("source", `${now_source.value}`);
    nowSelectedElemData.data("target", `${now_target.value}`);

    nowSelectedElemData.style("line-color", `${now_linecolor.value}`);
    //ColorToHex(nowSelectedElemData.style('line-color', now_linecolor_str.value));
    nowSelectedElemData.style("target-arrow-color", `${now_t_arr_color.value}`);
    //ColorToHex(nowSelectedElemData.style('target-arrow-color', now_t_arr_color_str.value));
    nowSelectedElemData.style("target-arrow-shape", `${now_t_arr_shape.value}`);
    nowSelectedElemData.style("source-arrow-color", `${now_s_arr_color.value}`);
    //ColorToHex(nowSelectedElemData.style('source-arrow-color', now_s_arr_color_str.value));
    nowSelectedElemData.style("source-arrow-shape", `${now_s_arr_shape.value}`);
  } else {
    console.log("error");
  }
};

//レイアウトを変更するボタンの処理
const change_cy_edge_layout = function () {
  cy.style()
    .selector("edge")
    .style("curve-style", `${edge_curve.value}`)
    .update();
};

//ページを更新する直前の処理
window.addEventListener("beforeunload", function (event) {
  //現在表示されているグラフのJSONを更新後の画面に持っていくために
  //hiddenのinputに値を保存しておく
  //これの時点では余計な改行は入らないので、置き換えに正規表現は使 わない

  //選択時のカラーが更新後そのままにならないようにする
  cy.nodes().unselect(); //全てのノードと
  cy.edges().unselect(); //エッジの選択を解除しておく

  HiddenNowJsonData.value = graphJsonSave()
    .replaceAll(",}", "}")
    .replaceAll(",\n]", "\n]");
  //ズーム倍率とパンの座標も同じくhiddenに保存する

  cy_zoom.value = cy.zoom(); //文字列なので後でIntに変換
  cy_pan_x.value = cy.pan("x"); //文字列なので後でfloatに変換
  cy_pan_y.value = cy.pan("y"); //文字列なので後でfloatに変換

  //クロームでも更新時にズームや現在の図を維持する機能
  //クッキーを利用→うまく行かなかったので廃止で
  /*
  document.cookie = 'HiddenNowJsonData' + '=' + encodeURIComponent(HiddenNowJsonData.value);
  document.cookie = 'cy_zoom' + '=' + encodeURIComponent(cy_zoom.value);
  document.cookie = 'cy_pan_x' + '=' + encodeURIComponent(cy_pan_x.value);
  document.cookie = 'cy_pan_y' + '=' + encodeURIComponent(cy_pan_y.value);
  */
});

//ビューワーの設定(背景色)を変更した時の処理
document
  .getElementById("editor-setting-change-button")
  .addEventListener("click", function () {
    document.getElementById("cy").style.backgroundColor =
      document.getElementById("change-editor-color").value;
  });

//ページを更新した後にやる処理
window.addEventListener("load", function () {
  ///確認のためにコンソールログにJSONの結果出す
  console.log(HiddenNowJsonData.value);
  //JSON.parseでエラー出たらコンソール確認する

  cy.add(JSON.parse(HiddenNowJsonData.value));

  //
  cy.zoom(parseFloat(cy_zoom.value)); //文字列なのでfloatに変換
  cy.pan({
    x: parseFloat(cy_pan_x.value), //文字列なのでfloatに変換
    y: parseFloat(cy_pan_y.value), //文字列なのでfloatに変換
  });
});

//Ctrl+ZとCtrl＋Yの処理(処理を戻ると進む)
document.addEventListener(
  "keydown",
  function (e) {
    if (e.ctrlKey && e.key == "z") {
      cy.undoRedo().undo();
    } else if (e.ctrlKey && e.key == "y") {
      cy.undoRedo().redo();
    }
  },
  true
);

//ヘルプ&説明のモーダルウィンドウを開く処理
const manualHelpButton = document.getElementById("manual-help-button");
manualHelpButton.addEventListener("click", function () {
  MicroModal.show("manual-help-window");
});

//JSONからグラフのデータを読み込むモーダルウィンドウを開く処理
const readGraphJsonButton = document.getElementById("read-json-func-button");
readGraphJsonButton.addEventListener("click", function () {
  MicroModal.show("read-json-data-window");
});

//JSONからグラフにデータを追加するモーダルウィンドウを開く処理
const addGraphJsonButton = document.getElementById("add-json-func-button");
addGraphJsonButton.addEventListener("click", function () {
  MicroModal.show("add-json-data-window");
});

//表示されているグラフのデータをJSONとして保存するモーダルウィンドウを開く処理
const saveGraphJsonButton = document.getElementById("save-json-func-button");
saveGraphJsonButton.addEventListener("click", function () {
  graphJsonSave_P(); //現在のグラフをJSONにして表示する
  MicroModal.show("save-json-data-window");
});

//表示されているグラフをPNGの画像として保存するモーダルウィンドウを開く処理
const saveGraphImageButton = document.getElementById(
  "save-json-image-func-button"
);
saveGraphImageButton.addEventListener("click", function () {
  MicroModal.show("save-json-image-window");
});

//インスペクターを隠す/表示するボタンを押した時の処理
const inspectorFoldingButton = document.getElementById(
  "inspector-folding-button"
);
inspectorFoldingButton.addEventListener("click", function () {
  inspectorFoldingButton.classList.toggle("spread");
  inspectorFoldingButton.classList.toggle("fold");

  const inspectorPanel = document.getElementById("inspector-panel");

  if (inspectorFoldingButton.dataset.mode === "-") {
    inspectorFoldingButton.textContent = "＋";
    inspectorFoldingButton.dataset.mode = "+";

    inspectorPanel.classList.add("disabled");
  } else {
    inspectorFoldingButton.textContent = "ー";
    inspectorFoldingButton.dataset.mode = "-";

    inspectorPanel.classList.remove("disabled");
  }
});
