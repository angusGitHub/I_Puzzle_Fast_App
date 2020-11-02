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



const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewGetHint extends BaseView {

    @property(cc.Node)
    btnClose: cc.Node = null; //领取
    @property(cc.Label)
    labHint: cc.Label = null; //提示数量
    // LIFE-CYCLE CALLBACKS:


    passRedPacketNum:number = 0;//过关红包次数
    data:any = null;
    onLoad () {
        AudioManager.getInstance().playSound("huodetishi")
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnClose.on('click', this.onCloseUI, this);
        PlatformManger.getInstance().showBanner(true)
    }
    init(data){
        this.data = data;
        this.labHint.string = GameUtils.format("x{1}",data.HintNum)
    }
    onCloseUI(){
        AudioManager.getInstance().playSound("dianji")
        // FightManger.getInstance().ViewFight.refreshHintLabel()
        this.closeUI()
    }
    closeUI(){
        ViewManager.getInstance().CloseView("ViewGetHint")
    }
    start () {

    }

    // update (dt) {}
}
