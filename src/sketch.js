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
            "mousedown mousemove mouseup",
        slice=[].slice;
    
    struct.prototype={
        constructor:struct,
        lineWidth:5,
        color:'#000',
        erase:false,
        bgcolor:'transparent',
        init:function(config){
            this.events={};
            this.actions=[];

            this.ctx=this.canvas.getContext('2d');

            typeof config=='object' && "width height lineWidth color bgcolor multi".split(" ").forEach(function(prop){
                this[prop]=typeof config[prop]=='undefined'?this[prop]:config[prop];
            }.bind(this));

            evstr.split(" ").forEach(function(ev){
                this.canvas.addEventListener(ev, this, false);
            }.bind(this));

            var tempPens
            
            this.on({
                start:function(){
                    if(!this.moving){
                        tempPens=[];
                    }
                    tempPens[arguments[2]]={
                        width:this.lineWidth,
                        color:this.color,
                        erase:this.erase,
                        pens:[arguments]
                    }
                },
                move:function(){
                    var action=tempPens[arguments[2]];
                    action.pens.push(arguments);
                    this.draw({
                        width:action.width,
                        color:action.color,
                        erase:action.erase,
                        pens:action.pens.slice(-2)
                    });
                },
                end:function(){
                    var id=arguments[2];
                    if(tempPens[id].pens.length>1){
                        this.actions.push(tempPens[id]);
                    }
                },
                redraw:function(){
                    var ctx=this.ctx;
                    if(this.bgcolor!='transparent'){
                        ctx.fillStyle=this.bgcolor;
                        ctx.fillRect(0,0,this.width,this.height);
                    }
                }
            }).clear();
        },
        handleEvent:function(ev){
            var rect=this.canvas.getBoundingClientRect(),
                ratioX=this.width/rect.width,
                ratioY=this.height/rect.height,
                evts=[ev],
                touchNum=0,
                x,y;

            if(ev.changedTouches){
                evts=slice.call(ev.changedTouches).map(function(touch){
                    return {
                        clientX:touch.clientX,
                        clientY:touch.clientY,
                        identifier:touch.identifier
                    }
                });
                touchNum=ev.touches.length;
            }

            (this.multi||evts.length==1) && evts.forEach(function(_ev){
                var identifier=_ev.identifier||0;

                x=(_ev.clientX-rect.left)*ratioX;
                y=(_ev.clientY-rect.top)*ratioY;
                
                switch(ev.type.toLowerCase()){
                    case 'mousedown':
                    case 'touchstart':
                    case 'pointerdown':
                        this.fire('start',x,y,identifier);
                        this.moving=true;
                        break;
                    case 'mousemove':
                    case 'touchmove':
                    case 'pointermove':
                        if(this.moving){
                            ev.preventDefault();
                            this.fire('move',x,y,identifier);
                        }
                        break;
                    case 'mouseup':
                    case 'touchend':
                    case 'touchcancel':
                    case 'pointerup':
                    case 'pointercancel':
                        if(this.moving){
                            this.fire('end',x,y,identifier);
                            if(!touchNum||!this.multi){
                                delete this.moving;
                            }
                        }
                        break;
                }
            }.bind(this));
        },
        on:function(ev,callback){
            if(typeof ev == 'object'){
                Object.keys(ev).forEach(function(_e){
                    this.on(_e,ev[_e]);
                }.bind(this));
            }else{
                if(!this.events[ev]){
                    this.events[ev]=[];
                }
                this.events[ev].push(callback);
            }
            return this;
        },
        fire:function(ev){
            var args=[].slice.call(arguments,1);
            (this.events[ev]||[]).forEach(function(callback){
                if(typeof callback == 'function'){
                    callback.apply(this,args);
                }
            }.bind(this));
            return this;
        },
        draw:function(action){
            var ctx=this.ctx;
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
            return this;
        },
        reDraw:function(){
            this.ctx.clearRect(0,0,this.width,this.height);
            this.fire('redraw');
            this.actions.forEach(this.draw.bind(this));
            return this;
        },
        cancel:function(num){
            this.actions.splice(-(num||1));
            return this.reDraw();
        },
        clear:function(){
            this.actions.length=0;
            return this.reDraw();
        },
        toDataUrl:function(type){
            return this.canvas.toDataURL(type);
        },
        toBlob:function(){
            return (this.canvas.toBlob||function(callback,type){
                if('mozGetAsFile' in this){
                    return callback(this.mozGetAsFile('blob',type));
                }
                var dataUrl=this.toDataURL(type).split(','),
                    bytestr=ROOT.atob(dataUrl[1]),
                    buffer=new Uint8Array(bytestr.length),
                    i,len;
                for(i=0,len=buffer.length;i<len;i++){
                    buffer[i]=bytestr.charCodeAt(i);
                }
                callback(new Blob([buffer.buffer],{type:type||dataUrl[0].split(/[:;]/)[1]}));
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
