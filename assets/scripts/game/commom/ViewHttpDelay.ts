// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import Https from "../../core/Net/Https";
import { LoaderManager } from "../../core/Loader/LoaderManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewHttpDelay extends cc.Component {

    @property(cc.Node)
    btnRetry: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    prefab:cc.Prefab = null;
    onLoad () {
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnRetry.on('click', this.onRetry, this);
    }
    init(prefab:cc.Prefab){
        this.prefab = prefab;
    }
    start () {

    }
    onRetry(){
        this.node.destroy()
        Https.getInstance().onRetry()
        LoaderManager.getInstance().releaseAsset(this.prefab)
    }
    // update (dt) {}
}
