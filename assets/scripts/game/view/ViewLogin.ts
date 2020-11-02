import BaseView from "../../core/View/BaseView";
import PlatformManger from "../../core/Platform/PlatformManger";
import Const from "../Const";
import GameDataManager from "../../core/Data/GameDataManager";
import DebugHT from "../DebugHT";
import GameUtils from "../../core/Util/GameUtils";
import HttpCallBack from "../../core/Net/HttpCallBack";
import FightPoolManger from "../fight/FightPoolManger";
import { ConfigManager } from "../../core/JsonConfig/ConfigManager";
import ViewManager from "../../core/View/ViewManager";
import AudioManager from "../../core/Audio/AudioManager";
import EventManager from "../../core/Event/EventManager";
import FightManger from "../fight/FightManger";



const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewLogin extends BaseView {

    progressBar: cc.ProgressBar = null;//
    label_pro: cc.Label = null;//
    labelLoading: cc.Label = null;//
    btnLogin: cc.Node = null;//
    btnWxLogin: cc.Node = null;//
    toggle: cc.Toggle = null;
    newPro : number = 0;
    maxPro : number = 0;
    lastMaxPro : number = 0;
    updateTime :number = 0;
    appInfoData = null;
    startLogin:boolean = false;
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.toggle = this.node.getChildByName("toggle").getComponent(cc.Toggle);
        this.btnWxLogin = this.node.getChildByName("btn_wxlogin");
        this.btnLogin = this.node.getChildByName("btn_login");
        this.labelLoading = this.node.getChildByName("label_loading").getComponent(cc.Label);
        this.label_pro = this.node.getChildByName("label_pro").getComponent(cc.Label);
        this.progressBar = this.node.getChildByName("progressBar").getComponent(cc.ProgressBar);
        PlatformManger.getInstance().hideCoverImg();
        if(PlatformManger.getInstance().platform == Const.Platform.ios){
            this.label_pro.node.active = false;
        }
        this.toggle.isChecked = true;
        this.showLogin()
        this.initAllBtn()
    }
    showLogin () {
        if(GameDataManager.getInstance().userData.loginToken){
            this.setBoolShow(false);
            this.getInfo()
        }else{
            this.setBoolShow(true);
            this.btnLogin.active = false;
            this.btnWxLogin.active = false;
            this.toggle.node.active = false;
            this.showSatrtGameBtn()
        }
    }
    setBoolShow(isbool){
        this.btnLogin.active = isbool;
        this.btnWxLogin.active = isbool;
        this.progressBar.node.active = !isbool;
        this.label_pro.node.active = !isbool;
        this.labelLoading.node.active = !isbool;
        this.startLogin = !isbool;
        this.toggle.node.active = isbool;
        // this.toggle.node.setPosition(this.toggle.node.x,-AdaptarManager.getInstance().fullHeight/2 + 50)
    }
    
    wxLoginSuccess(wxdata){
        let openid = wxdata.openid;
        let nickname = wxdata.nickname;
        let headimgurl = wxdata.headimgurl;
        let unionid = wxdata.unionid;
        this.getToken(openid,nickname,headimgurl,unionid)
    }
    showSatrtGameBtn(){
        let data = PlatformManger.getInstance().getAppInfo()
        this.appInfoData = data;
        let packageName = data.packageName;
        let version = data.versionName;
        HttpCallBack.getInstance().sendIsCanTourist(packageName,version,(responseData)=>{
            if(responseData.code == 200){
                let data = responseData.data;
                if(data.is_shield == 1){
                    this.btnLogin.active = true;
                }
            }
            this.btnWxLogin.active = true;
            this.toggle.node.active = true;
        })
    }
    //获取token
    getToken(openid,nickname,headimgurl,unionid){
        this.refreshLoadInfo(0.1, "获取APP信息...");
        let data = PlatformManger.getInstance().getAppInfo()
        this.appInfoData = data;
        let equipment = data.imei;
        let packageName = data.packageName;
        let channel = data.channelName;
        let version = data.versionName;
        let city = data.city;
        DebugHT.VERSION = version;
        let str = GameUtils.format("equipment:{1},packageName:{2},channel:{3},version:{4}",equipment,packageName,channel,version)
        PlatformManger.getInstance().sendLog(str)
        this.refreshLoadInfo(0.2, "正在加载配置信息...");
        let callback = function(responseText){
            if(responseText.code == 200){
                this.httpSendLevelData()
            }else{
                GameDataManager.getInstance().userData.loginToken = null;
                this.setBoolShow(true)
            }        
        }.bind(this)
        HttpCallBack.getInstance().getToken(equipment,packageName,channel,version,openid,nickname,headimgurl,unionid,city,callback)
    }
    //获取个人信息
    getInfo(){
        this.refreshLoadInfo(0.1, "获取APP信息...");
        let data = PlatformManger.getInstance().getAppInfo()
        this.appInfoData = data;
        let city = data.city;
        let channel = data.channelName;
        let version = data.versionName;
        DebugHT.VERSION = version;
        this.refreshLoadInfo(0.2, "获取配置信息...");
        let callback = function(responseText){
            if(responseText.code == 200){
                this.httpSendLevelData()
            }else{
                GameDataManager.getInstance().userData.loginToken = null;
                this.setBoolShow(true)
            } 
        }.bind(this)
        HttpCallBack.getInstance().getInfo(city,channel,version,callback)
    }
    //关卡信息
    httpSendLevelData(){
        this.refreshLoadInfo(0.4, "加载关卡信息...");
        // let callback = function(){
        //     this.httpSendLoginRedPacket()
        // }.bind(this)
        // HttpCallBack.getInstance().sendLevelData(callback)
        this.httpSendLoginRedPacket()
    }
    // 登录红包
    httpSendLoginRedPacket(){
        this.refreshLoadInfo(0.3, "加载关卡信息...");
        // let callback = function(){
        //     this.sendInfo();
        // }.bind(this)
        // HttpCallBack.getInstance().getLoginRedPacket(callback)

        this.sendInfo();
    }
    //-----------发送给android信息---------
    sendInfo(){
        PlatformManger.getInstance().sendInfo()
        this.loadAllPool()
    }
    //-----------加载所有的对象池---------
    loadAllPool(){
        this.refreshLoadInfo(0.6, "加载预制体...");
        FightPoolManger.getInstance().loadResPrefabArr(()=>{
            // this.loadAllJson()
            this.proload()
        })
    }
    //pro -----预加载---
    proload(){
        FightManger.getInstance().preload(GameDataManager.getInstance().userData.level,()=>{
            this.getoViewGame()  
        })
    }
    //-----------加载所有的json---------
    loadAllJson(){
        this.refreshLoadInfo(0.8, "加载Json...");

        ConfigManager.getInstance().loadAllConfig(()=>{
            this.getoViewGame()        
        })
    }
    getoViewGame(){
        this.refreshLoadInfo(1,"进入游戏中...");
        ViewManager.getInstance().ShowView("ViewMain");
    }
   
    //刷新进图条的值
    updateProgressValue(){
        let add = 0.06;
        if (this.newPro > this.maxPro) {
            add = 0.01;
        }
        if (this.newPro < this.lastMaxPro) {
            add = 0.2;
        }
        let value = this.newPro + add;
        if (value > 1) {
            value = 1;
        }
        this.refreshProgress(value);
    }
    refreshProgress(value:number){
        this.progressBar.progress = value;
        let num = (value* 100).toFixed(0) 
        this.label_pro.string =GameUtils.format("{1}%",num)
        this.newPro = value;
    }
    refreshLoadInfo(maxPro:number,tip:string){
        this.labelLoading.string = tip
        this.lastMaxPro = this.maxPro;
        this.maxPro = maxPro;
        PlatformManger.getInstance().sendLog(tip)
    }
    btnAllCallBanck(event:cc.Event,name:string){
        AudioManager.getInstance().playSound("dianji")
        if(name == "btn_login"){//开始游戏
            if(this.toggle.isChecked){
                this.setBoolShow(false);
                this.getToken(null,null,null,null)
            }else{
                GameUtils.showTip("请勾选用户协议")
            }
        }else if(name == "btn_wxlogin"){//微信登录

            if(this.toggle.isChecked){
                PlatformManger.getInstance().wxLogin({
                    success: function (data) {
                        this.setBoolShow(false);
                        this.wxLoginSuccess(data)
                    }.bind(this),
                    fail: function () {
                        GameUtils.showTip("微信绑定失败!")
                    }.bind(this)
                });
            }else{
                GameUtils.showTip("请勾选用户协议")
            }
        }else if(name == "btn_yszc"){//隐私协议
            let url = Const.Url.HttpYSZC;
            if(DebugHT.isDebug){
                let url = Const.Url.HttpTestYSZC;
            }
            PlatformManger.getInstance().openBrowser(url);
        }else if(name == "btn_yhxy"){//用户协议
            let url = Const.Url.HttpYHXY;
            if(DebugHT.isDebug){
                let url = Const.Url.HttpTestYHXY;
            }
            PlatformManger.getInstance().openBrowser(url)
        }else{
            
        }
    }
    initAllBtn(){
        let self = this;
        let btnHander = function(btnNode:cc.Node,name:string){
            EventManager.getInstance().addBtnEvent(btnNode,self.node,"ViewLogin","btnAllCallBanck",name)
        }
        let toggle = this.node.getChildByName("toggle")
        btnHander(this.node.getChildByName("btn_login"),"btn_login") //开始游戏
        btnHander(this.node.getChildByName("btn_wxlogin"),"btn_wxlogin") //微信登录
        btnHander(toggle.getChildByName("btn_yszc"),"btn_yszc") //隐私协议
        btnHander(toggle.getChildByName("btn_yhxy"),"btn_yhxy") //用户协议
    }
    update (dt) {
        if(!this.startLogin){
            this.newPro = 0;
            this.maxPro = 0;
            this.lastMaxPro = 0;
            this.updateTime = 0;
            return;
        }
        if(this.updateTime < 5){
            this.updateTime ++;
        }else{
            this.updateTime = 0
            this.updateProgressValue()
        }
    }
}
