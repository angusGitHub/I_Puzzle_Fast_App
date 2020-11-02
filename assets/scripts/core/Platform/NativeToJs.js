import PlatformManger from "./PlatformManger"

//播放视频ok
cc.palyVideoOk = function(funName){
    console.log("===cc.palyVideoOk==",funName)
    setTimeout(function(){
        PlatformManger.getInstance().palyVideoOk(funName)
    },10)
}
//播放视频失败
cc.palyVideoError = function(funName){
    console.log("===cc.palyVideoError==",funName)
    setTimeout(function(){
        PlatformManger.getInstance().palyVideoError(funName)
    },10)
}
//微信登录成功
cc.wxLoginOk = function(data){
    console.log("===cc.wxLoginOk==",data)
    setTimeout(function(){
        PlatformManger.getInstance().wxLoginOk(data)
    },10)
}
//微信登录失败
cc.wxLoginError = function(data){
    console.log("===cc.wxLoginError==",data)
    setTimeout(function(){
        PlatformManger.getInstance().wxLoginError(data)
    },10)
}

//所有的页面回调
cc.allPageCallBack = function(data){
    console.log("===cc.allPageCallBack==",data)
    setTimeout(function(){
        PlatformManger.getInstance().allPageCallBack(data)
    },10)
}

// cc.onBackFinish