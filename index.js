// 实际前端更关注的指标，方法兼容性太差，暂时不支持
// 1. 首屏图片加载完成
// 2. html加载完成
// 3. 首个接口完成
// 4. 所有接口完成
function getCompleteTiming(){
    let t = window.performance.timing;

    return {
        //在最后一张图出来的时候打时间点
        imgAllLoaded: { key: '首屏图片加载完成', val: window.lastImgLoadTime - t.navigationStart},
        //在HTML后打时间点
        htmlLoaded: { key: 'HTML加载完成', val: window.loadHtmlTime - t.navigationStart },
        //在首屏的接口打时间点
        requestLoaded: { key: '首屏接口完成加载完成', val: typeof Report != 'undefined' ? Report.SPEED.MAINCGI - t.navigationStart : 'not support' },
        //在所有接口打时间点
        requestAllLoaded: { key: '接口完成加载完成', val: typeof Report != 'undefined' ? Report.SPEED.LASTCGI - t.navigationStart : 'not support' }
    }
}

// 计算加载时间
function getPerformanceTiming () {  
    var performance = window.performance;
 
    if (!performance) {
        // 当前浏览器不支持
        console.log('浏览器不支持 performance 接口');
        return;
    }
 
    var t = performance.timing;
	var times = {};

	//【重要】重定向的时间
    //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    times.redirect = {
		val: t.redirectEnd - t.redirectStart,
		des: '重定向的时间'
	};
	
	//【重要】DNS 查询时间
    //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
    times.lookupDomain = {
		val: t.domainLookupEnd - t.domainLookupStart,
		des: 'DNS 查询时间'
	};

	// DNS 缓存时间
    times.appcache = {
		val: t.domainLookupStart - t.fetchStart,
		des: 'DNS 缓存时间'
	};

	// TCP 建立连接完成握手的时间
    times.connect = {
		val: t.connectEnd - t.connectStart,
		des: 'TCP 建立连接完成握手的时间'
	};

	//【重要】读取页面第一个字节的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = {
		val: t.responseStart - t.navigationStart,
		des: '读取页面第一个字节的时间，即白屏时间'
    };

	//【重要】内容加载完成的时间
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.request = {
		val: t.responseEnd - t.requestStart,
		des: '页面内容加载完成的时间，html加载完毕时间'
	};

	//【重要】解析 DOM 树结构的时间
    //【原因】反省下你的 DOM 树嵌套是不是太多了！
    times.domComplete = {
		val: t.domComplete - t.responseEnd,
		des: '解析 DOM 树结构的时间'
	};

    //【重要】domReady时间
    times.domReady = {
		val: t.domContentLoadedEventEnd - t.navigationStart,
		des: '执行 DOMContentLoaded 的时间'
	};
 
    //【重要】页面加载完成的时间
    //【原因】这几乎代表了用户等待页面可用的时间
    times.loadPage = {
		val: t.loadEventEnd - t.navigationStart,
		des: '页面加载完成的时间'
	};
 
    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    times.loadEvent = {
		val: t.loadEventEnd - t.loadEventStart,
		des: '执行 onload 回调函数的时间'
	};
 
    // 卸载页面的时间
    times.unloadEvent = {
		val: t.unloadEventEnd - t.unloadEventStart,
		des: '卸载页面的时间'
	};

    return times;
}

//请求的各种资源（js,图片，样式等）
function getResourceTime(){
    var resourcesObj = window.performance.getEntries();
    var resourceArr = [];
    var len = resourcesObj.length;
    for(var i = len - 1;i >0;i--){
        var temp = {};
        var cur = resourcesObj[i];
        temp.key = cur.name;
        temp.resValue = cur.responseEnd - cur.requestStart + "ms";
        temp.conValue = cur.connectEnd - cur.connectStart + "ms";
        resourceArr.push(temp);
    }
    return resourceArr;
}

//页面的加载方式
function getPageLoadMethod(type){
    var type = window.performance.navigation.type;
    var arr = [];
    var loadMethod = {};
    loadMethod.name = "进入页面的方式";
    var str = "";
    switch(type){
        case 0:
            str = '点击链接、地址栏输入、表单提交、脚本操作等方式加载';
            break;
        case 1:
            str = '通过“重新加载”按钮或者location.reload()方法加载';
            break;
        case 2:
            str = '网页通过“前进”或“后退”按钮加载';
            break;
        default:
            str = '任何其他来源的加载';
            break;
    }
    loadMethod.value = str;
    arr.push(loadMethod);
    return arr;
}

var loadTimes = getPerformanceTiming();
var resourceTimes = TestResource(perObj.getEntries());
var loadMethods = pageLoadMethod(perObj.navigation.type);
console.log("-------页面初始化------------------------");
console.table(loadTimes);
console.log("-------页面请求------------------------");
console.table(resourceTimes);
console.log("-------页面加载方式------------------------");
console.table(loadMethods);