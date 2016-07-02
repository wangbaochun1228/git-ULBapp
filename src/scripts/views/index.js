//引入模块
var tplIndex =require("../templates/index.string");
//引入公共方法
var util = require('../utils/fn.js');
//定义视图
SPA.defineView('index',{
	//装载html模板
	html: tplIndex,
	
	plugins: ['delegated'],
	
	// 初始化一些属性和方法
	init: {
		setFocus: function (e) {
	   		$(e.el).addClass('active').siblings().removeClass('active');
		}
	},	
	
	modules:[{
		name: 'content', // 子视图的名字，用作后边引用的句柄
		views: ['home','mlqs','seller','my'],  // 定义子视图的列表
		defaultTag: 'mlqs', // 定义子视图
		container: '.l-container' // 子视图的容器
	}],
	
	//绑定tab  事件
	bindActions: {
		'switch.tabs': function(e, data){
//			if(data.tag===){
				$(e.el).addClass('hidden').siblings().removeClass().parent().siblings().children().siblings().removeClass();
//			}
			
			//切换子视图
			console.log($(e.el));
			this.modules.content.launch(data.tag);
		}
	},
	
	//绑定视图的事件   bindEvent:{   }
	bindEvents:{
		
		show: function (){
				
		},
	}	
});

