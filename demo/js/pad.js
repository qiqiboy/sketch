/*!
 * Author: imqiqiboy@gmail.com
 * Date: 2014-12-26
 */
;
(function($,undefined){
    var sketch=new Sketch('sketch',{
        lineWidth:5,
        color:'black',
        bgcolor:'#fff'
    }),
    tools=$('#pad-tools');

    $(window).resize(function(){
        sketch.width=$('#pad').width();
        sketch.height=$('#pad').height();
        sketch.reDraw();
    }).resize();
    
    var lw=1,
        cs=[1,4,8];
    tools.find('.pen-w').tap(function(){
        lw=++lw%3;
        $(this).find('i').removeClass('active').eq(lw).addClass('active');
        sketch.lineWidth=cs[lw];
    });
    var cpanel,
        colors=['black','red','green','yellow','blue'];
    tools.find('.pen-c').tap(function(){
        var btn=$(this);
        if(!cpanel){
            cpanel=new K.Panel();
            cpanel.setContent('<a class="close"></a><ul>'+colors.map(function(c){
                return '<li style="background:'+c+';"></li>'
            }).join('')+'</ul>').frame.addClass('color-pad');
            cpanel.frame.find('.close').tap(function(){
                cpanel.hide();
            }).end().find('li').tap(function(){
                var index=$(this).index();
                sketch.color=colors[index];
                btn.css('border-color',colors[index]);
                cpanel.hide();
            });
        }
        cpanel.show();
    });

    tools.find('.pen-cancel').tap(function(){
        sketch.cancel();
    });
    tools.find('.pen-clear').tap(function(){
        sketch.clear();
    });

    tools.find('.pen-erase').tap(function(){
        if(sketch.erase=!sketch.erase){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });

    tools.find('.pen-show').tap(function(){
        var panel=new K.Panel,
            imgurl=sketch.toDataUrl();
        panel.setContent('<a class="close"></a><h3>长按保存</h3><img src="'+imgurl+'" />').frame.addClass('pic-pad');
        panel.frame.find('.close').tap(function(){
            panel.destroy();
        });
        panel.show();
    });

    $(document).on('touchmove',function(){
        return false;
    })
})(Zepto);
