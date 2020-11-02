import ShareAdvType from "./ShareAdvType";
import GameDataManager from "../Data/GameDataManager";
import AdaptarManager from "../Adaptar/AdaptarManager";
export default class AndroidPlatform  {

    private static instance: AndroidPlatform = null;

    public static getInstance(): AndroidPlatform {
        if (AndroidPlatform.instance == null) {
            AndroidPlatform.instance = new AndroidPlatform();
        }
        return AndroidPlatform.instance;
    }
    //广告类型
    public static advType = {
        none: 0,            //无
        bigPicture: 1,//大图bigPicture: 3,//大图
        video: 2,//视频
        closeVideo: 3,//可关闭视频
    }
    //页面类型
    public static pageType = {
        setMusic:"setMusic",
        redPacketInfoTipsFail: "redPacketInfoTipsFail",          //恭喜获得 失败
        redPacketInfoTipsPass: "redPacketInfoTipsPass",          //恭喜获得 过关
        redStarFinished: "redStarFinished",             //分红星完成
        drawMoney:"drawMoney",                          //提现界面
        dailyWelfare:"dailyWelfare",                    //每日福利
        shareOutStar:"shareOutStar",                    //抽分红星
        shareoutBonus:"shareoutBonus",                   //每日分红
        everyDaySign:"everyDaySign",                    //每日打卡
        redPackTimer:"redPackTimer",                    //定时红包
        yestdayEveryOneCash:"yestdayEveryOneCash",      //昨日提现
        newUserRedPack:"newUserRedPack",                //新手红包
        loginRedPack:"loginRedPack",                    //登录红包
        openMyFrutis:"openMyFrutis",                    //我的苹果
        showGetFruitsDialog:"showGetFruitsDialog",      //我的苹果
        
    }
    /**
     * ts 调用 Java
     * jsb.reflection.callStaticMethod(className, methodName, methodSignature, parameters...)
     * 例子
     * public doVibrate(isShort: boolean = true) {
     *       jsb.reflection.callStaticMethod("com/xxxx/Admopub/AdmopubHelper", "doVibrate", "(Z)V", isShort)
     * }
     * className，是java中的类名，要带上路径，是相对路径，栗子中的是"com/xxxx/Admopub/AdmopubHelper"
     * methodName，是java类中的静态方法，"doVibrate"
     * methodSignature，是方法签名，看下面的表，栗子中是"(Z)V"
     * parameters，是你需要传入的参数，需要和前面的methodSignature配合使用，栗子中传入的是isShort
     * 
     * 如果有一个方法是public static int func()，那调用如下，其他就不用解释了
     * jsb.reflection.callStaticMethod("com/xxxx/Admopub/AdmopubHelper", "func", "()I");
     * 类型	        签名
     * int	        I
     * float	    F
     * boolean	    Z
     * String	Ljava/lang/String;
     * 
     * 方法签名：
     * (I)V表示参数为一个int，没有返回值的方法
     * (I)I表示参数为一个int，返回值为int的方法
     * (IF)Z表示参数为一个int和一个float，返回值为boolean的方法
     * 
     */
    className:string = "org/cocos2dx/javascript/AppClient";
     //获取信息配置
    getAppInfo(){
        let methodName = "getAppInfo";
        let methodSignature = "()Ljava/lang/String;";
        let data = jsb.reflection.callStaticMethod(this.className,methodName,methodSignature)
        console.log("====获取Java App配置 ==",data)
        let date = JSON.parse(data);
        return date;        
    }
    //微信登录
    wxLogin(){
        let methodName = "getWXInfo";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature)
    }
    //发送数据
    sendInfo(){
        let jsonStr = {
            uid:GameDataManager.getInstance().userData.uid,
            token:GameDataManager.getInstance().userData.loginToken,
            isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
            isShowWelfare:GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "sendInfo";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //打开网址
    openBrowser(url :string){
        let methodName = "openBrowser";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,url)
    }
    //显示底部Banner
    showBottomBanner(){
        let methodName = "showBottomBanner";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature)
    }
    //隐藏Banner
    hideBottomBanner(){
        let methodName = "hideBottomBanner";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature)
    }
    //播放广告视频 （激励视频,全屏视频（可跳过啊）大图 ）
    playAdVideo(advType: number,adPositionType:number,adHeight_1?:number,adWidth?:number,adHeight_2?:number){
        let jsonStr = {
            adType:advType, //类型 1大图 2视频 ,  3可关闭视频 , 
            adPosition:ShareAdvType.androidName[adPositionType],
            adHeight_1:adHeight_1,//大图广告底最高高度
            adHeight_2:adHeight_2,//大图广告底最高高度
            adWidth:adWidth,//大图弹窗宽度
            fullHeight:AdaptarManager.getInstance().fullHeight,//游戏屏幕的高度
            fullWidth:AdaptarManager.getInstance().fullWidth,//游戏屏幕的宽度
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "playAdVideo";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)

    }
    //隐藏大图
    hideBigVideo(){
        let methodName = "hideDialogDatu";
        let methodSignature = "()V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature)
    }
    //打印到本地
    sendLog(eventName:string){
        let jsonStr = {
            eventName:eventName,      
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "PrintLog";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    /**
     * 事件统计
     * @param eventID 
     * @param eventName 
     */
    addOnEvent(eventID:string,eventName:string){
        let jsonStr = {
            eventID:eventID,
            eventName:eventName,      
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "onEvent";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //打开界面 --------------------------

    //打开设置界面
    openSettingPage(){
        let jsonStr = {
            type:AndroidPlatform.pageType.setMusic,
            isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,      
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "openSettingPage";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //打开恭喜获得界面（过关界面）
    openRedPacketInfoTipsPass(moneyTop,moneyBottom){
        let str = {
            type:AndroidPlatform.pageType.redPacketInfoTipsPass,//类型  string类型 我给你传过去什么 你返回什么
            moneyTop:moneyTop, //上面显示的金额
            moneyBottom:moneyBottom,//下面显示的金额
        }
        let strJson = JSON.stringify(str)
        let methodName = "openRedPacketInfoTips";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //打开恭喜获得界面(失败界面)
    openRedPacketInfoTipsFail(moneyTop,moneyBottom){
        let str = {
            type:AndroidPlatform.pageType.redPacketInfoTipsFail,//类型  string类型 我给你传过去什么 你返回什么
            moneyTop:moneyTop, //上面显示的金额
            moneyBottom:moneyBottom,//下面显示的金额
        }
        let strJson = JSON.stringify(str)
        let methodName = "openRedPacketInfoTips";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //打开倒计时分红星完成
    openRedStarFinished(moneyTop,moneyBottom){
        let jsonStr = {
            type:AndroidPlatform.pageType.redStarFinished,
            moneyTop:moneyTop, 
            moneyBottom:moneyBottom,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "redStarFinished";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //提现界面
    openDrawMoneyPage(posType){
        let jsonStr = {
            type:AndroidPlatform.pageType.drawMoney,//类型  string类型 我给你传过去什么 你返回什么
            posType:posType
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "openCashPage";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
       
    }
    //打开每日福利界面
    openDailyWelfarePage(posType){
        let jsonStr = {
            type:AndroidPlatform.pageType.dailyWelfare,
            posType:posType
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "openTaskPage";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }

   
    /**
     * 抽奖(抽分红星)
     */
    openShareOutStarPage(){
        let jsonStr = {
            type:AndroidPlatform.pageType.shareOutStar,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "turntable";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //每日分红
    openShareoutBonusPage(){
        let jsonStr = {
            type:AndroidPlatform.pageType.shareoutBonus,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "openRewardStar";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
       
    }
    //每日打卡
    openEveryDaySignPage(posType){
        let jsonStr = {
            type:AndroidPlatform.pageType.everyDaySign,
            posType:posType
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "everyDaySign";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
       
    }
    //定时红包 
    openRedPackTimerPage(){
        let jsonStr = {
            type:AndroidPlatform.pageType.redPackTimer,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "redPackTimer";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
       
    }
    //定时红包(宝箱)
    redPackTimerResultShow(){
        let jsonStr = {
            type:AndroidPlatform.pageType.redPackTimer,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "redPackTimerResultShow";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    
    }
    //昨日提现
    openYestdayEveryOneCashPage(){
        let jsonStr = {
            type:AndroidPlatform.pageType.yestdayEveryOneCash,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "yestdayEveryOneCash";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //新手红包
    openNewUserRedPackPage(newUserRedPacket){
        let jsonStr = {
            type:AndroidPlatform.pageType.newUserRedPack,
            newMoney:newUserRedPacket,//钱数
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "newUserRedPack";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    //登录红包
    openLoginRedPackPage(loginRedPacketId){
        let jsonStr = {
            type:AndroidPlatform.pageType.loginRedPack,
            loginRedPacketId:loginRedPacketId,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "loginRedPack";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }

    hideCoverImg(){
        let jsonStr = {
            uid:GameDataManager.getInstance().userData.uid,
        }
        let strJson = JSON.stringify(jsonStr)
        let className = "org/cocos2dx/javascript/AppClient";
        let methodName = "hideCoverImg";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
    }
    openMyFrutis(){
        let jsonStr = {
            type:AndroidPlatform.pageType.openMyFrutis,
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "openMyFrutis";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    }
    showGetFruitsDialog(fruits){
        let jsonStr = {
            type:AndroidPlatform.pageType.showGetFruitsDialog,
            fruits:fruits,//奖励的水果数量
        }
        let strJson = JSON.stringify(jsonStr)
        let methodName = "showGetFruitsDialog";
        let methodSignature = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className,methodName,methodSignature,strJson)
    } 
}
