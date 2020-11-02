import GameDataManager from "../../core/Data/GameDataManager";
import { LoaderManager } from "../../core/Loader/LoaderManager";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlatformManger from "../../core/Platform/PlatformManger";
import GameUtils from "../../core/Util/GameUtils";
import Const from "../Const";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Head extends cc.Component {

    @property(cc.Sprite)
    headSprite:cc.Sprite = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('click', this.onHead, this);
        this.refreshMoney();
        this.refreshHeadSprite();
        this.isShowRedPacket();
    }
    isShowRedPacket(){
        if(!GameDataManager.getInstance().kaiGuan.isOpenRedPacket){//红包关闭
            this.node.active = false;
        }else{//红包打开
            this.node.active = true;
        }
    }
    refreshMoney(){
        let label = this.node.getChildByName("money_label").getComponent(cc.Label);
        label.string = GameUtils.format("{1}元",GameDataManager.getInstance().userData.money)
    } 
    refreshHeadSprite(){
        let headUrl = GameDataManager.getInstance().serverData.tempData.headimgurl
        if(headUrl == "null" || headUrl == "" || headUrl == null){
            return;
        }
        LoaderManager.getInstance().loadHttpTexure(headUrl+'?file=a.png',(texture)=>{
            var sprite  = new cc.SpriteFrame(texture);
            this.headSprite.spriteFrame = sprite;
        })
    }
    onHead(){
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shouyetixian.eventID,Const.AndroidEvent.shouyetixian.eventName)
        PlatformManger.getInstance().openDrawMoneyPage("ViewFight")
    }
    start () {

    }

    // update (dt) {}
}
