//百度地图API功能
function loadJScript() {

	//添加地图的javascript
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src =
		"http://api.map.baidu.com/api?v=2.0&ak=6SlO85D1vOZfmvlht9NYGQ5cEFRK4ZxA&callback=init";
	document.body.appendChild(script);
}

function init() {
	var centerPoint = new BMap.Point(106, 38); //地图初始显示的中心点经纬度
	var initZoom = 5; //初始的缩放比例

	var map = new BMap.Map("footprint-map"); //创建地图实例
	map.centerAndZoom(centerPoint, initZoom); //设置地图中心点和缩放比例
	map.enableScrollWheelZoom(); //启用滚轮放大缩小

	addFootprintLines(map);
}

function addFootprintLines(map) {
	//显示的信息窗口
	var infoWindowTitles = ["2014-09中秋节：北京 -- 成都 -- 峨眉山",
		"2014-11：北京 -- 曼谷 -- 芭提雅", "2015-06端午节：北京 -- 深圳 -- 澳门 -- 香港",
		"2015-08：北京 -- 南京", "2015-10十一：北京 -- 成都 -- 九寨沟 -- 乐山 -- 都江堰",
		"2016-05五一：北京 -- 扬州 -- 苏州 -- 上海"
	];
	var infoWindowMessages = ["和同学一行三人从峨眉山山脚一直爬到山顶，期待中的", "", "", "", "", ""];

	//线条的颜色
	var lineColors = ["#00BCD4", "#FF9800", "#4CAF50", "#607D8B", "#448AFF",
		"#FF5722"
	];

	//2014-09：北京 -> 成都 -> 峨眉山
	var beijing1 = new BMap.Point(116.583404, 39.914874); //北京
	var chengdu1 = new BMap.Point(104.050638, 30.555782); //成都
	var emeishan1 = new BMap.Point(103.34597, 29.526393); //峨眉山金顶
	addFootprints(map, lineColors[0], [beijing1, chengdu1, emeishan1],
		infoWindowTitles[0], infoWindowMessages[0]);

	//2014-11：北京 -> 曼谷 -> 芭提雅
	var beijing2 = new BMap.Point(116.513165, 39.909073); //北京
	var mangu2 = new BMap.Point(100.581133, 13.797391); //曼谷
	var batiya2 = new BMap.Point(100.878005, 12.920579); //芭提雅
	addFootprints(map, lineColors[1], [beijing2, mangu2, batiya2],
		infoWindowTitles[1], infoWindowMessages[1]);

	//2015-06：北京 -- 深圳 -- 澳门 -- 香港
	var beijing3 = new BMap.Point(116.620715, 40.060216); //北京
	var shenzhen3 = new BMap.Point(114.064281, 22.549342); //深圳
	var macao3 = new BMap.Point(113.552516, 22.200608); //澳门
	var hongkong3 = new BMap.Point(114.186702, 22.29263); //香港
	addFootprints(map, lineColors[2], [beijing3, shenzhen3, macao3, hongkong3],
		infoWindowTitles[2], infoWindowMessages[2]);

	//2015-08：北京 -- 南京
	var beijing4 = new BMap.Point(116.388107, 39.872591); //北京
	var nanjing4 = new BMap.Point(118.796267, 32.025945); //南京
	addFootprints(map, lineColors[3], [beijing4, nanjing4],
		infoWindowTitles[3], infoWindowMessages[3]);

	//2015-10：北京 -- 成都 -- 九寨沟 -- 乐山 -- 都江堰
	var beijing5 = new BMap.Point(116.403603, 39.799214); //北京
	var chengdu5 = new BMap.Point(104.020458, 30.710894); //成都
	var jiuzhaigou5 = new BMap.Point(103.938447, 33.244267); //九寨沟
	var leshan5 = new BMap.Point(103.774812, 29.551759); //乐山
	var dujiangyan5 = new BMap.Point(103.615688, 31.008184); //都江堰
	addFootprints(map, lineColors[4], [beijing5, chengdu5, jiuzhaigou5, leshan5,
		dujiangyan5
	], infoWindowTitles[4], infoWindowMessages[4]);

	//2016-05：北京 -- 扬州 -- 苏州 -- 上海
	var beijing6 = new BMap.Point(116.381938, 39.873136); //北京
	var yangzhou6 = new BMap.Point(119.427594, 32.413876); //扬州
	var suzhou6 = new BMap.Point(120.606858, 31.318714); //苏州
	var shanghai6 = new BMap.Point(121.497698, 31.241895); //上海
	addFootprints(map, lineColors[5], [beijing6, yangzhou6, suzhou6, shanghai6],
		infoWindowTitles[5], infoWindowMessages[5]);
}

function addFootprints(map, lineColor, points, title, message) {
	var line = new BMap.Polyline(points, {
		strokeColor: lineColor, //笔画颜色
		strokeWeight: 3, //笔画粗细
		strokeOpacity: 0.7 //笔画透明度
	}); //创建弧线对象
	map.addOverlay(line); //添加到地图中
	addMarkPoints(map, points);
	addLineClickEvent(map, line, title, message);
}

function addMarkPoints(map, points) {
	for (var i = 0; i < points.length; i++) {
		var icon = new BMap.Icon("/assets/images/marker" + (i + 1) + ".png", new BMap
			.Size(30, 60));
		var marker = new BMap.Marker(points[i], {
			icon: icon
		}); // 创建标注
		map.addOverlay(marker); // 将标注添加到地图中
	}
}

function addLineClickEvent(map, line, title, message) {
	line.addEventListener("click", function(e) {
		var opts = {
			width: 220, // 信息窗口宽度
			height: 0, // 信息窗口高度
			title: title, // 信息窗口标题
			enableMessage: false, //设置允许信息窗发送短息
		}
		var infoWindow = new BMap.InfoWindow(message, opts);
		map.openInfoWindow(infoWindow, e.point); //开启信息窗口
	});
}

window.onload = loadJScript; //异步加载地图
