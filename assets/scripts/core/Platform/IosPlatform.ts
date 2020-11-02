

export default class IosPlatform {

    private static instance: IosPlatform = null;

    public static getInstance(): IosPlatform {
        if (IosPlatform.instance == null) {
            IosPlatform.instance = new IosPlatform();
        }
        return IosPlatform.instance;
    }
    className:string =  "AppClient";

    getAppInfo(){
        let methodName = "getAppInfo";
        let data = jsb.reflection.callStaticMethod(this.className,methodName,null)
        console.log("====获取IOS App配置 ==",data)
        let date = JSON.parse(data);
        return date;
    }
    //微信登录
    wxLogin(){
        let methodName = "getWXInfo";
        jsb.reflection.callStaticMethod(this.className,methodName,null)
    }
     //打开网址
    openBrowser(url :string){
        let methodName = "openBrowser:";
        jsb.reflection.callStaticMethod(this.className,methodName,url);
    }
    //显示底部Banner
    showBottomBanner(){
        let methodName = "showBottomBanner";
        jsb.reflection.callStaticMethod(this.className,methodName,null)
    }
    //隐藏Banner
    hideBottomBanner(){
        let methodName = "hideBottomBanner";
        jsb.reflection.callStaticMethod(this.className,methodName,null)
    }

    // showVideo(type: number,param: any){
    //     this.callBackVideo = param;
    //     if (this.platform == Const.Platform.android) {
    //         let jsonStr = {
    //             adType:2,
    //             adPosition:ShareAdvType.androidName[type],
    //         }
    //         let strJson = JSON.stringify(jsonStr)
    //         let className = "org/cocos2dx/javascript/AppClient";
    //         let methodName = "showAd";
    //         let methodSignature = "(Ljava/lang/String;)V";
    //         jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
    //     }else if(this.platform == Const.Platform.ios){
    //         let jsonStr = {
    //             adType:2,
    //             adPosition:ShareAdvType.androidName[type],
    //         }
    //         let strJson = JSON.stringify(jsonStr)
    //         let className = "AppClient";
    //         let methodName = "showAd:";
    //         jsb.reflection.callStaticMethod(className,methodName,strJson)
    //     }else if(this.platform == Const.Platform.browser){
    //         FunUtils.showTip("测试模式视频直接发奖 + " + type);
    //         if (param && param.success) {
    //             param.success(2);
    //         }
    //     }
    // }
}
