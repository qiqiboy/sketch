# Sketch Lite

Just a HTML5 sketch-pad based on canvas.
简易 H5 画板，支持绘画与擦除

## 安装

```bash
# Use npm
$ npm install sketch-lite --save
# Use Yarn
$ yarn add sketch-lite
```

## 如何使用

```javascript
var SketchLite = require('sketch-lite');

// @Class Sketch
// @param String|HTMLCanvasElement id canvas节点id或者该对象
// @param Object config 初始画板配置
//                      .width int 画板宽度
//                      .height int 画板高度
//                      .lineWidth int 笔画宽度
//                      .color 笔画颜色
//                      .bgcolor 背景颜色
//                      .multi 是否支持多指同时绘画

var sketch=new SketchLite('canvas',{
    width:document.body.clientWidth,
    height:document.body.clientHeight,
    bgcolor:'transparent'
    lineWidth:5,
    color:'red',
    multi:false
});

// @event
// start 开始绘画
// move 绘画中
// end 绘画结束

sketch.on('start',function(){
	console.log('开始绘画');
});
sketch.on('move',function(){
	console.log('绘画中');
});
sketch.on('end',function(){
	console.log('绘画结束');
});

// @method
sketch.clear(); //清除画布重新开始
sketch.cancel(num); //上一步，num为取消步数，默认为1
sketch.toDataUrl(type); //转为dataUrl数据
sketch.toBlob(callback,type); //生成blob对象（不支持ie9-）

// 更改笔画宽度、颜色
sketch.lineWidth=10;
sketch.color='green';

// erase擦除
sketch.erase=true; //该属性为true时表示是擦除状态
```

## DEMO

http://github.boy.im/sketch/
