// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import ShareAdvType from "../../core/Platform/ShareAdvType";
import PlatformManger from "../../core/Platform/PlatformManger";
import FightManger from "../fight/FightManger";
import { LoaderManager } from "../../core/Loader/LoaderManager";



const {ccclass, property} = cc._decorator;

@ccclass
export default class VideoBox extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:
    LevelTime:number = 0;
    SelfPrefab:cc.Prefab = null;
    onLoad () {
        this.node.on('click', this.onclick, this);
    }

    start () {

    }
    init(data){
        this.SelfPrefab = data.selfPrefab;
        this.node.active = true;
        this.node.zIndex = 999;
        this.LevelTime = 0;
        this.playAni()
    }
    playAni(){
        this.node.getComponent(cc.Animation).play()
        let pos_1 = cc.v2(this.node.position);
        let pos_2 = cc.v2(AdaptarManager.getInstance().fullWidth/ 2 - 150, 0);
        let pos_3 = cc.v2(this.node.x, -AdaptarManager.getInstance().fullHeight/6);
        let pos_4 = cc.v2(-AdaptarManager.getInstance().fullWidth/ 2 +  150, 0);
        let time = 5;
        let tween = cc.tween()
            .to(time,{position:pos_2})
            .to(time,{position:pos_3})
            .to(time,{position:pos_4})
            .to(time,{position:pos_3})
            .to(time,{position:pos_2})
            .to(time,{position:pos_3})
            .to(time,{position:pos_4})
            .to(time,{position:pos_3})
            .to(time,{position:pos_2})
            .to(time,{position:pos_1})
            .to(time,{position:pos_4})
            .to(time,{position:pos_1})
        tween.clone(this.node).repeatForever().start()
    }
    onShowVideo(AdvType){
        PlatformManger.getInstance().showVideo(AdvType,{
            success: function () {
                PlatformManger.getInstance().redPackTimerResultShow()
                this.putNode()
            }.bind(this),
            fail: function () {
                this.putNode()
            }.bind(this),
            noVideo:function(){
                this.putNode()
            }.bind(this)
        });
    }
    onclick(){
        let type = ShareAdvType.ShareAdvType.videoBox;
        this.onShowVideo(type)
        this.node.active = false;
    }
    putNode(){
        this.node.getComponent(cc.Animation).stop()
        this.node.stopAllActions();
        LoaderManager.getInstance().releaseViewPrefab(this.SelfPrefab )
        this.node.destroy()
        FightManger.getInstance().VideoBox = null;
    }
    // update (dt) {}
}
