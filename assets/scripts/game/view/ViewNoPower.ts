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
import AudioManager from "../../core/Audio/AudioManager";
import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import PlatformManger from "../../core/Platform/PlatformManger";
import ViewManager from "../../core/View/ViewManager";
import GameDataManager from "../../core/Data/GameDataManager";
import ShareAdvType from "../../core/Platform/ShareAdvType";
import HttpCallBack from "../../core/Net/HttpCallBack";
import MainSceneManager from "../../scenes/MainSceneManager";



const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewNoPower extends BaseView {

    @property(cc.Node)
    btnClose: cc.Node = null; //领取
    @property(cc.Node)
    btnAdv: cc.Node = null; //提示数量

    // LIFE-CYCLE CALLBACKS:


    passRedPacketNum:number = 0;//过关红包次数
    data:any = null;
    onLoad () {
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnClose.on('click', this.onCloseUI, this);
        this.btnAdv.on('click', this.onAddPower, this);
        PlatformManger.getInstance().showBanner(true)
       
    }
    init(data){
        this.data = data;

    }
    //看视频
    onShowVideo(AdvType){
        PlatformManger.getInstance().showVideo(AdvType,{
            success: function () {
                this.showVideoSuccess()
            }.bind(this),
            fail: function () {
            }.bind(this),
            noVideo:function(){
            }.bind(this)
        });
    }
    // 看视频成功
    showVideoSuccess(){
        // this.closeUI()
        ViewManager.getInstance().CloseView("ViewNoPower")
        HttpCallBack.getInstance().sendSeeVideoAddPower((responseData)=>{
            let add_num = responseData.data.add_num;
            ViewManager.getInstance().ShowView("ViewGetPower",{PowerNum:add_num})
            GameDataManager.getInstance().userData.changePowerNum(add_num)
        })
    }
    onAddPower(){
        let type = ShareAdvType.ShareAdvType.powerNot;
        this.onShowVideo(type)
    }
    onCloseUI(){
        AudioManager.getInstance().playSound("dianji")
        // FightManger.getInstance().ViewFight.refreshHintLabel()
        this.closeUI()
    }
    closeUI(){
        if(MainSceneManager.getInstance().ViewPass){
            MainSceneManager.getInstance().ViewPass.showBigVideo()
        }else{
            // PlatformManger.getInstance().showBanner(false)
        }
        // PlatformManger.getInstance().showBanner(false)
        ViewManager.getInstance().CloseView("ViewNoPower")
    }
    start () {

    }

    // update (dt) {}
}
