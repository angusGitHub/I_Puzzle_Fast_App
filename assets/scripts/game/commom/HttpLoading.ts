// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../core/View/BaseView";
import AdaptarManager from "../../core/Adaptar/AdaptarManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HttpLoading extends BaseView {

    timeCallback:any = null;
    onLoad () {
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        let ani = this.node.getChildByName("http_bg").getChildByName("http_loading").getComponent(cc.Animation)
        this.node.getChildByName("bg").active = false;
        this.node.getChildByName("http_bg").active = false;
        ani.stop()
    }
    showLoading(){
        if(this.timeCallback){
            this.unschedule(this.timeCallback)
        }
        if(!this.node.getChildByName("bg").active){
            let ani = this.node.getChildByName("http_bg").getChildByName("http_loading").getComponent(cc.Animation)
            this.node.getChildByName("bg").active = true;
            this.node.getChildByName("http_bg").active = false;
            ani.play()
        }
        this.timeCallback = function(){
            if(this.node.getChildByName("bg").active){
                this.node.getChildByName("http_bg").active = true;
            }
        }.bind(this)
        this.scheduleOnce(this.timeCallback,2);
    }
    //隐藏loading
    hideLoading(){
        if(this.timeCallback){
            this.unschedule(this.timeCallback)
        }
        if(this.node.getChildByName("bg").active){
            let ani = this.node.getChildByName("http_bg").getChildByName("http_loading").getComponent(cc.Animation)
            this.node.getChildByName("bg").active = false;
            this.node.getChildByName("http_bg").active = false;
            ani.stop()
        }
    }
}
