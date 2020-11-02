

export default class Const {

    //平台
    static Platform = {
        normal: 0,
        android: 1,//安卓
        ios: 2,//ios
        browser:3,//浏览器
        wx: 4, //微信
    }
    //url 
    static Url = {
        HttpUrl: "http://www.kttread.com/api_v2/",
        HttpUrlTest: "http://120.55.42.179/api_v2/",
        HttpYHXY:"http://www.kttread.com/xieyi/apply.html",//用户协议
        HttpYSZC:"http://www.kttread.com/xieyi/privacy.html", //隐私政策
        HttpTestYHXY:"http://120.55.42.179/xieyi/apply.html",//用户协议test
        HttpTestYSZC:"http://120.55.42.179/xieyi/privacy.html", //隐私政策test
        HttpLevelImg:"https://zc-game.oss-cn-hangzhou.aliyuncs.com/puzzle/puzzle_img_1/", //隐私政策test
    }
    //体力
    static Power = {
        recover_inteval:5*60*1000,//恢复间隔
        maxNum:5,//最大的数量
        videoAddNum:1,//看视频添加体力的数量
        levelNum:-1,//关卡需要的体力
    }
    static AndroidEvent = {
        tixian:{
            eventID:"tixian",
            eventName:"游戏提现(头像)-界面-点击"
        },
        dingshihongbao:{
            eventID:"dingshihongbao",
            eventName:"定时红包-界面-点击"
        },
        meirifenhong:{
            eventID:"meirifenhong",
            eventName:"每日分红-界面-点击"
        },
        choufenhong:{
            eventID:"choufenhong",
            eventName:"抽分红星-界面-点击"
        },
        meiritixian:{
            eventID:"meiritixian",
            eventName:"每日提现-界面-点击"
        },
        shipin_tishi:{
            eventID:"shipin-tishi",
            eventName:"提示道具-数量为0-点击"
        },
        tishi:{
            eventID:"tishi",
            eventName:"提示道具-数量不为0-点击"
        },
        shipin_guoguanhongbao:{
            eventID:"shipin-guoguanhongbao",
            eventName:"过关红包-开按钮-看视频"
        },
        guanbiguoguanhongbao:{
            eventID:"guanbiguoguanhongbao",
            eventName:"关闭过关红包-关闭按钮-不看视频"
        },
        shipin_guanbiguoguanhongbao:{
            eventID:"shipin-guanbiguoguanhongbao",
            eventName:"关闭过关红包-关闭按钮-看视频"
        },
        lwmktx:{
            eventID:"lwmktx",
            eventName:"领无门槛提现-红包结果弹窗-点击"
        },
        qutixian:{
            eventID:"qutixian",
            eventName:"去提现-红包结果弹窗-点击"
        },
        shouyedaka:{
            eventID:"shouyedaka",
            eventName:"点击首页打卡"
        },
        shouyemeirifuli:{
            eventID:"shouyemeirifuli",
            eventName:"点击首页的每日福利"
        },
        shouyeshuiguo:{
            eventID:"shouyeshuiguo",
            eventName:"点击首页的领取水果"
        },
        shouyetixian:{
            eventID:"shouyetixian",
            eventName:"点击首页的微信头像或者提现按钮"
        },
        shouyetilijiahao:{
            eventID:"shouyetilijiahao",
            eventName:"点击首页的体力加号按钮"
        },
        guoguanhongbao:{
            eventID:"guoguanhongbao",
            eventName:"点击过关红包弹窗的开按钮"
        },
        guoguantiaoguo:{
            eventID:"guoguantiaoguo",
            eventName:"点击过关红包弹窗的跳过按钮"
        },
    
    }
    
}
