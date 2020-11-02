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
import DebugHT from "../DebugHT";
import ViewManager from "../../core/View/ViewManager";
import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import PlatformManger from "../../core/Platform/PlatformManger";
import GameUtils from "../../core/Util/GameUtils";
import AudioManager from "../../core/Audio/AudioManager";
import EventManager from "../../core/Event/EventManager";
import GameDataManager from "../../core/Data/GameDataManager";
import MainSceneManager from "../../scenes/MainSceneManager";
import ViewTop from "./ViewTop";
import FightManger from "../fight/FightManger";
import HttpCallBack from "../../core/Net/HttpCallBack";
import Const from "../Const";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewMain extends BaseView {

    
    @property(ViewTop)
    HeadNode:ViewTop = null;
    @property(cc.SpriteFrame)
    SpriteFrame:cc.SpriteFrame = null;

    move_power:cc.Node = null;
    isTouchBtn:boolean = false;

    onLoad () {
        if(FightManger.getInstance().VideoBox){
            FightManger.getInstance().VideoBox.putNode()
        }
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        AdaptarManager.getInstance().adaptarHeadNode(this.HeadNode.node)
        PlatformManger.getInstance().showBanner(true)
        if(!DebugHT.isDebug){
            GameUtils.getGameConfig()
        }
    }
    start(){
        ViewManager.getInstance().CloseView("ViewLogin");
        ViewManager.getInstance().CloseView("ViewFight");
        MainSceneManager.getInstance().setViewFight(null);
        MainSceneManager.getInstance().setViewMain(this);
        this.move_power = this.node.getChildByName("move_power")
        this.initView()
    }
    initView(){
        if(!GameDataManager.getInstance().kaiGuan.isOpenRedPacket){//红包关闭
            this.node.getChildByName("btn_GameStart").getComponent(cc.Sprite).spriteFrame = this.SpriteFrame;
        }
        this.initAllBtn()
        this.setMovePos()

        this.setTimingRedPacket()
        this.schedule(()=>{
            this.refreshTimingRedPacket()
        },1)
    }
    setMovePos(){
        let node = this.HeadNode.node.getChildByName("Power");
        let worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        this.move_power.x = pos.x - 115;
        this.move_power.y = pos.y;
        this.move_power.scale = 1.3;
        this.move_power.active = false;
        
    }
    addPowerMove(callBack){
        let btn_GameStart = this.node.getChildByName("btn_GameStart")
        this.move_power.active = true; 
        let worldPos = btn_GameStart.parent.convertToWorldSpaceAR(btn_GameStart.getPosition());
        let pos = this.node.convertToNodeSpaceAR(worldPos);
        cc.tween(this.move_power)
            .to(0.7,{scale:1,x:pos.x,y:pos.y + 5})
            .call(()=>{
                callBack()
            })
            .start()
    }
  
    btnAllCallBanck(event:cc.Event,name:string){
        if(this.isTouchBtn){
            return
        }
        this.isTouchBtn = true;
        AudioManager.getInstance().playSound("dianji")
        if(name == "btn_GameStart"){//开始游戏
            if(GameDataManager.getInstance().userData.changePowerNum(Const.Power.levelNum)){
                HttpCallBack.getInstance().sendDeductPower()
                this.addPowerMove(()=>{
                    this.move_power.active = false; 
                    ViewManager.getInstance().ShowView("ViewFight");
                })
            }else{
                ViewManager.getInstance().ShowView("ViewNoPower")
                this.isTouchBtn = false;
            }
            // this.isTouchBtn = false;
        }else if(name == "btn_back"){//回到主界面
            // ViewManager.getInstance().ShowView("ViewBack");
            // this.isTouchBtn = false;
        }else{
            
        }
    }
    initAllBtn(){
        let btnHander = (btnNode:cc.Node,name:string)=>{
            EventManager.getInstance().addBtnEvent(btnNode,this.node,"ViewMain","btnAllCallBanck",name)
        }
        btnHander(this.node.getChildByName("btn_GameStart"),"btn_GameStart") //开始游戏
    }
   
   
    
    //定时分红
    setTimingRedPacket(){
        let type = GameDataManager.getInstance().serverData.tempData.timingRedPacketType;
        if(type == 1){//0未到时间 1今日已完成 2待领取 
            if(FightManger.getInstance().VideoBox){
                FightManger.getInstance().VideoBox.putNode()
            }
        }else if(type == 0){

        }else if(type == 2){
            if(!FightManger.getInstance().VideoBox && GameDataManager.getInstance().kaiGuan.isOpenRedPacket){
                // FightManger.getInstance().addVideoBox()
            }
        }
    }
    refreshTimingRedPacket(){
        let type = GameDataManager.getInstance().serverData.tempData.timingRedPacketType;
        if(type == 1){//0未到时间 1今日已完成 2待领取 
            return;
        }else if(type == 0){
            //
            if(FightManger.getInstance().VideoBox){
                FightManger.getInstance().VideoBox.putNode()
            }
            GameDataManager.getInstance().serverData.tempData.timingRedPacketTime--;
            if(GameDataManager.getInstance().serverData.tempData.timingRedPacketTime >= 1){
            }else{
                GameDataManager.getInstance().serverData.tempData.timingRedPacketTime = 0;
                GameDataManager.getInstance().serverData.tempData.timingRedPacketType = 2;
                this.setTimingRedPacket()
            }
        }else if(type == 2){
            return;
        }
    }
   
}
