var tplHome = require('../templates/home.string');

//引用公共方法
var util = require('../utils/fn.js');

SPA.defineView('home', {
	html: tplHome,
	
	plugins:['delegated',{
		name: 'avalon',
		options: function(vm){
			vm.livelist = [];
		}
	}],
	
	//自定义函数
	init:{
		vm: null,
		livelistArray: [],
		homeSwiper: null,
		homeHotSwiper: null,
		mySwiper: null,
		formatData: function (arr){
//			console.log(arr);
			var tempArr = [];
			for(var i = 0; i < Math.ceil(arr.length/2); i++){
				tempArr[i] = [];
				tempArr[i].push(arr[2*i]);
				tempArr[i].push(arr[2*i+1]);
   			}
			return tempArr; 
		}
	},
	
	bindActions:{
		
	},
	bindEvents:{
		'beforeShow': function(){
			var that = this;
 			//获得vm对象
			that.vm = that.getVM();
			
			$.ajax({
//				url:'/ULBapp/mock/livelist.json',
				url: '/api/getLivelist.php',
				type:'get',
				data:{
					rtype:'origin'
				},
				
				success: function (rs){
					that.livelistArray = rs.data;
					that.vm.livelist = that.formatData(rs.data);
					console.log(that.formatData(rs.data));	
				}
			});
			$.ajax({
//				url:'/ULBapp/mock/livelist.json',
				url: '/api/getLiveBanner.php',
				type:'get',
				data:{
					rtype:'banner'
				},
				success: function (rs){
					
					console.log(rs.data);	
				}
			});
		},
		
		show: function (){
			var that = this;
			var mySwiper = new Swiper ('.swiper-container', {
  				//direction: 'vertical',  //上下滚动的轮播图
    			loop: true,    			
    			pagination: '.swiper-pagination',
    			autoplay : 2000,
				autoplayDisableOnInteraction : false,
			});
			
			// 下拉刷新，上拉加载更多
	      	var scrollSize = 30;
	      	var myScroll = this.widgets.homeHotScroll;
	      	myScroll.scrollBy(0, -scrollSize);
	
	     	var head = $('.head img'),
	          	topImgHasClass = head.hasClass('up');
	      	var foot = $('.foot img'),
	          	bottomImgHasClass = head.hasClass('down');
	      	myScroll.on('scroll', function () {
	          	var y = this.y,
	             	maxY = this.maxScrollY - y;
	          	if (y >= 0) {
	              	!topImgHasClass && head.addClass('up');
	              	return '';
	          	}
	          	if (maxY >= 0) {
	              	!bottomImgHasClass && foot.addClass('down');
	              	return '';
	          	}
	      	});
	
	      	myScroll.on('scrollEnd', function () {
	          	if (this.y >= -scrollSize && this.y < 0) {
	              	myScroll.scrollTo(0, -scrollSize);
	              	head.removeClass('up');
	          	} else if (this.y >= 0) {
	              	head.attr('src', '/ULBapp/img/ajax-loader.gif');
	              	// ajax下拉刷新数据
	
	              	$.ajax({
	                url: '/api/getLivelist.php',
	                data: {
	                  rtype: 'refresh'
	                },
	                success: function (rs) {
//	                	console.log(rs.data);
	                  var newArray = rs.data.concat(that.livelistArray);
	                  that.vm.livelist = that.formatData(newArray);
	                  that.livelistArray = newArray;
	                  console.log(that.livelistArray);
					
	                  myScroll.scrollTo(0, -scrollSize);
	                  head.removeClass('up');
	                  head.attr('src', '/ULBapp/img/arrow.png');
	                }
	              })
	
	               setTimeout(function () {
	               }, 1000);
	        	};
				var maxY = this.maxScrollY - this.y;
	          	var self = this;
	          	if (maxY > -scrollSize && maxY < 0) {
	              	myScroll.scrollTo(0, self.maxScrollY + scrollSize);
	              	foot.removeClass('down')
	          	} else if (maxY >= 0) {
	              	foot.attr('src', '/ULBapp/img/ajax-loader.gif');
	              	// ajax上拉加载数据
	
	              	$.ajax({
	                	url: '/api/getLivelist.php',
	                	data: {
	                  	rtype: 'more'
	                	},
	                	success: function (rs) {
	                		
		                  	var newArray = that.livelistArray.concat(rs.data);
		                  	that.vm.livelist = that.formatData(newArray);
		                  	that.livelistArray = newArray;
		                  	myScroll.refresh();
		
		                  	myScroll.scrollTo(0, self.y + scrollSize);
		                  	foot.removeClass('down');
		                  	foot.attr('src', '/ULBapp/img/arrow.png');
	                		console.log(that.livelistArray);
	                	}
	              	});
	          	}
          	})
		}
	}	
});


