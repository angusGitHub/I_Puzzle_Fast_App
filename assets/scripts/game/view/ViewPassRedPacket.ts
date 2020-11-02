// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../core/View/BaseView";
import Const from "../Const";
import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import PlatformManger from "../../core/Platform/PlatformManger";
import GameUtils from "../../core/Util/GameUtils";
import GameDataManager from "../../core/Data/GameDataManager";
import ViewManager from "../../core/View/ViewManager";
import HttpCallBack from "../../core/Net/HttpCallBack";
import AudioManager from "../../core/Audio/AudioManager";
import ShareAdvType from "../../core/Platform/ShareAdvType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewPassRedPacket extends BaseView {

    @property(cc.Node)
    btnGetRedPacket: cc.Node = null; //开心手下
    @property(cc.Node)
    btnClose: cc.Node = null; //取消
    @property(cc.Node)
    btnSkip: cc.Node = null; //跳过
   
    data:any = null;
    onLoad () {
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnGetRedPacket.on('click', this.onGetRedPacket, this);
        this.btnClose.on('click', this.onCloseAdv, this);
        this.btnSkip.on('click', this.onSkip, this);
        PlatformManger.getInstance().showBanner(true)
    }
    init(data){
        this.data = data;
        this.refreshLabel()
    }
    refreshLabel(){
        let label_num = this.node.getChildByName("label_num").getComponent(cc.Label)
        label_num.string = GameUtils.format("今日剩余红包{1}个",GameDataManager.getInstance().serverData.redPacket.passRedPacketNum)

        let label_money = this.node.getChildByName("label_money").getComponent(cc.Label)
        label_money.string = GameUtils.format("{1}",GameDataManager.getInstance().serverData.redPacket.passRedPacketMoney)
        let yuan = label_money.node.getChildByName("label_yuan")
        let label = label_money as any;
        label._forceUpdateRenderData && label._forceUpdateRenderData(true);
        yuan.x = label.node.width/2;
    }
     //看视频
     onShowVideo(_type,isRedPacket){
        PlatformManger.getInstance().showVideo(_type,{
            success: function () {
                this.showVideoSuccess(isRedPacket)
            }.bind(this),
            fail: function () {
                ViewManager.getInstance().ShowView("ViewPass");
                this.closeUI();
            }.bind(this),
            
            noVideo:function(){

            }.bind(this)
        });
    }
    // 看视频成功
    showVideoSuccess(isRedPacket){
        if(isRedPacket){
            let callback = function(responseData){
                ViewManager.getInstance().ShowView("ViewRedPacket",{Type:"ViewPassRedPacket",Money:responseData.data.add_balance});
                this.closeUI();
            }.bind(this)
            HttpCallBack.getInstance().sendGetMoney(callback)
        }else{
            ViewManager.getInstance().ShowView("ViewPass");
            this.closeUI();
        }
        
    }
    onGetRedPacket(){
        AudioManager.getInstance().playSound("dianji")
        if(GameDataManager.getInstance().serverData.redPacket.isPassVideo){
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_guoguanhongbao.eventID,Const.AndroidEvent.shipin_guoguanhongbao.eventName)
            let type = ShareAdvType.ShareAdvType.passGetRedPacket;
            this.onShowVideo(type,true)
        }else{
            this.showVideoSuccess(true)
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.guoguanhongbao.eventID,Const.AndroidEvent.guoguanhongbao.eventName)
        }
    }
    onCloseAdv(){
        if(GameDataManager.getInstance().serverData.redPacket.isPassVideo){
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_guanbiguoguanhongbao.eventID,Const.AndroidEvent.shipin_guanbiguoguanhongbao.eventName)
            let type = ShareAdvType.ShareAdvType.passGetRedPacketClose;
            this.onShowVideo(type,false)
        }else{
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.guanbiguoguanhongbao.eventID,Const.AndroidEvent.guanbiguoguanhongbao.eventName)
            ViewManager.getInstance().ShowView("ViewPass");
            this.closeUI();
        }
    }
    onCloseUI(){
        AudioManager.getInstance().playSound("dianji")
        let btnType = 1;
        this.onUIClose(btnType)
    }
    onSkip(){
        AudioManager.getInstance().playSound("dianji")
        let btnType = 2;
        this.onUIClose(btnType)
    }
    //
    onUIClose(btnType){
        
        this.btnClose.getComponent(cc.Button).interactable = false;
        this.btnSkip.getComponent(cc.Button).interactable = false;
        if(GameDataManager.getInstance().serverData.redPacket.isOpenPlayCloseVideo){
            let _type = ShareAdvType.ShareAdvType.passVideoClose;
            PlatformManger.getInstance().showCloseVideo(_type,{
                success: function () {
                    ViewManager.getInstance().ShowView("ViewPass");
                    this.closeUI();
                }.bind(this),
                fail: function () {
                    ViewManager.getInstance().ShowView("ViewPass");
                    this.closeUI();
                }.bind(this),
                noVideo:function(){
                    ViewManager.getInstance().ShowView("ViewPass");
                    this.closeUI();
                }.bind(this)
            })
        }else{
            ViewManager.getInstance().ShowView("ViewPass");
            this.closeUI();
        }
    }
    closeUI(){
        ViewManager.getInstance().CloseView("ViewPassRedPacket")
    }
    start () {

    }

    // update (dt) {}
}
