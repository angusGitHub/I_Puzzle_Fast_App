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

import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import PlatformManger from "../../core/Platform/PlatformManger";
import GameUtils from "../../core/Util/GameUtils";
import GameDataManager from "../../core/Data/GameDataManager";
import AudioManager from "../../core/Audio/AudioManager";
import FightManger from "../fight/FightManger";
import ViewManager from "../../core/View/ViewManager";
import MainSceneManager from "../../scenes/MainSceneManager";
import HttpCallBack from "../../core/Net/HttpCallBack";
import Const from "../Const";
import Head from "./Head";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewPass extends BaseView {

    @property(cc.Node)
    btnNext: cc.Node = null; //下一关
    @property(cc.Label)
    labelLevel: cc.Label = null; //
    @property(Head)
    Head: Head = null; //
    
    // LIFE-CYCLE CALLBACKS:

    move_power:cc.Node = null;
    isTouch:boolean = false;
    passRedPacketNum:number = 0;//过关红包次数
    data:any = null;
    onLoad () {
        MainSceneManager.getInstance().setViewPass(this);
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        AdaptarManager.getInstance().adapterPassTop(this.node.getChildByName("ViewTop"))
        AdaptarManager.getInstance().adapterPassBottom(this.node.getChildByName("ViewBottom"))
        this.btnNext.on('click', this.onNext, this);
        PlatformManger.getInstance().showBanner(true);
        this.move_power = this.node.getChildByName("move_power")
        this.showBigVideo()
        this.setMovePos()
        this.refreshLabel()
    }
    showBigVideo(){
        let ViewTopPos = this.node.getChildByName("ViewTop").convertToWorldSpaceAR(cc.v2(0,0))
        let ViewBottomPos = this.node.getChildByName("ViewBottom").convertToWorldSpaceAR(cc.v2(0,0))
        PlatformManger.getInstance().showBigVideo(ViewTopPos.y - 50,606,ViewBottomPos.y)
    }
    refreshLabel(){
        this.unscheduleAllCallbacks()
        let time = 3;
        this.btnNext.active = false;
        let close_time = this.node.getChildByName("ViewBottom").getChildByName("close_time");
        let timeLabel = close_time.getChildByName("timeLabel").getComponent(cc.Label)
        close_time.active = true;
        timeLabel.string = GameUtils.format("{1}",time);
        this.schedule(()=>{
            time --;
            if(time >= 1){
                timeLabel.string = GameUtils.format("{1}",time);
            }else{
                close_time.active = false;
                this.btnNext.active = true;
                this.unscheduleAllCallbacks()
            }
        },1.0);
    }
    refreshMoney(){
        this.Head.refreshMoney()
    } 
    refreshHeadSprite(){
        this.Head.refreshHeadSprite()
    }
    init(data){
        this.data = data;
        this.labelLevel.string = GameUtils.format("第{1}关",GameDataManager.getInstance().userData.level)
        if(FightManger.getInstance().VideoBox){
            FightManger.getInstance().VideoBox.LevelTime ++;
            if(FightManger.getInstance().VideoBox.LevelTime >= 3){
                FightManger.getInstance().VideoBox.putNode()
            }
        }
    }
    //
    setMovePos(){
        let node = this.node.getChildByName("ViewTop").getChildByName("Power");
        let worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        this.move_power.x = pos.x - 115;
        this.move_power.y = pos.y;
        this.move_power.scale = 1.2;
        this.move_power.active = false;
        
    }
    addPowerMove(callBack){
        this.move_power.active = true; 
        let worldPos = this.btnNext.parent.convertToWorldSpaceAR(this.btnNext.getPosition());
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        cc.tween(this.move_power)
            .to(1,{scale:1,x:pos.x,y:pos.y + 5})
            .call(()=>{
                callBack()
            })
            .start()
    }
    onNext(){
        AudioManager.getInstance().playSound("dianji")
        if(this.isTouch){
            return;
        }
        PlatformManger.getInstance().hideBigVideo();
        this.isTouch = true;
        if(GameDataManager.getInstance().userData.changePowerNum(Const.Power.levelNum)){
            HttpCallBack.getInstance().sendDeductPower()
            this.addPowerMove(()=>{
                MainSceneManager.getInstance().setViewPass(null);
                FightManger.getInstance().nextLevel()
                this.closeUI()
                this.isTouch = false;
            })
        }else{
            ViewManager.getInstance().ShowView("ViewNoPower")
            this.isTouch = false;
        }
    }
    // onRestart(){
    //     AudioManager.getInstance().playSound("dianji")
    //     FightManger.getInstance().restartLevel()
    //     this.closeUI()
    // }
    closeUI(){
        MainSceneManager.getInstance().setViewPass(null);
        PlatformManger.getInstance().showBanner(true)
        PlatformManger.getInstance().hideBigVideo();
        ViewManager.getInstance().CloseView("ViewPass")
    }
    start () {

    }

    // update (dt) {}
}
