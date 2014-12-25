/*
 * @author qiqiboy
 * @github https://github.com/qiqiboy/sketch
 */
;
(function(ROOT, struct, undefined){
    "use strict";

    if(typeof Function.prototype.bind!='function'){
        Function.prototype.bind=function(obj){
            var self=this;
            return function(){
                return self.apply(obj,arguments);
            }
        }
    }

    var evstr='PointerEvent' in ROOT ?
            "pointerdown pointermove pointerup pointercancel" :
            "createTouch" in ROOT.document || 'ontouchstart' in ROOT ?
            "touchstart touchmove touchend touchcancel" :
            "mousedown mousemove mouseup";
    
    struct.prototype={
        constructor:struct,
        lineWidth:5,
        color:'#000',
        erase:false,
        init:function(config){
            this.events={};
            this.actions=[];

            this.ctx=this.canvas.getContext('2d');

            typeof config=='object' && "width height lineWidth color".split(" ").forEach(function(prop){
                this[prop]=typeof config[prop]=='undefined'?this[prop]:config[prop];
            }.bind(this));

            evstr.split(" ").forEach(function(ev){
                this.canvas.addEventListener(ev, this, false);
            }.bind(this));
            
            this.on({
                start:function(){
                   this.actions.push({
                       width:this.lineWidth,
                       color:this.color,
                       erase:this.erase,
                       pens:[arguments]
                   });
                },
                move:function(){
                    this.actions[this.steps-1].pens.push(arguments);
                    this.draw();
                }
            });
        },
        handleEvent:function(ev){
            var x=ev.clientX||0,
                y=ev.clientY||0,
                rect=this.canvas.getBoundingClientRect();
            if(ev.touches && ev.touches.length){
                if(ev.touches.length>1){//多指触摸不作响应
                    return;
                }
                x=ev.touches.item(0).clientX;
                y=ev.touches.item(0).clientY;
            }
            x-=rect.left;
            y-=rect.top;

            x*=this.width/rect.width;
            y*=this.height/rect.height;

            switch(ev.type.toLowerCase()){
                case 'mousedown':
                case 'touchstart':
                case 'pointerdown':
                    this.moving=true;
                    this.fire('start',x,y);
                    break;
                case 'mousemove':
                case 'touchmove':
                case 'pointermove':
                    if(this.moving){
                        ev.preventDefault();
                        this.fire('move',x,y);
                    }
                    break;
                case 'mouseup':
                case 'touchend':
                case 'touchcancel':
                case 'pointerup':
                case 'pointercancel':
                    if(this.moving){
                        delete this.moving;
                        this.fire('end');
                    }
                    break;
            }
        },
        on:function(ev,callback){
            if(typeof ev == 'object'){
                return Object.keys(ev).forEach(function(_e){
                    this.on(_e,ev[_e]);
                }.bind(this));
            }
            if(!this.events[ev]){
                this.events[ev]=[];
            }
            this.events[ev].push(callback);
        },
        fire:function(ev){
            var args=[].slice.call(arguments,1);
            (this.events[ev]||[]).forEach(function(callback){
                if(typeof callback == 'function'){
                    callback.apply(this,args);
                }
            }.bind(this));
        },
        draw:function(){
            var ctx=this.ctx;
            ctx.clearRect(0,0,this.width,this.height);
            this.actions.forEach(function(action){
                ctx.lineWidth=action.width;
                ctx.lineJoin=ctx.lineCap='round';
                if(action.erase){
                    ctx.strokeStyle="#000";
                    ctx.globalCompositeOperation='destination-out';
                }else{
                    ctx.globalCompositeOperation='source-over';
                    ctx.strokeStyle=action.color;
                }
                ctx.beginPath();
                action.pens.forEach(function(pos,step){
                    ctx[step?'lineTo':'moveTo'].apply(ctx,pos);
                });
                ctx.stroke();
                ctx.closePath();
            });
            return this;
        },
        cancel:function(num){
            this.actions.splice(-(num||1));
            return this.draw();
        },
        clear:function(){
            this.actions.length=0;
            return this.draw();
        },
        toDataUrl:function(type){
            return this.canvas.toDataURL(type);
        },
        toBlob:function(){
            return (this.canvas.toBlob||function(callback,type){
                if('mozGetAsFile' in this){
                    return callback(this.mozGetAsFile('blob',type));
                }
                var dataurl=this.toDataURL(type),
                    bytestr=ROOT.atob(dataurl.split(',')[1]),
                    buffer=new Uint8Array(bytestr.length),
                    i,len;
                for(i=0,len=buffer.length;i<len;i++){
                    buffer[i]=bytestr.charCodeAt(i);
                }
                callback(new Blob([buffer.buffer],{type:type||dataurl.split(',')[0].split(':')[1].split(';')[0]}));
            }).apply(this.canvas,arguments);
        }
    }

    if(typeof Object.defineProperties=='function'){
        
        "width height".split(" ").forEach(function(prop){
            Object.defineProperty(struct.prototype,prop,{
                get:function(){
                    return this.canvas[prop];
                },
                set:function(value){
                    this.canvas[prop]=value;
                },
                enumerable:true
            });
        });

        Object.defineProperty(struct.prototype,'steps',{
            get:function(){
                return this.actions.length;
            },
            enumerable:true
        });

    }

    ROOT.Sketch=struct;
    
})(window, function(id,config){
    if(!(this instanceof arguments.callee)){
        return new arguments.callee(id,config);
    }

    this.canvas=typeof id=='string'?document.getElementById(id):id;

    this.init(config);
});
