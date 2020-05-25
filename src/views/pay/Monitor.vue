<template>
<body>
<div class="head">
  <h1>邮储云喇叭监控平台</h1>
  <div class="weather"><span id="showTime"></span></div>
</div>
<div class="mainbox">
  <ul class="clearfix">
    <li style="position:absolute;float:left">
      <div class="boxall">
           <swiper :options="swiperOption" class="allnav" ref="swiper" >
            <swiper-slide><div class="allnav" style="top:10px" id="echart1"></div></swiper-slide>
            <swiper-slide><div class="allnav" style="top:10px" id="echart2"></div></swiper-slide>
            <swiper-slide><div class="allnav" style="top:10px" id="echart3"></div></swiper-slide> 
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-blue" slot="button-prev"></div> 
            <div class="swiper-button-next swiper-button-blue" slot="button-next"></div>
        </swiper> 
      </div>
      <div class="boxall" style="margin-top:3%;margin-bottom:1%">
         <swiper :options="swiperOption" class="allnav" ref="swiper" >
            <swiper-slide><div class="allnav" style="top:10px" id="echart4"></div></swiper-slide>
            <swiper-slide> <div class="allnav" style="top:10px" id="echart5"></div></swiper-slide>
            <swiper-slide><div class="allnav" style="top:10px" id="echart6"></div></swiper-slide> 
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-blue" slot="button-prev"></div> 
            <div class="swiper-button-next swiper-button-blue" slot="button-next"></div>
        </swiper> 
      </div>
    </li>
    <li style="margin-left:30%;display:inline-block">
      <div class="bar">
        <div class="barbox">
          <ul class="clearfix">
            <li class="pulll_left counter">{{orderNum}}</li>
            <li class="pulll_left counter"><span v-if="this.orderAmount">￥</span>{{orderAmount}}</li>
          </ul>
        </div>
        <div class="barbox2">
          <ul class="clearfix">
            <li class="pulll_right">实时交易金额 </li>
            <li class="pulll_right">实时交易量</li>
          </ul>
        </div>
      </div>
      <div class="map">
         <!-- <div class="map1"><img src="static/picture/lbx.png"></div> -->
        <!-- <div class="map2"><img src="static/picture/jt.png"></div> -->
        <!-- <div class="map3"><img src="static/picture/map.png"></div>  -->
        <div class="map4" id="map_1"></div>
      </div>
    </li>
    <li style="float:right;position:absolute;margin-left:69.9%">
        <div class="boxall">
            <div class="alltitle" style="margin-bottom:15px;height:1.3rem;font-size:1rem">实时动态</div>
			<div class="tablebox">
					<div class="tbl-header">
						<table border="0" cellspacing="0" cellpadding="0">
							<thead>
								<tr>
									<th>机构名称</th>
									<th>商户名称</th>
									<th>交易金额</th>
									<th>交易时间</th>
								</tr>
							</thead>
							<tbody style="opacity:0;">
                            </tbody>
						</table>
					</div>
					<div class="tbl-body">
						<table border="0" cellspacing="0" cellpadding="0">
							<thead>
								<tr>
									<th>机构名称</th>
									<th>商户名称</th>
									<th>交易金额</th>
									<th>交易时间</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
                <div ref="parentTable" class="wrap">
                        <ul ref="ul">
                            <li v-for="(item,index) in tableData"
							:key="index"> 
                             <p ref="p" class="p">
                                <span>{{item.businessName}}</span>
                                <span class="span" style="margin-left:1%">{{item.organName}}</span>
                                <span class="span" style="margin-left:3%">{{item.sum}}</span>
                                <span class="span" style="width:28%">{{item.transactionTime}}</span>
                             </p>     
                            </li>
                        </ul>
                </div>
		</div>
         <div class="boxall" ref="rightBottom" style="margin-top:3%;margin-bottom:1%;">
         <swiper :options="swiperOption" class="allnav" ref="swiper" >
            <swiper-slide> <div class="allnav" style="top:10px" id="echart7"></div></swiper-slide>
             <swiper-slide><div class="allnav" style="top:10px" id="echart8"></div></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-blue" slot="button-prev"></div> 
            <div class="swiper-button-next swiper-button-blue" slot="button-next"></div>
        </swiper> 
        </div> 
    </li>
  </ul>
</div>
<div class="back"></div>
</body>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import 'echarts/map/js/china.js';
import countTo from 'vue-count-to';
import "../assets/css/comon.css";
import '../assets/js/jquery.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
require('swiper/dist/css/swiper.css')

export default {
	name: 'Monitor',
	components: {countTo,swiper, swiperSlide},
	data () {
    return {
	  orderNum: '',       // 默认交易量
	  orderAmount: '',    //默认交易金额
	  transVolumnRank:[], //交易量排名
      transLineRank:[],   //交易额度排名
      transMerRank:[],    //交易商户数排名
	  tableData:[],       //table页数据
	  totalCustomer:[],   //商户交易数
	  totalCount:[],      //交易总笔数
      totalAmount:[],     //交易总金额
      maxAmt: '',         //各时段最大交易额
      maxCount: '',       //各时段最大交易量
      maxMcht: '',        //各时段最大商户数
      channel_list:[],    //渠道列表 （支付宝，微信,银联）
      push_list:[],       //推送厂商列表（新国都...）
      swiperOption: {
    　　pagination: {
    　　　　el: '.swiper-pagination',
    　　　　clickable: true // 允许点击小圆点跳转
    　　},
    　　autoplay: {
    　　　　delay: 5000,
    　　　　disableOnInteraction: false // 手动切换之后继续自动轮播
    　　},
    // 　　loop: true,
        // 设定初始化时slide的索引
    //    initialSlide: 0,
    　　navigation: {
    　　　　nextEl: '.swiper-button-next',
    　　　　prevEl: '.swiper-button-prev',
    　　}
      },
    }
  },
    created(){

    },
    mounted(){
      this.shwoTime();
      this.connWebsocket();
    },
    methods:{
        //获取数据
         connWebsocket:function() {
                var _this = this;
                var tableObject = {
                    businessName:'测试机构',
                    organName:'测试商户',
                    sum:'100',
                    transactionTime:'09:02:02'
                    }
                    for(var i = 1; i < 7;i++){
                        _this.tableData.push(tableObject);
                    }
				var wsurl = 'ws://127.0.0.1:9010/websocket';
                // var wsurl = 'ws://106.13.148.11:9010/websocket';
				var websocket;
				var i = 0;
				if (window.WebSocket) {
					websocket = new WebSocket(wsurl);
					//连接建立
					websocket.onopen = function(evevt) {
						// alert("链接成功");
					}
					//收到消息
					websocket.onmessage = function(event) {
						//接收后台消息后转换为对象
						var receive = event.data;
						var map = JSON.parse(receive);
						// //交易量和交易金额
						var tolAdAmt = map.tolAdAmt;
						_this.orderNum = tolAdAmt.trans_count;
						_this.orderAmount = tolAdAmt.total_amount;

						//交易明细列表
						var transDetails = map.transDetails;
						var tableObject = {
							businessName:'',
							organName:'',
							sum:'',
							transactionTime:''
						}
						if(null != transDetails && null != transDetails.org_name){
							tableObject.businessName = transDetails.org_name;
							tableObject.organName = transDetails.mer_name;
							tableObject.sum = transDetails.request_data;
							tableObject.transactionTime = transDetails.trans_time;
							_this.tableData.push(tableObject);
						}
						//开始执行页面滚动
						if(_this.tableData.length != 0){
                            _this.removeTable(_this);
						}
                        debugger
						//交易金额和交易量排名
						var cityTolAdAmt = map.provinceRank;
						var city_tol_list = cityTolAdAmt.province_tol_list;
						_this.transVolumnRank = city_tol_list;
						var city_amt_list = cityTolAdAmt.province_amt_list;
                        _this.transLineRank = city_amt_list;
                        var city_mer_list = cityTolAdAmt.province_mcht_list;
                        _this.transMerRank = city_mer_list;
						//地图显示
						var allProTol = map.allProTol;
						allProTol.forEach(rankItem => {
							// 修改原有的总笔数
                            _this.GLOBAL.countMap.forEach(itemCount => {
							if(itemCount.name == rankItem.name){
								itemCount.value = rankItem.count;
							  }
                            })
						    //修改原有的总金额
						    _this.GLOBAL.amountMap.forEach(itemAmount => {
							if(itemAmount.name == rankItem.name){
                                itemAmount.value = rankItem.amount;
                                if(null != rankItem.merchant){
                                     itemAmount.mercount = rankItem.merchant;
                                }
							}
						    })
						})
						//曲线图
						var diagram = map.diagram;
						if(_this.totalAmount.length < 14){
                            _this.totalCustomer = diagram.mcht_list;
					        _this.totalCount = diagram.count_list;
                            _this.totalAmount = diagram.amt_list;
                            _this.maxAmt = diagram.max_amt;
                            _this.maxCount = diagram.max_count;
                            _this.maxMcht = diagram.max_mcht;
                        }
                        //饼状图
                        var pieCharts = map.pieCharts;
                        if(null != pieCharts){
                            _this.channel_list = pieCharts.channel_list;
                            _this.push_list = pieCharts.push_list;
                        }
                        _this.initMap();
                        _this.initData();
					}
					//发生错误
					websocket.onerror = function(event) {
						alert("发生错误！");
					}
					//连接关闭
					websocket.onclose = function(event) {
						alert("关闭连接！")
					}
					function send() {
						var msg = 123;
						try {
							websocket.send(JSON.stringify(msg));
						} catch (ex) {
							console.log(ex);
						}
					}
					//按下enter键发送消息
					$(window).keydown(function(event) {
						if (event.keyCode == 13) {
							console.log('user enter');
							send();
						}
					});
					//点发送按钮发送消息
					$('.send').bind('click', function() {
						send();
					});

				} else {
					alert('该浏览器不支持web socket');
				}
        },
       //加载初地图以外的其他动画 
        initData:function(){
            var _this = this;
            //交易排名轮播
            for(let i = 1; i < 4; i++){
               echarts_1(_this,'echart'+ i);
            }
            //曲线图轮播
            for(let i = 4; i < 7; i++ ){
              echarts_4(_this,'echart'+ i);
            }
            //饼状图轮播
            for(let i = 7; i < 9; i ++){
               echarts_7(_this,'echart' + i);
            }

            function echarts_1(_this,demo) {
                // 基于准备好的dom，初始化echarts实例
                var echarts = require('echarts')
                var myChart = echarts.init(document.getElementById(demo));
                var data = [];
                var titlename = [];
                var myColor =['#8B78F6','#0e5ebbd9','#56D0E3'];
                var text;
                if('echart1' == demo){
                    _this.transVolumnRank.forEach(item => {
                   if(null != item){
                       data.push(item.trans_count);
                       titlename.push(item.province_name);
                   }
                   });
                   text = '交易量排名';
                }
                if('echart2' == demo){
                  _this.transLineRank.forEach(item => {
                   if(null != item){
                       data.push(item.total_amount);
                       titlename.push(item.province_name);
                   }
                  });
                  text = '交易金额排名';
                }
                if('echart3' == demo){
                   _this.transMerRank.forEach(item => {
                   if(null != item){
                       data.push(item.mcht_count);
                       titlename.push(item.province_name);
                   }
                   });
                  text = '交易商户数排名';
                }
                var option = {
                    title: {
                        text: text,
                        x: 'center',
                        textStyle: {
                            color: '#FFF'
                        },
                        left: '13%',
                        top: '5%'
                    },
                    //图标位置
                    grid: {
                        top: '15%',
                        left: '22%'
                    },
                    xAxis: {
                        show: false
                    },
                    yAxis: [{
                        show: true,
                        data: titlename,
                        inverse: true,
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#fff',
                            formatter: (value, index) => {
                                return [
                                    '{title|' + value + '} '
                                ].join('\n')
                            },
                            rich: {
                                lg: {
                                    backgroundColor: '#339911',
                                    color: '#fff',
                                    borderRadius: 15,
                                    // padding: 5,
                                    align: 'center',
                                    width: 15,
                                    height: 15
                                },
                            }
                        },
                    },
                    {
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },

                    }],
                    series: [{
                        name: '条',
                        type: 'bar',
                        yAxisIndex: 0,
                        data: data,
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: function(params) {
                                    var num = myColor.length;
                                    return myColor[params.dataIndex % num]
                                },
                            }
                        },
                        label: {
                            normal: {
                                color:'#fff',
                                show: false,
                                position: 'insideRight',
                                formatter: '{c}'
                            }
                        },
                    }, 
                  ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            }

            //排名图
            function echarts_4(_this,demo) {
                // 基于准备好的dom，初始化echarts实例
                var echarts = require('echarts')
                var myChart = echarts.init(document.getElementById(demo));
                var bankData;  //后台数据
                var bankColor; //曲线颜色
                var bankName;  //对应变量
                var unit;      //单位
                var max;       //最大值
                if('echart4' == demo){
                   bankData = _this.totalCustomer;
                   bankColor = '#0184d5';
                   bankName = '交易商户数';
                   unit = '户';
                   max = _this.maxMcht > 1000 ? 1000 * 2 : 1000; 
                }
                if('echart5'== demo){
                   bankData = _this.totalCount;
                   bankColor = '#00d887';
                   bankName = '交易总笔数';
                   unit = '笔';
                   max = _this.maxCount > 100000 ? 100000 * 2 : 100000;
                }
                if('echart6'== demo){
                   bankData = _this.totalAmount;
                   bankColor = '#a53379';
                   bankName = '交易总金额';
                   unit = '万元';
                   max = _this.maxAmt > 1000 ? 1000 * 3 : 1000;
                }
                var option = {
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                legend: {
                top:'0%',
                    data:[bankName],
                            textStyle: {
                    color: 'rgba(255,255,255,.5)',
                        fontSize:'12',
                    }
                },
                grid: {
                    left: '10',
                    top: '30',
                    right: '10',
                    bottom: '10',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel:  {
                            textStyle: {
                                color: "rgba(255,255,255,.6)",
                                fontSize:10,
                            },
                            interval: 2,
                        },
                    axisLine: {
                        lineStyle: { 
                            color: 'rgba(255,255,255,.2)'
                        }
                    },
                    data: ['00:00','01:00', '02:00','03:00',  '04:00', '05:00',  '06:00', '07:00',  '08:00', '09:00', 
                    '10:00',  '11:00', '12:00', '13:00',  '14:00',  '15:00', '16:00', '17:00',  '18:00','19:00', '20:00', 
                    '21:00',  '22:00', '23:00', '24:00']
                },
                {
                    axisPointer: {show: false},
                    axisLine: {  show: false}, 
                    position: 'bottom',
                    offset: 20,
                }],
                yAxis: [{
                    name: unit,
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    min: 0,
                    max: max,
                    axisLabel:  {
                            textStyle: {
                                color: "rgba(255,255,255,.6)",
                                fontSize:10,
                            },
                        },

                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }],
                series: [
                    {
                    name: bankName,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: bankColor,
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(1, 132, 213, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(1, 132, 213, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                        itemStyle: {
                        normal: {
                            color: bankColor,
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: bankData
                  } 
                 ]
                };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    window.addEventListener("resize",function(){
                        myChart.resize();
                    });
                }

                //饼状图轮播
                function echarts_7(_this,demo){
                    var echarts = require('echarts')
                    var myChart = echarts.init(document.getElementById(demo));
                    var textArr = [];    //统计常量
                    var colorArr = [];   // 颜色分布
                    var dataArr = [];    //常量数据百分比
                    var seriesArr = [];  //画图数组
                    var newObj = [];     //for循环中的新对象数组
                    var valueArr = [];   //实际值数组
                    var radiusArr = [];  //饼状图面积分布
                    var seriesObject = {  
                        value: '',
                        name: '',
                        label: {
                            normal: {
                                formatter: '',
                                textStyle: {
                                    fontSize: 20,
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: ''
                            },
                            emphasis: {
                                color: ''
                            }
                        },
                    }
                    //支付宝，微信,银联
                    if('echart7' == demo){
                         _this.channel_list.forEach(item => {
                             textArr.push(item.name);
                             valueArr.push(item.count);
                             dataArr.push(item.value);
                         })
                         colorArr = ['#8B78F6','#56D0E3','#0e5ebbd9','#e6a23ceb'];
                         radiusArr = ['50%','60%'];
                         readData(textArr,dataArr,colorArr);
                    }
                    //十家供应商
                    if('echart8' == demo){
                         _this.push_list.forEach(item => {
                             textArr.push(item.name);
                             valueArr.push(item.count);
                             dataArr.push(item.value);
                        })
                         colorArr = ['#8B78F6','#56D0E3','#0e5ebbd9','#e6a23ceb','#67c23a','#02b584','#5802b5','#aa02b5','#02b573','#b50233'];
                         radiusArr = ['0', '60%'];
                         readData(textArr,dataArr,colorArr);
                    }

                    function readData(textArr,dataArr,colorArr){
                       for(let i = 0; i < textArr.length;i++){
                             newObj[i] = {
                                value: '',
                                name: '',
                                label: {
                                    normal: {
                                        formatter: '',
                                        textStyle: {
                                            fontSize: 12,
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: ''
                                    },
                                    emphasis: {
                                        color: ''
                                    }
                                },
                             };
                             newObj[i].value = valueArr[i];
                             newObj[i].name = textArr[i];
                             newObj[i].label.normal.formatter = dataArr[i] + '%';
                             newObj[i].itemStyle.normal.color = colorArr[i];
                             newObj[i].itemStyle.emphasis.color = colorArr[i];
                             seriesArr.push(newObj[i]);
                       }
                    }

                    var option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        legend: {
                            icon: 'circle',
                            orient:'horizontal',
                            left: 0,
                            top: 3,
                            itemGap: 10,
                            data: textArr,
                            textStyle:{
                                fontSize:10,
                                color:'rgba(255,255,255,.6)'
                            }
                        },
                        series: [
                            {
                                name:'详细信息',
                                type:'pie',
                                radius: radiusArr,
                                avoidLabelOverlap: true,
                                label: {
                                    normal: {
                                        // position: 'inner',
                                        formatter: '{c}',
                                        show: true,
                                    },
                                
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: seriesArr,
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    window.addEventListener("resize",function(){
                        myChart.resize();
                    });
                }
        },
         
        //中间地图
        initMap:function (){
                // 基于准备好的dom，初始化echarts实例
                var echarts = require('echarts');
                var myChart = echarts.init(document.getElementById('map_1'));
                var geoCoordMap = this.GLOBAL.countMap;
                var count = this.GLOBAL.amountMap;
                var option = {
                    tooltip : {//提示框组件。
                        trigger: 'item',//数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                        formatter: function (params) {
                            if(params.value == "undefined"){
                                return params.name + ' : ' + params.value;
                            }else{
                                var toolTiphtml = ' ';
                                for(var i = 0;i<count.length;i++){
                                    if(params.name==count[i].name){
                                        toolTiphtml = params.name + '<br>交易总笔数:' + params.value;
                                        toolTiphtml+="<br>交易总额度:"+ count[i].value;
                                        toolTiphtml+="<br>交易商户数:"+ count[i].mercount;
                                    }
                                }
                                return toolTiphtml;
                            }
                        }
                    },
                    // backgroundColor: '#000',//画布背景颜色
                    geo: {
                        show: true,
                        map: 'china',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false,
                            }
                        },
                        roam: false,//地图设置不可拖拽，固定的
                        itemStyle: {
                            normal: {
                                areaColor: '#006fff',
                                borderWidth: 0,
                                shadowColor: 'rgba(102,177,255, 1)',
                                shadowBlur: 15
                            }
                        }
                    },
                    visualMap: {//颜色的设置  dataRange
                        x: '65%',
                        y: 'center',
                        show: true,
                        splitList: [
                            {start: 1500,label: '>1500'},
                            {start: 1001, end: 1500,label: '1001-1500'},
                            {start: 501, end: 1000,label: '501-1000'},
                            {start: 201, end: 500,label: '200-500'},
                            {start: 10, end: 200, label: '10-200'},
                            {end: 10, label: '<10'},
                        ],
                        inRange: {  
                            color: ['rgb(22,33,68)','#006fff'] 
                        },
                        textStyle: {
                            color: '#999' // 值域文字颜色
                        },
                        calculable : false,//颜色呈条状
                    },
                    roamController: {//控制地图的上下左右放大缩小 图上没有显示
                        show: true,
                        x: 'right',
                        mapTypeControl: {
                            'china': true
                        }
                    },
                    series : [
                        {
                            type: 'map',
                            mapType: 'china',
                            coordinateSystem: 'geo',
                            roam: false,//是否开启鼠标缩放和平移漫游
                            itemStyle:{//地图区域的多边形 图形样式
                                normal:{//是图形在默认状态下的样式
                                    label:{
                                        show:true,//是否显示标签
                                        textStyle: {
                                            color: "#999"
                                        },
                                    },
                                    borderColor: 'rgba(39,64,121,0.8)',
                                    borderWidth: 1,
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(0,0,0,.1)',
                                    shadowOffsetX: 1,
                                    shadowOffsetY: 1
                                },
                                emphasis: {
                                    areaColor:'#66b1ff',
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    shadowBlur: 0,
                                    borderWidth: 1,
                                    shadowColor: 'rgba(200, 200, 200, 1)',
                                }
                            },
                            // top:"3%",//组件距离容器的距离
                            data:geoCoordMap
                        }
                    ]
                };
                    myChart.setOption(option);
                    window.addEventListener("resize",function(){
                        myChart.resize();
                    });
        },

        //table列表向上滚动
        removeTable:function(_this){
            var html=$(".wrap ul").html()
            var offH = _this.$refs.p[0].offsetHeight *  (_this.tableData.length - 1)
            var pHeight = _this.$refs.p[0].offsetHeight
            var tableHeight = _this.$refs.parentTable.offsetHeight
            if(offH > tableHeight){
                _this.tableData.shift();
            }
        },

        //显示时间
        shwoTime:function(){
            var t = null;
            document.title = '邮储云喇叭监控平台'; 
            t = setTimeout(time,1000);//開始运行
            function time(){
                clearTimeout(t);//清除定时器
                let dt = new Date();
                var y=dt.getFullYear();
                var mt=dt.getMonth()+1;
                var day=dt.getDate();
                var h=dt.getHours();//获取时
                var m=dt.getMinutes();//获取分
                var s=dt.getSeconds();//获取秒
                document.getElementById("showTime").innerHTML = y+"年"+mt+"月"+day+"-"+h+"时"+m+"分"+s+"秒";
                t = setTimeout(time,1000); //设定定时器，循环运行     
            } 
        },
       },
     }
</script>

<style scoped>
.boxall{
    height: 48%;
}
.boxall_1{
    height: 48%;
}
.tablebox {
    height: 12%;
    overflow: hidden;
    position: relative;
    width: 100%;
}

.tbl-header {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
}

.tbl-body {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
.tablebox table {
    width: 100%;
}

.tablebox table th,
.tablebox table td {
    font-size: 18px;
    color: #fff;
    line-height: 40px;
    text-align: center;
}

.tablebox table tr th {
    background-color: #3a5ac22e;
    cursor: pointer;
}

.tablebox table tr td {
	height: 40px;
	color: #67c23a;
}

.tbl-body tr:nth-child(even) td,.tbl-body1 tr:nth-child(even) td {
    background-color: #2302b5f8;
}

.tablebox table tr td span,
.tablebox table tr td span {
    font-size: 24px;
}
.wrap .p span{
    display: inline-block;
    width: 20%;
    color: rgba(255,255,255,.6);
    font-size: 0.8rem
}
.span {
    text-align: center
}
.clearfix .pulll_left span {
    font-size:2.0rem;
    color:'#fff' !important;
}
</style>