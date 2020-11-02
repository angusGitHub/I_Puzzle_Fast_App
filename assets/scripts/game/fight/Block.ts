// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FightConst from "./FightConst";
import FightManger from "./FightManger";
import FightPoolManger from "./FightPoolManger";
import GameUtils from "../../core/Util/GameUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Node)
    Shadow: cc.Node = null;
    
   
    touchStartTime:number = 0;
    // onLoad () {}
    data:any = null;

    scaleNum:number = 0;//缩放的值

    isTouch:boolean = false;
    init(data){
        this.isTouch = false;
        this.data = data;
        let Texture = data.Texture;
        let DrawPost = data.DrawPost;
        let width = data.Width;
        let height = data.Height;
        this.setRestoreScale();
        this.scaleNum = FightManger.getInstance().getScaleNum(FightManger.getInstance().CutLineNum)
        let frames = new cc.SpriteFrame(Texture,cc.rect(DrawPost.x*width,DrawPost.y*height,width,height))
        this.sprite.spriteFrame = frames;
        this.node.zIndex = 0;
        this.initTouchEvent();
        if(data.CallBack){
            data.CallBack()
        }
    }
    initTouchEvent(){
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove,this)
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this)
    }
    setTouch(){
        this.isTouch = true;
    }
    touchStart(event:cc.Touch){
        if(!this.isTouch){
            return
        }
        if(FightManger.getInstance().Gamestate != FightConst.Gamestate.StartGame){
            return;
        }
        if(FightManger.getInstance().Level == FightConst.GuideLevel && FightManger.getInstance().Hand){
            if(FightManger.getInstance().Hand.HandType == 1){
                FightManger.getInstance().Hand.putNode()
            }
        }
        this.touchStartTime = Date.now(); 
        this.node.zIndex = 2;
        this.setBigScale()
        var pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.node.x = pos.x;
        this.node.y = pos.y;
    }
    touchMove(event:cc.Touch){
        if(!this.isTouch){
            return
        }
        if(FightManger.getInstance().Gamestate != FightConst.Gamestate.StartGame){
            return;
        }
        let pos = event.getDelta()


        this.node.x += pos.x;
        this.node.y += pos.y;
        if(this.node.y <= FightManger.getInstance().Ran_Y_2){
            this.node.y = FightManger.getInstance().Ran_Y_2;
        }
    }
    touchEnd(event){
        if(!this.isTouch){
            return
        }
        if(FightManger.getInstance().Gamestate != FightConst.Gamestate.StartGame){
            return;
        }
        FightManger.getInstance().Gamestate = FightConst.Gamestate.TouchEnd;
        this.node.zIndex = 0;
        if(Date.now() - this.touchStartTime <= FightConst.clickAngleTime){//旋转
            this.checkBlock(-90)
        }else{
            this.checkBlock(0)
        }
        
    }
    checkBlock(angle){
        if(FightManger.getInstance().Level == FightConst.GuideLevel && FightManger.getInstance().Hand){
            if(FightManger.getInstance().Hand.HandType == 0){
                angle = 0;
            }
        }
        let block = FightManger.getInstance().getAdsorbBlock(this.node);//获取要吸附的点
        if(block){//吸附到上面
            if(FightManger.getInstance().getIsCover(block)){//是否有覆盖
                this.node.zIndex = 1;
                this.playSmallScaleAni(angle);
            }else{
                this.playAdsorbAni(block,angle)
            }
        }else{
            this.playSmallScaleAni(angle);
        }
    }
    //播放吸附
    playAdsorbAni(block,_angle){
        if(FightManger.getInstance().Level == FightConst.GuideLevel && FightManger.getInstance().Hand){
            if(FightManger.getInstance().Hand.HandType == 0){
                FightManger.getInstance().Hand.playTwoAni()
            }
        }
        let scaleTime = 0.1;
        if(_angle == 0){
            scaleTime = 0;
        }
        let tween = cc.tween;
        tween(this.node)
            .to(scaleTime,{angle:this.node.angle + _angle})
            .to(0.1,{position:block.data.Position})
            .call(() => {
                if(this.node.angle == -360){
                    this.node.angle = 0;
                }
                if(FightManger.getInstance().checkGameOver()){
                    // GameUtils.showTip("===GameOver=")
                    FightManger.getInstance().gameOver()
                }else{
                    FightManger.getInstance().Gamestate = FightConst.Gamestate.StartGame;
                }
            })
            .start()
    }
    playSmallScaleAni(_angle){
        let scaleTime = 0.1;
        if(_angle == 0){
            scaleTime = 0;
        }
        let tween = cc.tween;
        tween(this.node)
            .to(scaleTime,{angle:this.node.angle + _angle})
            .to(0.1,{scale:this.scaleNum})
            .call(() => {
                this.Shadow.active = true;
                if(this.node.angle == -360){
                    this.node.angle = 0;
                }
                FightManger.getInstance().Gamestate = FightConst.Gamestate.StartGame;
            })
            .start()
    }
    setRestoreScale(){
        this.node.scale = 1;
        this.node.width = this.data.Width;
        this.node.height = this.data.Height;
        this.sprite.node.width = this.data.Width;
        this.sprite.node.height = this.data.Height;
        this.Shadow.width = this.data.Width + 10;
        this.Shadow.height = this.data.Height + 10;
        this.Shadow.active = false;
    }
    setScaleNum(lineNum){
        if(FightConst.CutLineType.one == lineNum ){
            this.scaleNum = 0.5;
        }else if(FightConst.CutLineType.two == lineNum ){
            this.scaleNum = 0.7;
        }else if(FightConst.CutLineType.three == lineNum ){
            this.scaleNum = 0.9;
        }
    }
    setSmallScale(){
        this.node.scale = this.scaleNum;
        this.Shadow.active = true;
    }
    setBigScale(){
        this.node.scale = 1;
        this.Shadow.active = false;
    }
    putNode(){
        FightPoolManger.getInstance().putBlock(this.node)
        
    }
    start () {

    }

    // update (dt) {}
}
