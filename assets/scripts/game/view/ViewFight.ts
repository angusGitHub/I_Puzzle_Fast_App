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
import FightManger from "../fight/FightManger";
import FightConst from "../fight/FightConst";
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


const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewFight extends BaseView {


    @property(cc.Node)
    CheckAreaNode:cc.Node = null;
    @property(cc.Node)
    ViewTop:cc.Node = null;
    @property(cc.Graphics)
    draw: cc.Graphics = null;//
    @property(cc.Sprite)
    puzzleSprite:cc.Sprite = null;

    

    isTouchBtn:boolean = false;

    // btn_timing_red_packet:cc.Node = null;
    // timing_red_packet_label:cc.Label = null;

    // redStarTimeCallback:any = null; //分红星倒计时函数
    onLoad () {

         //定时红包
        // this.btn_timing_red_packet = this.node.getChildByName("btn_timing_red_packet");
        // this.timing_red_packet_label = this.btn_timing_red_packet.getChildByName("timeLabel").getComponent(cc.Label)

        ViewManager.getInstance().CloseView("ViewMain");
        AdaptarManager.getInstance().adapterFight(this.ViewTop)
        // this.TouchHeight = this.
        FightManger.getInstance().init(this);
        MainSceneManager.getInstance().setViewFight(this);
        MainSceneManager.getInstance().setViewMain(null);
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        // AdaptarManager.getInstance().adaptarBg(this.node)
        
        // console.log("===this.TouchHeight==",this.TouchHeight)
        this.initAllBtn()
        this.initView()
        PlatformManger.getInstance().showBanner(true)
        if(!DebugHT.isDebug){
            GameUtils.getGameConfig()
        }
    }
    start(){
        
    }

    initView(){
        this.refreshLevelLabel()
        this.refreshHintLabel()
        this.onRefreshSchedule()
        this.setTimingRedPacket()
        this.schedule(()=>{
            this.refreshTimingRedPacket()
        },1)
    }
    onRefreshSchedule(){
        this.schedule(()=>{
            // this.refreshTimingRedPacket()
        },1)
    }
    //设置关卡数
    refreshLevelLabel(){
        let levelLabel = this.CheckAreaNode.getChildByName("lab_level").getComponent(cc.Label)
        levelLabel.string = GameUtils.format("关卡：{1}",GameDataManager.getInstance().userData.level)
    }
    //设置提示数量
    refreshHintLabel(){
        let btn_hint = this.CheckAreaNode.getChildByName("btn_hint")
        let label_hint = btn_hint.getChildByName("label_hint").getComponent(cc.Label)
        label_hint.string = GameUtils.format("{1}",GameDataManager.getInstance().userData.hintNum)
    }
    btnAllCallBanck(event:cc.Event,name:string){
        if(FightManger.getInstance().Gamestate != FightConst.Gamestate.StartGame){
            return 
        }
        if(this.isTouchBtn){
            return
        }
        this.isTouchBtn = true;
        AudioManager.getInstance().playSound("dianji")
        if(name == "btn_hint"){//提示
            console.log("===提示")
            FightManger.getInstance().onHint()
            this.isTouchBtn = false;
        }else if(name == "btn_back"){//回到主界面
            if(FightManger.getInstance().Hand){
                FightManger.getInstance().Hand.putNode()
            }
            ViewManager.getInstance().ShowView("ViewMain");
            this.isTouchBtn = false;
        }else{
            
        }
    }
    initAllBtn(){
        let self = this;
        let btnHander = function(btnNode:cc.Node,name:string){
            EventManager.getInstance().addBtnEvent(btnNode,self.node,"ViewFight","btnAllCallBanck",name)
        }
        btnHander(this.CheckAreaNode.getChildByName("btn_hint"),"btn_hint") //提示
        btnHander(this.CheckAreaNode.getChildByName("btn_back"),"btn_back") //回到主界面
    }
   
    refreshGraphics(){
        this.draw.clear();
        this.draw.lineWidth = 3;
        this.draw.strokeColor = cc.Color.WHITE;
        let lineNum = FightManger.getInstance().CutLineNum;
        for (let index = 0; index < lineNum; index++) {
            let start = {x:(-FightConst.CutImgWidth / 2 + FightConst.CutImgWidth /( lineNum + 1) * (index+1) ),y:-FightConst.CutImgHeight / 2}
            let end = {x:(-FightConst.CutImgWidth / 2 + FightConst.CutImgWidth /( lineNum + 1) * (index+1) ),y:FightConst.CutImgHeight / 2}
            let json = {start,end}
            this.drawLine(json);
        }
        for (let index = 0; index < lineNum; index++) {
            let start = {y:(-FightConst.CutImgHeight / 2 + FightConst.CutImgHeight /( lineNum + 1) * (index+1) ),x:-FightConst.CutImgWidth / 2}
            let end = {y:(-FightConst.CutImgHeight / 2 + FightConst.CutImgHeight /( lineNum + 1) * (index+1) ),x:FightConst.CutImgWidth / 2}
            let json = {start,end}
            this.drawLine(json);
        }
    }
    //绘制直线
    drawLine(curve) {
        //画笔移动到起始点
        this.draw.moveTo(curve.start.x, curve.start.y);
        this.draw.lineTo(curve.end.x, curve.end.y);
        this.draw.stroke();
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
                FightManger.getInstance().addVideoBox()
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
