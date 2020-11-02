// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FightManger from "./FightManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hand extends cc.Component {

    @property(cc.Node)
    sprite: cc.Node = null;
    @property(cc.Node)
    spriteHand: cc.Node = null;
   

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    HandType:number = 0//状态 0  移动 1 旋转
    init(){
        this.node.zIndex = 5;
        this.hideSprite()
        this.playOneAni()
        this.HandType = 0;
    }
    hideSprite(){
        this.sprite.active = false;
    }
    showSprite(){
        this.sprite.active = true;
    }
    playOneAni(){
        let Block = FightManger.getInstance().BlockTabel[1][1]
        let pos = Block.data.Position
        let tween = cc.tween()
        .call(()=>{
            this.node.position = Block.node.position
        })
        .to(1,{position:cc.v3(pos.x,pos.y)})
        tween.clone(this.node).repeatForever().start()
    }
    playTwoAni(){
        let Block = FightManger.getInstance().BlockTabel[1][1]
        this.HandType = 1;
        this.node.stopAllActions()
        this.node.position = Block.data.Position;

        this.showSprite()
        let time = 0.5;
        let tween = cc.tween()
            .to(time,{scale:.8})
            .to(time,{scale:1})
        tween.clone(this.spriteHand).repeatForever().start()
    }
    putNode(){
        this.node.destroy()
        this.node.stopAllActions()
        FightManger.getInstance().Hand = null;
    }
    start () {

    }

    // update (dt) {}
}
