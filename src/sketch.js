/*
 * @author qiqiboy
 * @github https://github.com/qiqiboy/sketch
 */
;
(function(ROOT, struct, undefined){
    "use strict";

    var states={
            start:1,
            down:1,
            move:2,
            end:3,
            up:3,
            cancel:3
        },
        evs=[],
        slice=[].slice,
        event2type={},
        event2code={},
        POINTERS={},
        dpr=ROOT.devicePixelRatio||1;

    typeof [].forEach=='function' && "mouse touch pointer MSPointer-".split(" ").forEach(function(prefix){
        var _prefix=/pointer/i.test(prefix)?'pointer':prefix;
        Object.keys(states).forEach(function(endfix){
            var code=states[endfix],
                ev=camelCase(prefix+endfix);
            evs.push(ev);
            POINTERS[_prefix]={};
            event2type[ev.toLowerCase()]=_prefix;
            event2code[ev.toLowerCase()]=code;
        });
    });

    function camelCase(str){
        return (str+'').replace(/-([a-z]|[0-9])/ig, function(all,letter){
            return (letter+'').toUpperCase();
        });
    }

    function filterEvent(oldEvent){
         var ev={},
             eventtype,
             pointers,
             pointer;

        ev.oldEvent=oldEvent;
        ev.type=oldEvent.type.toLowerCase();
        ev.eventType=event2type[ev.type]||ev.type;
        ev.eventCode=event2code[ev.type]||0;
        ev.preventDefault=function(){
            oldEvent.preventDefault();
        }

        pointers=POINTERS[ev.eventType];
        switch(ev.eventType){
            case 'mouse':
            case 'pointer':
                var id=oldEvent.pointerId||0;
                ev.eventCode==3?delete pointers[id]:pointers[id]=oldEvent;
                ev.changedPointers=[{id:id,ev:oldEvent}];
                break;
            case 'touch':
                ev.changedPointers=slice.call(oldEvent.changedTouches).map(function(pointer){
                    return {id:pointer.identifier,ev:pointer};
                });
                POINTERS[ev.eventType]=pointers=slice.call(oldEvent.touches);
                break;
        }

        if(pointer=pointers[Object.keys(pointers)[0]]){
            ev.clientX=pointer.clientX;
            ev.clientY=pointer.clientY;
        }

        ev.length=Object.keys(pointers).length;

        return ev;
    }
    
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

            evs.forEach(function(ev){
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
        handleEvent:function(oldEvent){
            var ev=filterEvent(oldEvent),
                rect=this.canvas.getBoundingClientRect();

            (this.multi||ev.length<=1) && ev.changedPointers.forEach(function(pointer){
                var x=pointer.ev.clientX-rect.left,
                    y=pointer.ev.clientY-rect.top;
                switch(ev.eventCode){
                    case 1:
                        if(!this.pointerType){
                            this.pointerType=ev.eventType;
                        }
                        this.fire('start',x,y,pointer.id);
                        this.moving=true;
                        break;
                    case 2:
                        if(this.moving&&this.pointerType==event2type[ev.type]){
                            ev.preventDefault();
                            this.fire('move',x,y,pointer.id);
                        }
                        break;
                    case 3:
                        if(this.moving&&this.pointerType==event2type[ev.type]){
                            this.fire('end',x,y,pointer.id);
                        }
                        break;
                }
            }.bind(this));

            if(this.moving&&!ev.length){
                delete this.moving;
                delete this.pointerType;
            }
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
                    return this.canvas[prop]/dpr;
                },
                set:function(value){
                    this.canvas[prop]=value*dpr;
                    this.ctx.scale(dpr,dpr);//retina support
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
