//实际前端更关注的指标，图片加载，html加载，首个接口，所有接口 完成实际
function getCompleteTiming(){
    let t = window.performance.timing;

    return {
        //在最后一张图出来的时候打时间点
        imgAllLoaded: { val: window.lastImgLoadTime - t.navigationStart, des: '首屏图片加载完成'},
        //在HTML后打时间点
        htmlLoaded: { val: window.loadHtmlTime - t.navigationStart, des: 'HTML加载完成'},
        //在首屏的接口打时间点
        requestLoaded: { val: Report.SPEED.MAINCGI - t.navigationStart, des: '首屏接口完成加载完成'},
        //在所有接口打时间点
        requestAllLoaded: { val: Report.SPEED.LASTCGI - t.navigationStart, des: '接口完成加载完成'}
    }
}