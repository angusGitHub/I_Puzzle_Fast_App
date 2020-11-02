// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import Const from "../Const";
import GameDataManager from "../../core/Data/GameDataManager";
import PlatformManger from "../../core/Platform/PlatformManger";
import GameUtils from "../../core/Util/GameUtils";
import AudioManager from "../../core/Audio/AudioManager";
import EventManager from "../../core/Event/EventManager";
import { LoaderManager } from "../../core/Loader/LoaderManager";
import Head from "./Head";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewTop extends cc.Component {

    @property(Head)
    Head:Head = null;

    // LIFE-CYCLE CALLBACKS:
    power:cc.Node = null;

    btn_set:cc.Node = null;

    btn_sign_in:cc.Node = null;
    sign_in_label:cc.Label = null;
    sign_in_sprite:cc.Node = null;
    sign_in_info:cc.Label = null;

    btn_daily_welfare:cc.Node = null;
    daily_welfare_label:cc.Label = null;
    daily_welfare_sprite:cc.Node = null;
    daily_welfare_info:cc.Label = null;

    btn_my_fruit:cc.Node = null;
    my_fruit_label:cc.Label = null;

  

    isTouchBtn:boolean = false;
    onLoad () {
        //设置
        this.btn_set = this.node.getChildByName("btn_set")
        //签到
        this.btn_sign_in = this.node.getChildByName("btn_sign_in");
        this.sign_in_label = this.btn_sign_in.getChildByName("label").getComponent(cc.Label)
        this.sign_in_sprite = this.btn_sign_in.getChildByName("sign_in_sprite")
        this.sign_in_info = this.sign_in_sprite.getChildByName("sign_in_label").getComponent(cc.Label)
        //每日福利
        this.btn_daily_welfare = this.node.getChildByName("btn_daily_welfare");
        this.daily_welfare_label = this.btn_daily_welfare.getChildByName("label").getComponent(cc.Label)
        this.daily_welfare_sprite = this.btn_daily_welfare.getChildByName("daily_welfare_sprite")
        this.daily_welfare_info = this.daily_welfare_sprite.getChildByName("daily_welfare_label").getComponent(cc.Label)
        //我的苹果
        this.btn_my_fruit = this.node.getChildByName("btn_my_fruit");
        this.my_fruit_label = this.btn_my_fruit.getChildByName("label").getComponent(cc.Label)
        this.initAllBtn()
        this.isShowRedPacket()
        this.refreshView()
    }
    refreshView(){
        this.refreshMoney()
        this.refreshSignIn()
        this.refreshDailyWelfare()
        this.refreshApple()
        this.playAni()
    }
 

    isShowRedPacket(){

        if(!GameDataManager.getInstance().kaiGuan.isOpenRedPacket){//红包关闭
            this.btn_sign_in.active = false;
            this.btn_daily_welfare.active = false;
            this.btn_my_fruit.active = false;
            this.btn_set.active = true;
        }else{//红包打开
            this.btn_set.active = false;
            if(!GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare){
                this.btn_daily_welfare.active = false;
            }
            // if(!GameDataManager.getInstance().kaiGuan.isOpenExport){
            //     this.node.getChildByName("btn_export").active = false;
                
            // }else{
            //     this.node.getChildByName("btn_export").active = true;
            //     this.loadExportImg()
            // }
            if(GameDataManager.getInstance().serverData.tempData.newUserRedPacket > 0){ //新手红包
                GameDataManager.getInstance().userData.money = 0;
                let newUserRedPacket = GameDataManager.getInstance().serverData.tempData.newUserRedPacket;
                PlatformManger.getInstance().openNewUserRedPackPage(newUserRedPacket)
                GameDataManager.getInstance().serverData.tempData.newUserRedPacket = 0
            }
            // if(GameDataManager.getInstance().tempData.loginRedPacketId != 0){ //登录红包
            //     let loginRedPacketId = GameDataManager.getInstance().tempData.loginRedPacketId;
            //     PlatformManger.getInstance().openLoginRedPackPage(loginRedPacketId)
            //     GameDataManager.getInstance().tempData.loginRedPacketId = 0;
            // }
        }
        
    }
    playAni(){
        let uid = GameDataManager.getInstance().userData.uid;
        // uid = 2
        let dailyWelfareNum = GameDataManager.getInstance().serverData.tempData.dailyWelfareNum;
        let dailyWelfareTotalNum = GameDataManager.getInstance().serverData.tempData.dailyWelfareTotalNum;
        let signInLevelNum = GameDataManager.getInstance().serverData.tempData.signInLevelNum;
        let signInTotalLevelNum = GameDataManager.getInstance().serverData.tempData.signInTotalLevelNum;
        this.sign_in_sprite.active = false;
        this.daily_welfare_sprite.active = false;
        let tagetNode = this.btn_daily_welfare;
        let sprite = this.daily_welfare_sprite;
        let label = this.daily_welfare_info;
        let isSign = false;
        if(GameDataManager.getInstance().userData.isTopBtnShake){
            sprite = this.sign_in_sprite;
            label = this.sign_in_info;
            tagetNode = this.btn_sign_in;
            isSign = true;
        }
        if(!GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare){
            sprite = this.sign_in_sprite;
            label = this.sign_in_info;
            tagetNode = this.btn_sign_in;
            isSign = true;
        }
        GameDataManager.getInstance().userData.setIsTopBtnShake()
        if(uid % 2 == 0){//偶数
            let tween = cc.tween(tagetNode)
                .delay(2)
                .to(0.2,{scale:1.3,angle:-20})
                .to(0.2,{angle:0})
                .to(0.2,{angle:20})
                .to(0.2,{angle:0})
                .to(0.2,{angle:-20})
                .to(0.2,{angle:0})
                .to(0.2,{angle:20})
                .to(0.2,{angle:0})
                .to(0.2,{scale:1.15,angle:-20})
                .to(0.2,{scale:1,angle:0})
                .delay(2)
                .call(()=>{
                    dailyWelfareNum = GameDataManager.getInstance().serverData.tempData.dailyWelfareNum;
                    dailyWelfareTotalNum = GameDataManager.getInstance().serverData.tempData.dailyWelfareTotalNum;
                    signInLevelNum = GameDataManager.getInstance().serverData.tempData.signInLevelNum;
                    signInTotalLevelNum = GameDataManager.getInstance().serverData.tempData.signInTotalLevelNum;
                    if(!isSign){
                        if(dailyWelfareNum == 0){
                            label.string = " 集勋章就可以提现，每天都能提！"
                        }else if(dailyWelfareNum >= dailyWelfareTotalNum){
                            label.string = GameUtils.format(" 已集齐{1}个勋章，快去提现吧！",dailyWelfareTotalNum)
                        }else{
                            label.string = GameUtils.format(" 再获得{1}个勋章就可以提现了哦！",dailyWelfareTotalNum - dailyWelfareNum)
                        }
                        sprite.active = true;
                    }else{
                        if(signInTotalLevelNum <= signInLevelNum){
                            sprite.active = false;
                        }else{
                            label.string = GameUtils.format(" 再领取{1}个过关红包即可完成打卡！",signInTotalLevelNum - signInLevelNum)
                            sprite.active = true;
                        }
                    }
                })
                .delay(5)
                .call(()=>{
                    sprite.active = false;
                })
                .start()
            tween.clone(tagetNode).repeatForever().start()
        }else{//基数
            let tween = cc.tween(tagetNode)
                .delay(2)
                .to(0.2,{scale:1.3,angle:-20})
                .to(0.2,{angle:0})
                .to(0.2,{angle:20})
                .to(0.2,{angle:0})
                .to(0.2,{angle:-20})
                .to(0.2,{angle:0})
                .to(0.2,{angle:20})
                .to(0.2,{angle:0})
                .to(0.2,{scale:1.15,angle:-20})
                .to(0.2,{scale:1,angle:0})
                .delay(6)
                .start()
            tween.clone(tagetNode).repeatForever().start()
        }

    }
    refreshSignIn(){
        let signInLevelNum = GameDataManager.getInstance().serverData.tempData.signInLevelNum;
        let signInTotalLevelNum = GameDataManager.getInstance().serverData.tempData.signInTotalLevelNum;
        this.sign_in_label.string = GameUtils.format("{1}/{2}",signInLevelNum,signInTotalLevelNum)     
    }
    refreshApple(){
        let appleNum = GameDataManager.getInstance().serverData.tempData.appleNum;
        let appleTotalNum = GameDataManager.getInstance().serverData.tempData.appleTotalNum;
        this.my_fruit_label.string = GameUtils.format("{1}/{2}",appleNum,appleTotalNum)
    }
    refreshDailyWelfare(){
        let dailyWelfareNum = GameDataManager.getInstance().serverData.tempData.dailyWelfareNum;
        let dailyWelfareTotalNum = GameDataManager.getInstance().serverData.tempData.dailyWelfareTotalNum;
        this.daily_welfare_label.string = GameUtils.format("{1}/{2}",dailyWelfareNum,dailyWelfareTotalNum)
    }
    refreshMoney(){
        this.Head.refreshMoney()
    } 
    refreshHeadSprite(){
        this.Head.refreshHeadSprite()
    }
    loadExportImg(){
        let self = this;
        let url = GameDataManager.getInstance().serverData.tempData.exportIconUrl;
        if(url == "null" || url == "" || url == null){
            return;
        }
        LoaderManager.getInstance().loadHttpTexure(url,(texture)=>{
            var sprite  = new cc.SpriteFrame(texture);
            this.node.getChildByName("btn_export").getComponent(cc.Sprite).spriteFrame = sprite;
        })
    }
    btnAllCallBanck(event:cc.Event,name:string){
        if(this.isTouchBtn){
            return
        }
        this.isTouchBtn = true;
        AudioManager.getInstance().playSound("dianji")
        if(name == "btn_draw_money"){ //提现
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shouyetixian.eventID,Const.AndroidEvent.shouyetixian.eventName)
            PlatformManger.getInstance().openDrawMoneyPage("ViewFight")
            this.isTouchBtn = false;
        }else if(name == "btn_daily_welfare"){ //每日福利
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shouyemeirifuli.eventID,Const.AndroidEvent.shouyemeirifuli.eventName)
            this.btn_daily_welfare.stopAllActions()
            this.btn_daily_welfare.scale = 1;
            this.btn_daily_welfare.angle = 0;
            this.daily_welfare_sprite.active = false;
            PlatformManger.getInstance().openDailyWelfarePage("ViewFight");
            this.isTouchBtn = false;
        }else if(name == "btn_sign_in"){ //每日打卡
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shouyedaka.eventID,Const.AndroidEvent.shouyedaka.eventName)
            this.btn_sign_in.stopAllActions()
            this.btn_sign_in.scale = 1;
            this.btn_sign_in.angle = 0;
            this.sign_in_sprite.active = false;
            PlatformManger.getInstance().openEveryDaySignPage("ViewMain")
            this.isTouchBtn = false;
        }else if(name == "btn_my_fruit"){ //我的水果
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shouyeshuiguo.eventID,Const.AndroidEvent.shouyeshuiguo.eventName)
            PlatformManger.getInstance().openMyFrutis() //我的水果
            this.isTouchBtn = false;
        }else if(name == "btn_set"){ //设置
            PlatformManger.getInstance().openSettingPage();
            this.isTouchBtn = false;
        }else{
            
        }
    }
    initAllBtn(){
        let self = this;
        let btnHander = function(btnNode:cc.Node,name:string){
            EventManager.getInstance().addBtnEvent(btnNode,self.node,"ViewTop","btnAllCallBanck",name)
        }

        btnHander(this.btn_set,"btn_set") //设置
        btnHander(this.btn_sign_in,"btn_sign_in") //签到
        btnHander(this.btn_daily_welfare,"btn_daily_welfare") //每日福利
        btnHander(this.btn_my_fruit,"btn_my_fruit") //每日福利
    }
    // update (dt) {}
}
