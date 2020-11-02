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
import GameUtils from "../../core/Util/GameUtils";
import FightManger from "../fight/FightManger";
import ViewManager from "../../core/View/ViewManager";
import MainSceneManager from "../../scenes/MainSceneManager";



const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewGetPower extends BaseView {

    @property(cc.Node)
    btnClose: cc.Node = null; //领取
    // @property(cc.Node)
    // btnDouble: cc.Node = null; //领取
    @property(cc.Label)
    labPower: cc.Label = null; //提示数量
    // LIFE-CYCLE CALLBACKS:

    passRedPacketNum:number = 0;//过关红包次数
    data:any = null;
    onLoad () {
        AudioManager.getInstance().playSound("huodetishi")
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnClose.on('click', this.onCloseUI, this);
        // this.btnDouble.on('click', this.onDouble, this);
        PlatformManger.getInstance().showBanner(true);
    }
    init(data){
        this.data = data;
        this.labPower.string = GameUtils.format("x{1}",data.PowerNum)
    }
    onCloseUI(){
        AudioManager.getInstance().playSound("dianji")
        this.closeUI()
    }
    // onShowVideo(AdvType){
    //     PlatformManger.getInstance().showVideo(AdvType,{
    //         success: function () {
    //             this.showVideoSuccess()
    //         }.bind(this),
    //         fail: function () {
    //         }.bind(this),
    //         noVideo:function(){
    //         }.bind(this)
    //     });
    // }
    // //分享
    // onShowShare(AdvType){
    //     PlatformManger.getInstance().showShare(AdvType,{
    //         success: function () {
    //             this.showVideoSuccess()
    //             Aldsdk.getInstance().aldSendEvent("分享成功-领取体力双倍", null);
    //         }.bind(this),
    //         fail: function () {
    //             Aldsdk.getInstance().aldSendEvent("分享失败-领取体力双倍", null);
    //         }.bind(this),
    //         noVideo:function(){
    //             Aldsdk.getInstance().aldSendEvent("分享失败-领取体力双倍", null);
    //         }.bind(this)
    //     });
    // }
    // // 看视频成功
    // showVideoSuccess(){
    //     this.closeUI()
    //     GameDataManager.getInstance().userData.changePowerNum(Const.Power.videoAddNum)
    // }

    // onDouble(){
    //     let type = ShareAdvType.ShareAdvType.doublePower;
    //     if(ShareAdvType.shareAdvShow[type] == ShareAdvType.showAdvType){
    //         this.onShowVideo(type)
    //     }else{
    //         this.onShowShare(type)
    //     } 
    // }
    closeUI(){
        if(MainSceneManager.getInstance().ViewPass){
            MainSceneManager.getInstance().ViewPass.showBigVideo()
        }else{
            // PlatformManger.getInstance().showBanner(false)
        }
        ViewManager.getInstance().CloseView("ViewGetPower")
    }
    start () {

    }

    // update (dt) {}
}
