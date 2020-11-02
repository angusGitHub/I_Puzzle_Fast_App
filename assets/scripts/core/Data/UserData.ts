import GameDataManager from "./GameDataManager";
import { ConfigManager } from "../JsonConfig/ConfigManager";
import FightManger from "../../game/fight/FightManger";
import FightConst from "../../game/fight/FightConst";
import Const from "../../game/Const";
import HttpCallBack from "../Net/HttpCallBack";


export default class UserData  {
    constructor() {
    }
    
    lastCleanTime: number = Date.now();   //上次隔天清理时间
    level:number = 1;//关卡;
    money:number = 0;
    name:string = "";
    guideId:number = 0;//引导Id;
    loginToken:string = null;
    uid:number = 0;

    

    hintNum:number = 0; //提示数

    powerNum:number = 0; //体力数量
    lastRecoverPowerTime:number = 0; //上次回复时间
    isRefresh:boolean = false;//是否刷新
    
    isTopBtnShake:boolean = false;//是否按钮抖动

    copy(data: UserData){
        if (data.lastCleanTime) {
            this.lastCleanTime = data.lastCleanTime;
        }
        
        if (data.level) {
            this.level = data.level;
        }
        if (data.money) {
            this.money = data.money;
        }
        if (data.name) {
            this.name = data.name;
        }
        if (data.loginToken) {
            this.loginToken = data.loginToken;
        }
        if (data.uid) {
            this.uid = data.uid;
        }
        if (data.powerNum) {
            this.powerNum = data.powerNum;
        }
        if (data.lastRecoverPowerTime) {
            this.lastRecoverPowerTime = data.lastRecoverPowerTime;
            if (this.lastRecoverPowerTime > Date.now()) {
                this.lastRecoverPowerTime = Date.now();
            }
        }
        if (data.hintNum) {
            this.hintNum = data.hintNum;
        }
        if (data.isTopBtnShake) {
            this.isTopBtnShake = data.isTopBtnShake;
        }
        
    }
    //清理数据
    clearData(){
        this.lastCleanTime = Date.now();
    }
    //隔天清理
    nextDayClean() {
        let now = Date.now();
        //找到今天0点
        let todayZero = new Date();
        todayZero.setHours(0);
        todayZero.setMinutes(0);
        todayZero.setSeconds(0);
        if (this.lastCleanTime < todayZero.getTime()) {
            this.lastCleanTime = now;
            GameDataManager.getInstance().saveUserData()
        }
    }
   
    setLevel(level:number){
        this.level = level
        GameDataManager.getInstance().saveUserData()
    }

    setMoney(money){
        this.money = money;
        GameDataManager.getInstance().saveUserData()
    }
    setName(name,isBool){ //isBool 是否强制修改
        if(this.name == "" || isBool){
            this.name = name;
            GameDataManager.getInstance().saveUserData()
        }
    }
    setLoginToken(loginToken:string){
        this.loginToken = loginToken;
        GameDataManager.getInstance().saveUserData()
    }
    setUid(uid:number){
        this.uid = uid;
        GameDataManager.getInstance().saveUserData()
    }
  
    setGuideId(_guideId:number){
        if(this.guideId >= _guideId){
            return false;
        }
        this.guideId = _guideId;
        GameDataManager.getInstance().saveUserData()
        return true;
    }
    //设置提示数量
    setHintNum(hintNum){
        this.hintNum = hintNum;
        GameDataManager.getInstance().saveUserData()
    }
     //获取体力数量
     getPowerNum() {
        let now = Date.now();
        let interval = now - this.lastRecoverPowerTime;
        if (interval > Const.Power.recover_inteval) {
            let old = this.powerNum;
            let add = Math.floor(interval/Const.Power.recover_inteval);
            this.lastRecoverPowerTime = this.lastRecoverPowerTime + (add * Const.Power.recover_inteval);
            if (this.powerNum < Const.Power.maxNum) {
                this.powerNum = this.powerNum + add;
                if (this.powerNum > Const.Power.maxNum) {
                    this.powerNum = Const.Power.maxNum;
                }
            } else {
                this.lastRecoverPowerTime = now;
            }
            if(this.powerNum - old > 0){
                HttpCallBack.getInstance().sendAddPower(this.powerNum - old)
            }
            this.changePowerView();
            GameDataManager.getInstance().saveUserData();
        } else {
            if (this.powerNum >= Const.Power.maxNum) {
                this.lastRecoverPowerTime = now;
            }
        }
        return this.powerNum;
    }
    //修改体力
    changePowerNum(num : number) {
        this.getPowerNum();
        if (this.powerNum + num < 0) {
            return false;
        }
        this.powerNum += num;
        this.changePowerView();
        GameDataManager.getInstance().saveUserData();
        return true;
    }
    //修改体力界面
    changePowerView(){
        this.isRefresh = true;
    }

    setIsTopBtnShake(){
        this.isTopBtnShake = !this.isTopBtnShake;
        GameDataManager.getInstance().saveUserData()
    }
}
