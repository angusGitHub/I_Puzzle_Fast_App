// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameDataManager from "../../core/Data/GameDataManager";
import GameUtils from "../../core/Util/GameUtils";
import Const from "../Const";
import ShareAdvType from "../../core/Platform/ShareAdvType";
import PlatformManger from "../../core/Platform/PlatformManger";
import ViewManager from "../../core/View/ViewManager";
import HttpCallBack from "../../core/Net/HttpCallBack";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Power extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:
    power_num_label:cc.Label = null;//体力数
    power_time_label:cc.Label = null;//体力时间
    btn_add_power:cc.Button = null;//添加体力
    onLoad () {
         //体力
         this.power_num_label = this.node.getChildByName("power_num_label").getComponent(cc.Label)
         this.power_time_label = this.node.getChildByName("power_time_label").getComponent(cc.Label)
         this.btn_add_power = this.node.getChildByName("btn_add_power").getComponent(cc.Button)
         
         this.btn_add_power.node.on('click', this.onAddPower, this);
         this.refreshView()
    }
    refreshView(){
        this.refreshPower()
        this.onRefreshSchedule()
    }
    onRefreshSchedule(){
        this.schedule(()=>{
            this.refreshPower()
        },1)
    }
     //刷新体力
     refreshPower() {
        let powerNum = GameDataManager.getInstance().userData.getPowerNum();
        this.power_num_label.string = GameUtils.format("x{1}",powerNum);
        let inteval = Date.now() - GameDataManager.getInstance().userData.lastRecoverPowerTime;
        let t = inteval%Const.Power.recover_inteval;
        t = Const.Power.recover_inteval - t;
        if (powerNum >= Const.Power.maxNum) {
            this.power_time_label.string = "已满";
            // this.btn_add_power.node.active = false;
            // this.btn_add_power.interactable = false;
        } else {
            // this.btn_add_power.node.active = true;
            // this.btn_add_power.interactable = true;
            let second = Math.floor(t/1000);
            let mm = Math.floor(second/60);
            let ss = second - mm*60;
            this.power_time_label.string = GameUtils.format("{1}:{2}",mm<10?"0"+mm:mm,ss<10?"0"+ss:ss);
        }
    }
    //看视频
    onShowVideo(AdvType){
        PlatformManger.getInstance().hideBigVideo();
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
        // ViewManager.getInstance().ShowView("ViewGetPower",{PowerNum:Const.Power.videoAddNum})
        // GameDataManager.getInstance().userData.changePowerNum(Const.Power.videoAddNum)
        HttpCallBack.getInstance().sendSeeVideoAddPower((responseData)=>{
            let add_num = responseData.data.add_num;
            ViewManager.getInstance().ShowView("ViewGetPower",{PowerNum:add_num,IsStartGame:false})
            GameDataManager.getInstance().userData.changePowerNum(add_num)
        })
    }
    onAddPower(){
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shouyetilijiahao.eventID,Const.AndroidEvent.shouyetilijiahao.eventName)
        let powerNum = GameDataManager.getInstance().userData.getPowerNum();
        if (powerNum >= Const.Power.maxNum) {
            GameUtils.showTip("体力已满！")
        }else{
            let type = ShareAdvType.ShareAdvType.addPower;
            this.onShowVideo(type) 
        }
    }
    start () {

    }
    update (dt) {
        if(GameDataManager.getInstance().userData.isRefresh){
            GameDataManager.getInstance().userData.isRefresh = false;
            this.refreshPower();
        }
    }
    
}
