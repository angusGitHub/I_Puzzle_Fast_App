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
import GameDataManager from "../../core/Data/GameDataManager";
import GameUtils from "../../core/Util/GameUtils";
import AudioManager from "../../core/Audio/AudioManager";
import ViewManager from "../../core/View/ViewManager";
import ShareAdvType from "../../core/Platform/ShareAdvType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewRedPacket extends BaseView {

    @property(cc.Node)
    btnClose: cc.Node = null; //取消
    @property(cc.Node)
    btnDoubel: cc.Node = null; //双倍
    @property(cc.Node)
    btnWithdraw: cc.Node = null; //提现
    @property(cc.Node)
    btnDailyWelfare: cc.Node = null; //每日福利
    @property(cc.Node)
    btn_sign_in: cc.Node = null; //打卡提现
    // LIFE-CYCLE CALLBACKS:
    data:any = null;
    time:number = 3;
    onLoad () {

        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnClose.on('click', this.onCloseUI, this);
        this.btnDoubel.on('click', this.onDouble, this);
        this.btnWithdraw.on('click', this.onDrawMoney, this);
        this.btnDailyWelfare.on('click', this.onDailyWelfare, this);
        this.btn_sign_in.on('click', this.onSignIn, this);
        
        PlatformManger.getInstance().showBanner(false);
        let pos = this.btnClose.convertToWorldSpaceAR(cc.v2(0,0));
        PlatformManger.getInstance().showBigVideo(pos.y - this.btnClose.height/2,633.6)
    }
    init(data){
        this.data = data;
        this.btnDoubel.active = false;
        this.btnWithdraw.active = false;
        this.btnDailyWelfare.active = false;
        this.btn_sign_in.active = false;
        if(data.Type == "ViewPassRedPacket"){//过关红包
            if(!GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare){//是否打开每日福利
                this.btnWithdraw.active = true;
            }else{
                let ran = GameUtils.getRandom(1,10)
                if(ran > 5){
                    this.btnDailyWelfare.active = true;
                }else{
                    this.btn_sign_in.active = true;
                }
            }
        }else if(data.Type == "LevelInRedPacket"){//关卡内红包
            this.btnDoubel.active = true;
        }
        this.refreshLabel()
        this.refreshMoneyLabel(data.Money)
    }
    refreshLabel(){
        this.unscheduleAllCallbacks()
        this.time = 3;
        this.btnClose.active = false;
        let close_time = this.node.getChildByName("close_time");
        let timeLabel = close_time.getChildByName("timeLabel").getComponent(cc.Label)
        close_time.active = true;
        timeLabel.string = GameUtils.format("{1}",this.time);
        let timeCallback = function(){
            this.time --;
            if(this.time >= 1){
                timeLabel.string = GameUtils.format("{1}",this.time);
            }else{
                close_time.active = false;
                this.btnClose.active = true;
                this.unschedule(timeCallback);
            }
        }.bind(this)
        this.schedule(timeCallback,1.0);
    }

    refreshMoneyLabel(money){
        let label_money = this.node.getChildByName("label_money").getComponent(cc.Label);
        let label_yuan = label_money.node.getChildByName("label_yuan")
        label_money.string = GameUtils.format("{1}",money);
        let label = label_money as any;
        label._forceUpdateRenderData && label._forceUpdateRenderData(true);
        label_yuan.x = label.node.width/2;
        let label_money_yue = this.node.getChildByName("label_money_yue").getComponent(cc.Label);
        label_money_yue.string = GameUtils.format("当前余额:{1}元",GameDataManager.getInstance().userData.money);
    }
    //看视频
    onShowVideo(_type){
        PlatformManger.getInstance().showVideo(_type,{
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
        if(!this.btnDoubel){
            return;
        }
        // FightManger.getInstance().sendGetMoney(4,(responseData)=>{
        //     this.btnDoubel.active = false;
        //     if(!GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare){//是否打开每日福利
        //         this.btnWithdraw.active = true;
        //     }else{
        //         let ran = GameUtils.getRandom(1,10)
        //         if(ran > 5){
        //             this.btnDailyWelfare.active = true;
        //         }else{
        //             this.btn_sign_in.active = true;
        //         }
        //     }
        //     this.refreshLabel()
        //     this.refreshMoneyLabel(GameDataManager.getInstance().serverData.redPacket.levelInRedPacketDoubleNum)
        // })
    }
    //双倍
    onDouble(){
        // AudioManager.getInstance().playSound("dianji")
        // PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_shuangbei.eventID,Const.AndroidEvent.shipin_shuangbei.eventName)
        // let type = ShareAdvType.ShareAdvType.doubleRedPacket;
        // this.onShowVideo(type)
    }
    onSignIn(){
        if(this.data.Type == "ViewPassRedPacket"){
            PlatformManger.getInstance().openEveryDaySignPage("ViewPass")
        }else{
            PlatformManger.getInstance().openEveryDaySignPage("ViewLevelIn")
        }
        this.closeUI()
    }
    onCloseUI(){
        AudioManager.getInstance().playSound("dianji")
        if(this.data.Type == "ViewPassRedPacket"){
            // FightManger.getInstance().nextLevel()
            ViewManager.getInstance().ShowView("ViewPass")
        }
        this.closeUI()
    }
    onDrawMoney(){
        AudioManager.getInstance().playSound("dianji")
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.qutixian.eventID,Const.AndroidEvent.qutixian.eventName)
        if(this.data.Type == "ViewPassRedPacket"){
            PlatformManger.getInstance().openDrawMoneyPage("ViewPass")
        }else{
            PlatformManger.getInstance().openDrawMoneyPage("ViewLevelIn")
        }
        this.closeUI()
        
    }
    onDailyWelfare(){
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.lwmktx.eventID,Const.AndroidEvent.lwmktx.eventName)
        AudioManager.getInstance().playSound("dianji")
        
        if(this.data.Type == "ViewPassRedPacket"){
            PlatformManger.getInstance().openDailyWelfarePage("ViewPass")
        }else{
            PlatformManger.getInstance().openDailyWelfarePage("ViewLevelIn")
        }
        this.closeUI()
    }
    closeUI(){
        // FightManger.getInstance().ViewFight.HeadNode.refreshMoney()
        PlatformManger.getInstance().hideBigVideo()
        ViewManager.getInstance().CloseView("ViewRedPacket")
    }
    start () {

    }

    // update (dt) {}
}
