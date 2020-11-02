import Const from "../../game/Const";
import WXUtils from "./WXUtils";
import AndroidPlatform from "./AndroidPlatform";
import IosPlatform from "./IosPlatform";
import DebugHT from "../../game/DebugHT";
import GameDataManager from "../Data/GameDataManager";
import GameUtils from "../Util/GameUtils";
import FightManger from "../../game/fight/FightManger";
import ViewManager from "../View/ViewManager";
import MainSceneManager from "../../scenes/MainSceneManager";



export default class PlatformManger {

    private static instance: PlatformManger = null;

    public static getInstance(): PlatformManger {
        if (PlatformManger.instance == null) {
            PlatformManger.instance = new PlatformManger();
        }
        return PlatformManger.instance;
    }
    platform:number= 0
    initPlatform(){
        if(cc.sys.isBrowser){
            this.platform = Const.Platform.browser;
        }else if(cc.sys.os == cc.sys.OS_ANDROID) {
            this.platform = Const.Platform.android;
        }else if(cc.sys.os == cc.sys.OS_IOS) {
            this.platform = Const.Platform.ios
        }else if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.platform = Const.Platform.wx;
        }
        // this.platform = Const.Platform.browser;
        this.init()
    }
    init(){
        cc.game.on(cc.game.EVENT_HIDE, function () {
            // cc.game.pause()
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            // cc.game.resume()
            
        });

    }
    //分享
    // showShare(type: number, param: any) {
    //     if (this.platform == Const.Platform.wx) {
    //         if (!GameDataManager.getInstance().kaiGuan.isOpenShare) {
    //             if (param && param.success) {
    //                 param.success(2);
    //             }
    //             return ;
    //         }
    //         WXUtils.getInstance().wxShare(type, param);
    //     }else {
    //        GameUtils.showTip("测试模式直接发奖 + " + type);
    //         if (param && param.success) {
    //             param.success(2);
    //         }
    //     }
    // }
    sendLog(str:string){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().sendLog(str)
        }else if(this.platform == Const.Platform.ios){
        }
    }
    
    /**
     * 事件统计
     * @param eventID 
     * @param eventName 
     */
    addOnEvent(eventID:string,eventName:string){
        this.sendLog(eventName)
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().addOnEvent(eventID,eventName)
        }else if(this.platform == Const.Platform.ios){
           
        }else if(this.platform == Const.Platform.browser){

        }
    }
    //登录红包
    openLoginRedPackPage(loginRedPacketId){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openLoginRedPackPage(loginRedPacketId)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("登录红包=")
        }
    }
    //新手红包
    openNewUserRedPackPage(newUserRedPacket){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openNewUserRedPackPage(newUserRedPacket)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("新手红包="+newUserRedPacket)
        }
    }
    //昨日提现
    openYestdayEveryOneCashPage(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openYestdayEveryOneCashPage()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("昨日提现")
        }
    }
    //定时红包
    openRedPackTimerPage(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openRedPackTimerPage()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("定时红包")
            let data = {
                type:AndroidPlatform.pageType.redPackTimer,
                timingRedPacketType:0,//定时红包状态
                timingRedPacketTime:10,//定时红包时间
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
     //定时红包(宝箱)
     redPackTimerResultShow(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().redPackTimerResultShow()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("定时红包(宝箱)")
            let data = {
                type:AndroidPlatform.pageType.redPackTimer,
                timingRedPacketType:0,//定时红包状态
                timingRedPacketTime:100,//定时红包时间
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    //每日打卡
    openEveryDaySignPage(posType){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openEveryDaySignPage(posType)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("每日打卡")
            let data = {
                posType:posType
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    //每日分红
    openShareoutBonusPage(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openShareoutBonusPage()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("每日分红")
        }
    }
     /**
     * 抽奖(抽分红星)
     */
    openShareOutStarPage(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openShareOutStarPage()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("抽分红星界面")
            let data = {
                type:AndroidPlatform.pageType.shareOutStar,
                shareOutStarType:1,//0 没有任何奖励 1 奖励 限时红包 2 道具 
                addMoney:2,//限时红包钱数
                time:20,//限时时间
                tipNum:2//添加的提示道具的数量
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    //打开每日福利
    openDailyWelfarePage(posType){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openDailyWelfarePage(posType)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("显示每日福利界面")
            let data = {
                posType:posType
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)

        } 
    }
    //打开设置界面
    openSettingPage(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openSettingPage()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("显示设置界面")
        }  
    }
    //打开提现界面
    openDrawMoneyPage(posType){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openDrawMoneyPage(posType)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("显示提现界面")
            let data = {
                type:AndroidPlatform.pageType.drawMoney,
                money:GameDataManager.getInstance().userData.money,
                name:"东郡爱我",//名字
                headimgurl:"",//头像
                posType:posType,
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    //打开恭喜获得界面（失败）
    openRedPacketInfoTipsFail(moneyTop,moneyBottom){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openRedPacketInfoTipsFail(moneyTop,moneyBottom)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("显示恭喜获得界面"+AndroidPlatform.pageType.redPacketInfoTipsFail)
            let data = {
                type:AndroidPlatform.pageType.redPacketInfoTipsFail,
                money:GameDataManager.getInstance().userData.money
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    //打开恭喜获得界面(过关)
    openRedPacketInfoTipsPass(moneyTop,moneyBottom){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openRedPacketInfoTipsPass(moneyTop,moneyBottom)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("显示恭喜获得界面"+AndroidPlatform.pageType.redPacketInfoTipsPass)
            let data = {
                type:AndroidPlatform.pageType.redPacketInfoTipsPass,
                money:GameDataManager.getInstance().userData.money
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    /**
     * 打开分红星倒计时结束弹窗
     */
    openRedStarFinished(money_t,money_b){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openRedStarFinished(money_t,money_b)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("打开分红星完成界面")
        }
    }
    openMyFrutis(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openMyFrutis()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("我的苹果")
            let data = {
                fruits:1,
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    showGetFruitsDialog(fruits){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().showGetFruitsDialog(fruits)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("获取苹果")
        }
    }
    //所有界面的回调
    allPageCallBack(jsonData){
        let date = JSON.parse(jsonData);
        // console.log("===allPageCallBack==",jsonData)
        if(date.fruits){//水果
            GameDataManager.getInstance().serverData.tempData.appleNum = date.fruits;
            if(MainSceneManager.getInstance().ViewMain){
                MainSceneManager.getInstance().ViewMain.HeadNode.refreshApple()
            }
        }
        if(date.dailyWelfareNum){//每日福利完成的个数
            GameDataManager.getInstance().serverData.tempData.dailyWelfareNum = date.dailyWelfareNum;
            if(MainSceneManager.getInstance().ViewMain){
                MainSceneManager.getInstance().ViewMain.HeadNode.refreshDailyWelfare()
            }
        }
        if( date.money){ //修改钱
            GameDataManager.getInstance().userData.money = date.money;
            if(MainSceneManager.getInstance().ViewMain){
                MainSceneManager.getInstance().ViewMain.HeadNode.refreshMoney();
            }
            if(MainSceneManager.getInstance().ViewPass){
                MainSceneManager.getInstance().ViewPass.refreshMoney()
            }
        }
        if(date.headimgurl){// 提现 绑定微信 返回头像
            GameDataManager.getInstance().serverData.tempData.headimgurl = date.headimgurl; //头像
            if(MainSceneManager.getInstance().ViewMain){
                MainSceneManager.getInstance().ViewMain.HeadNode.refreshHeadSprite()
            }
            if(MainSceneManager.getInstance().ViewPass){
                MainSceneManager.getInstance().ViewPass.refreshHeadSprite()
            }
        }
        if(date.type == AndroidPlatform.pageType.setMusic){ //设置回调
            GameDataManager.getInstance().userLocalData.setMusicOn(date.isMusicOn)
        }
        if(date.tipNum){ //抽分红星 （提示道具）
            GameDataManager.getInstance().userData.powerNum = date.tipNum;//提示的总数量
            if(MainSceneManager.getInstance().ViewFight){
                MainSceneManager.getInstance().ViewFight.refreshHintLabel()
            }
        }
        if(date.posType == "ViewPass"){
            // FightManger.getInstance().nextLevel()
            ViewManager.getInstance().ShowView("ViewPass")
        } 
        if(date.type == AndroidPlatform.pageType.redPackTimer){//定时红包
            GameDataManager.getInstance().serverData.tempData.timingRedPacketType = date.timingRedPacketType//定时红包状态
            GameDataManager.getInstance().serverData.tempData.timingRedPacketTime = date.timingRedPacketTime//定时红包时间
            if(MainSceneManager.getInstance().ViewFight){
                MainSceneManager.getInstance().ViewFight.setTimingRedPacket()
            }
        }
        
    }
//--------------视频----------------
    callBackVideo:any = null;
    palyVideoError(funName){
        console.log("===palyVideoError==",funName)
        if (this.callBackVideo && this.callBackVideo.success) {
            this.callBackVideo.fail();
            this.callBackVideo = null;
        }
    }
    palyVideoOk(funName){
        console.log("===palyVideoOk==",funName)
        if (this.callBackVideo && this.callBackVideo.success) {
            this.callBackVideo.success();
            this.callBackVideo = null;
        }
    }

    //显示视频
    showVideo(type,param){
        this.callBackVideo = param;
        if (this.platform == Const.Platform.android) {
            this.playAdVideo(AndroidPlatform.advType.video,type)
        }else if(this.platform == Const.Platform.ios){
            // IosPlatform.getInstance().playAdVideo(advType,adPositionType)
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("测试模式视频直接发奖 + " + type);
            this.palyVideoOk(null)
        }
    }
    //显示可关闭视频
    showCloseVideo(type,param){
        this.callBackVideo = param;
        if (this.platform == Const.Platform.android) {
            this.playAdVideo(AndroidPlatform.advType.closeVideo,type)
        }else if(this.platform == Const.Platform.ios){
            // IosPlatform.getInstance().playAdVideo(advType,adPositionType)
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("测试模式视频直接发奖 + " + type);
            this.palyVideoOk(null)
        }
    }
    /**
     * 
     * @param advType 广告类型 1视频 ,  2可关闭视频 , 3大图
     * @param adPositionType  //广告位置类型
     * @param adHeight  //大图广告底最高高度
     * @param adWidth   //大图弹窗宽度
     */
    playAdVideo(advType: number,adPositionType:number,adHeight_1 = null,adWidth = null,adHeight_2 = null){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().playAdVideo(advType,adPositionType,adHeight_1,adWidth,adHeight_2)
        }else if(this.platform == Const.Platform.ios){
            // IosPlatform.getInstance().playAdVideo(advType,adPositionType)
        }else if(this.platform == Const.Platform.browser){

        }
    }
    /**
     * 显示大图
     * @param adHeight //大图广告底最高高度
     * @param adWidth  //大图弹窗宽度
     */
    showBigVideo(adHeight_1,adWidth,adHeight_2 = null){
        if (this.platform == Const.Platform.android) {
            this.playAdVideo(AndroidPlatform.advType.bigPicture,0,adHeight_1,adWidth,adHeight_2)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){

        }
    }
    //隐藏大图
    hideBigVideo(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().hideBigVideo()
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){

        }
    }
    //--------------视频end----------------
//------------------------bander start------------------------
    /**
     * 显示bander
     * @param isShow 是否显示bander true 显示 false 隐藏
     */
    showBanner(isShow: boolean) {
        if(isShow){
            this.showBottomBanner()
        }else{
            this.hideBottomBanner()
        }
    }
    //显示Banner
    showBottomBanner(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().showBottomBanner()
        }else if(this.platform == Const.Platform.ios){
            IosPlatform.getInstance().showBottomBanner()
        }else if(this.platform == Const.Platform.browser){

        }
    }
    //隐藏Banner
    hideBottomBanner(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().hideBottomBanner()
        }else if(this.platform == Const.Platform.ios){
            IosPlatform.getInstance().hideBottomBanner()
        }else if(this.platform == Const.Platform.browser){
        }
    }
    //------------------------bander end------------------------
    //打开网址
    openBrowser(url :string){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().openBrowser(url)
        }else if(this.platform == Const.Platform.ios){
            IosPlatform.getInstance().openBrowser(url)
        }else if(this.platform == Const.Platform.browser){
            cc.sys.openURL(url);
        }
    }
    //发送数据
    sendInfo(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().sendInfo()
        }else if(this.platform == Const.Platform.ios){
           
        }else if(this.platform == Const.Platform.browser){
            
        }
    }
    //微信登录回调
    callBackWxLogin:any = null;
    wxLoginError(funName){
        console.log("===wxLoginError==",funName)
        if (this.callBackWxLogin && this.callBackWxLogin.success) {
            this.callBackWxLogin.fail();
        }
    }
    wxLoginOk(data){
        console.log("===wxLoginOk==",data)
        if (this.callBackWxLogin && this.callBackWxLogin.success) {
            let date = JSON.parse(data);
            this.callBackWxLogin.success(date);
        }
    }
    //微信登录
    wxLogin(param: any){
        this.callBackWxLogin = param
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().wxLogin()
        }else if(this.platform == Const.Platform.ios){
            IosPlatform.getInstance().wxLogin()
        }else if(this.platform == Const.Platform.browser){
            // GameUtils.showTip("微信绑定成功");
            if (param && param.success) {
                let data = {
                    openid:GameDataManager.getInstance().userLocalData.openid,
                    nickname:"测试—东",
                    sex:1,
                    language:"zh_CN",
                    city:"",
                    province:"",
                    country:"AD",
                    headimgurl:"http://thirdwx.qlogo.cn/mmopen/vi_32/73UFconjvSyIGGEATicC3SDROdOhd2w5BdbDLrhZl2cb92duCfXJAObpSB3WCKnVSnL9wR2tfHicUHO54R9uoqvQ/132",
                    privilege:[],
                    unionid:GameDataManager.getInstance().userLocalData.openid
                }
                param.success(data);
            }
        }        
    }
    //获取信息配置
    getAppInfo(){
        if (this.platform == Const.Platform.android) {
            return AndroidPlatform.getInstance().getAppInfo()
        }else if(this.platform == Const.Platform.ios){
            return IosPlatform.getInstance().getAppInfo()
        }else if(this.platform == Const.Platform.browser){
            let date = {
                // imei: "lddTest100",
                imei: GameDataManager.getInstance().userLocalData.openid,
                packageName: DebugHT.Package,
                versionName: "1.3.1",
                channelName: "lddTest10",
                city: "北京",
                isFirstOpen:false,
            }
            return date
        }
    }

    hideCoverImg(){
        if (this.platform == Const.Platform.android) {
            AndroidPlatform.getInstance().hideCoverImg()
        }else if(this.platform == Const.Platform.ios){
           
        }else if(this.platform == Const.Platform.browser){
            GameUtils.showTip("隐藏Android")
        }
    }
}
