# Sketch Lite

Just a HTML5 sketch-pad based on canvas, support painting and erasing.

## Install

```bash
# Use npm
$ npm install sketch-lite --save
# Use Yarn
$ yarn add sketch-lite
```

## Usage

```javascript
var SketchLite = require('sketch-lite');
// or
// import SketchLite from 'sketch-lite';

/**
 * @class SketchLite
 * @param {string|HTMLCanvasElement} canvasId - canvas id Or reference to the HTML <canvas> element
 * @param {object} config - initial config
 * @param {number} config.width -  width of artboard
 * @param {number} config.height - height of artboard
 * @param {number} config.lineWidth - width of line
 * @param {string} config.color - color of line
 * @param {string} config.bgcolor - background color of artboard
 * @param {boolean} config.multi - support multiple fingers at the same time
 * @returns {object} sketch-lite instance
*/

var sketch = new SketchLite('your-canvas-id', {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    bgcolor: 'transparent'
    lineWidth: 5,
    color: 'red',
    multi: false
});

/**
 * @event start - start
 * */
sketch.on('start', function(){
    console.log('start');
});

/**
 * @event move - painting 
*/
sketch.on('move', function(){
    console.log('painting');
});

/**
 * @event end - end 
*/
sketch.on('end', function(){
    console.log('end');
});

/**
 * @method clear - clear the artboard
 */ 
sketch.clear(); 

/**
 * @method cancel - undo 
 * @param {number} [num] - steps to undo, default num is 1 
*/
sketch.cancel(num);

/**
 * @method toDataUrl - convert canvas to a data URI, like "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNby "
 * @param {string} [type] - image format, default type is image/png 
*/
sketch.toDataUrl(type);

/**
 * @method toBlob - convert canvas to a Blob object
 * @param {function} callback - A callback function with the resulting Blob object as a single argument.
 * @param {string} [type] - A DOMString indicating the image format. The default type is image/png
*/
sketch.toBlob(callback, type);

// change line with to 10px
sketch.lineWidth = 10;
// change line color to green
sketch.color = 'green';

// switch to erase mode
sketch.erase = true;
```

## DEMO

http://github.boy.im/sketch/en/
