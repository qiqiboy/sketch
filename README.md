Sketch
=====

Just a HTML5 sketch-pad. 
简易H5画板，支持绘画与擦除

## 如何使用
```javascript

// @Class Sketch
// @param String|HTMLCanvasElement id canvas节点id或者该对象
// @param Object config 初始画板配置
//                      .width int 画板宽度
//                      .height int 画板高度
//                      .lineWidth int 笔画宽度
//                      .color 笔画颜色

var sketch=new Sketch('canvas',{
    width:document.body.clientWidth,
    height:document.body.clientHeight,
    lineWidth:5,
    color:'red'
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


````

## DEMO 
http://u.boy.im/sketch/demo
