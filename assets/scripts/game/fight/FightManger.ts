// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import ViewFight from "../view/ViewFight";
import FightConst from "./FightConst";
import GameDataManager from "../../core/Data/GameDataManager";
import FightPoolManger from "./FightPoolManger";
import PlatformManger from "../../core/Platform/PlatformManger";
import HttpCallBack from "../../core/Net/HttpCallBack";
import ViewManager from "../../core/View/ViewManager";
import ShareAdvType from "../../core/Platform/ShareAdvType";
import { LoaderManager } from "../../core/Loader/LoaderManager";
import Block from "./Block";
import GameUtils from "../../core/Util/GameUtils";
import Const from "../Const";
import VideoBox from "../view/VideoBox";
import AdaptarManager from "../../core/Adaptar/AdaptarManager";
import Hand from "./Hand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightManger {

    private static instance: FightManger = null;
    
    public static getInstance(): FightManger {
		if (FightManger.instance == null) {
			FightManger.instance = new FightManger();
		}
		return FightManger.instance;
    }
    Hand: Hand = null;
    ViewFight:ViewFight = null;
    Gamestate:number = FightConst.Gamestate.NoStart;
    CutLineNum:number = FightConst.CutLineType.one;
    Level:number = 0;//本关关卡数
    BlockTabel: Array<Array<Block>> = new Array<Array<Block>>();

    Ran_X_1:number = 0;
    Ran_X_2:number = 0;
    Ran_Y_1:number = 0;
    Ran_Y_2:number = 0;

    VideoBox:VideoBox = null;


    init(ViewFight:ViewFight){
        this.ViewFight = ViewFight;
        this.initData()
    }

    initData(){
        this.Gamestate = FightConst.Gamestate.NoStart;
        this.Level = GameDataManager.getInstance().userData.level;
        this.CutLineNum = this.getLineNum();
        this.ViewFight.refreshGraphics()
        this.ViewFight.refreshLevelLabel()
        let scaleNum = this.getScaleNum(this.CutLineNum);
        let touchY = this.ViewFight.CheckAreaNode.getChildByName("touchNode").y
        let height = this.ViewFight.CheckAreaNode.getChildByName("touchNode").convertToWorldSpaceAR(cc.v2(0,0)).y - 150;
        this.Ran_X_1 = 375 - (FightConst.CutImgHeight/(this.CutLineNum + 1)*scaleNum)/2
        this.Ran_X_2 = -375 + (FightConst.CutImgHeight/(this.CutLineNum + 1)*scaleNum)/2
        this.Ran_Y_1 = touchY - (FightConst.CutImgHeight/(this.CutLineNum + 1)*scaleNum)/2
        this.Ran_Y_2 = this.Ran_Y_1 - height + (FightConst.CutImgHeight/(this.CutLineNum + 1)*scaleNum);
        this.load()
    }
    getLevelUrl(level){
        if( level <= FightConst.MaxLevel){
            let url = Const.Url.HttpLevelImg + level +".png"
            return url;
        }else if(level > FightConst.MaxLevel){
            let yu = level % FightConst.MaxLevel
            let url = Const.Url.HttpLevelImg + yu +".png"
            if(yu  == 0){
                url = Const.Url.HttpLevelImg + FightConst.MaxLevel +".png"
            }
            return url
        }

    }
    getLineNum(){
        if(this.Level <= 10){
            return FightConst.CutLineType.one;
        }else if(this.Level <= 20){
            return FightConst.CutLineType.two;
        }else{
            return FightConst.CutLineType.three;
        }
    }
    getScaleNum(lineNum){
        if(FightConst.CutLineType.one == lineNum ){
            return 0.5;
        }else if(FightConst.CutLineType.two == lineNum ){
            return 0.7;
        }else if(FightConst.CutLineType.three == lineNum ){
            return 0.9;
        }
    }
    preload(level,callback){
        let url = this.getLevelUrl(level)
        LoaderManager.getInstance().preloadHttpTexure(url,() =>{
            if(callback){
                callback()
            }
        })
    }
    removeLoad(level){
        if(level <= 0){
            return
        }
        let url = this.getLevelUrl(level)
        LoaderManager.getInstance().removeHttpTexure(url)
    }
    load(){
        let url = this.getLevelUrl(this.Level)
        LoaderManager.getInstance().loadHttpTexure(url,(texture)=>{
            var sprite  = new cc.SpriteFrame(texture);
            this.ViewFight.puzzleSprite.spriteFrame = sprite;
            this.createBlock(texture)
            this.preload(this.Level + 1,()=>{
                this.removeLoad(this.Level - 1)
            })
        })
    }
    addBlock(texture,x,y){
        let parentNode = this.ViewFight.CheckAreaNode;
        let xx = - FightConst.CutImgWidth/2 + FightConst.CutImgWidth/(this.CutLineNum + 1)/2 + FightConst.CutImgWidth/(this.CutLineNum + 1)*x;
        let yy = FightConst.CutImgHeight/2 - FightConst.CutImgHeight/(this.CutLineNum + 1)/2 - FightConst.CutImgHeight/(this.CutLineNum + 1)*y;
        let width = FightConst.CutImgWidth/(this.CutLineNum + 1)
        let height = FightConst.CutImgHeight/(this.CutLineNum + 1)
        let pos = cc.v2(xx,yy)
        let data = {
            Texture:texture,
            DrawPost:cc.v2(x,y),
            Width:width,
            Height:height,
            Position:pos
        }
        return FightPoolManger.getInstance().createBlock(parentNode,pos,data)
    }
    createBlock(texture){
        for (let x = 0; x <= this.CutLineNum; x++) {
            this.BlockTabel[x] = []
            for (let y = 0; y <= this.CutLineNum; y++) {
                this.BlockTabel[x][y] =  this.addBlock(texture,x,y)
            }
        }
        
        if(this.Level == FightConst.GuideLevel){
            this.startOneAni()
        }else{
            this.startAni()
        }
    }
    startOneAni(){
        let randomX = GameUtils.getRandom(this.Ran_X_2,this.Ran_X_1)
        let randomy = GameUtils.getRandom(this.Ran_Y_1,this.Ran_Y_2)
        let tween = cc.tween;
        tween(this.BlockTabel[1][1].node)
            .delay(0.3)
            .to(0.3,{scale:this.BlockTabel[1][1].scaleNum})
            .parallel(
                tween().to(0.5,{position:cc.v2(randomX,randomy)}),
                tween().to(0.5,{angle:90})
            )
            .call(() => {
                this.BlockTabel[1][1].Shadow.active = true;
                this.Gamestate = FightConst.Gamestate.StartGame;
                this.BlockTabel[1][1].setTouch()
                this.addHand()
            })
            .start()
    }
    addHand(){
        if(!this.Hand){
            let url = "prefabs/fight/Hand"
            LoaderManager.getInstance().loadPrefab(url,(Prefab)=>{
                let node: cc.Node = cc.instantiate(Prefab)
                node.parent = this.ViewFight.CheckAreaNode;
                node.position = this.BlockTabel[1][1].node.position
                this.Hand = node.getComponent("Hand") as Hand
                this.Hand.init()
            })
        }
    }
    startAni(){
        let angleTable = [0,-90,-180,-270]
        for (let x = 0; x <= this.CutLineNum; x++) {
            for (let y = 0; y <= this.CutLineNum; y++) {
                let randomX = GameUtils.getRandom(this.Ran_X_2,this.Ran_X_1)
                let randomy = GameUtils.getRandom(this.Ran_Y_1,this.Ran_Y_2)
                let angleRan = GameUtils.getRandom(0,3)
                let tween = cc.tween;
                tween(this.BlockTabel[x][y].node)
                    .delay(0.3)
                    .to(0.3,{scale:this.BlockTabel[x][y].scaleNum})
                    .parallel(
                        tween().to(0.5,{position:cc.v2(randomX,randomy)}),
                        tween().to(0.5,{angle:angleTable[angleRan]})
                    )
                    .call(() => {
                        this.BlockTabel[x][y].Shadow.active = true;
                        this.BlockTabel[x][y].setTouch()
                        this.Gamestate = FightConst.Gamestate.StartGame;
                    })
                    .start()
            }
        }  
    }
    //获取吸附的block
    getAdsorbBlock(blockNode){
        let blockTable = FightManger.getInstance().BlockTabel;
        let pos1 = cc.v2(blockNode.x,blockNode.y)
        for (let x = 0; x <= this.CutLineNum; x++) {
            for (let y = 0; y <= this.CutLineNum; y++) {
                let block = blockTable[x][y];
                let dis = Math.abs(pos1.sub(block.data.Position).mag())//两点之间的距离
                if(dis <= FightConst.CutImgWidth/(this.CutLineNum + 1)/2){
                    return block;
                }
            }
        }
        return false;
    }
    //获取是否覆盖
    getIsCover(block){
        let blockTable = this.BlockTabel;
        for (let x = 0; x <= FightManger.getInstance().CutLineNum; x++) {
            for (let y = 0; y <= FightManger.getInstance().CutLineNum; y++) {
                let blockNode = blockTable[x][y].node;
                if(block.data.Position.x == blockNode.x && block.data.Position.y == blockNode.y ){
                    return true
                }
            }
        }
        return false
    }
    //检查游戏是否结束
    checkGameOver(){
        for (let x = 0; x <= this.CutLineNum; x++) {
            for (let y = 0; y <= this.CutLineNum; y++) {
                if(this.BlockTabel[x][y].data.Position.x == this.BlockTabel[x][y].node.x &&  this.BlockTabel[x][y].data.Position.y == this.BlockTabel[x][y].node.y  && this.BlockTabel[x][y].node.angle == 0 ){

                }else{
                    return false;
                }
            }
        }

        return true;
    }

    // 回收block
    putBlock(){
        for (let x = 0; x <= this.CutLineNum; x++) {
            for (let y = 0; y <= this.CutLineNum; y++) {
                let block = this.BlockTabel[x][y];
                block.putNode()
            }
        }
        this.BlockTabel = [];
    }
    //下一关
    nextLevel(){
        GameDataManager.getInstance().userData.setLevel(GameDataManager.getInstance().userData.level + 1)
        this.putBlock();
        this.initData();
    }
    gameOver(){
        this.Gamestate = FightConst.Gamestate.EndGame;
        this.ViewFight.scheduleOnce(()=>{
            this.sendHttpPassLevel()
        },FightConst.gameOverDelayTime)
    }

    getHintBlock(){
        let blockTable = this.BlockTabel;
        for (let x = 0; x <= FightManger.getInstance().CutLineNum; x++) {
            for (let y = 0; y <= FightManger.getInstance().CutLineNum; y++) {
                let blockNode = blockTable[x][y].node;
                let Position = blockTable[x][y].data.Position;
                if(Position.x == blockNode.x && Position.y == blockNode.y  && blockNode.angle == 0 ){

                }else{
                   return blockTable[x][y]
                }
            }
        }
    }
    hintAni(){

        //获取绑定的block
        let getCoverBlock = function(Position){
            let blockTable = this.BlockTabel;
            for (let x = 0; x <= FightManger.getInstance().CutLineNum; x++) {
                for (let y = 0; y <= FightManger.getInstance().CutLineNum; y++) {
                    let blockNode = blockTable[x][y].node;
                    if(Position.x == blockNode.x && Position.y == blockNode.y  && blockNode.angle == 0 ){
                        return blockTable[x][y]
                    }
                }
            }
            return null
        }.bind(this)
        let block = this.getHintBlock()
        let pos = block.data.Position
        let tween = cc.tween;
        tween(block.node)
            .call(()=>{
                block.Shadow.active = false;
                block.node.zIndex = 3;
                let CoverBlock = getCoverBlock(pos)
                if(CoverBlock){
                    CoverBlock.setSmallScale()
                    CoverBlock.node.zIndex = 2;
                }
            })
            .to(0.3,{scale:1,position:cc.v3(pos.x,pos.y),angle:0})
            .call(() => {
                if(this.checkGameOver()){
                    this.gameOver()
                }else{
                    block.node.zIndex = 1;
                    this.Gamestate = FightConst.Gamestate.StartGame;
                }
            })
            .start()
    }
    //提示
    onHint(){
        // this.Gamestate = FightConst.Gamestate.TipGame;
        if(GameDataManager.getInstance().userData.hintNum > 0){
            this.sendHttpHint(0)
        }else{
            let type = ShareAdvType.ShareAdvType.hint;
            this.onShowVideo(type)
        }
    }
    //看视频
    onShowVideo(AdvType){
        PlatformManger.getInstance().showVideo(AdvType,{
            success: function () {
                this.showVideoSuccess(AdvType)
            }.bind(this),
            fail: function () {
                this.Gamestate = FightConst.Gamestate.StartGame;
            }.bind(this),

            noVideo:function(){

            }.bind(this)
        });
    }
    // 看视频成功
    showVideoSuccess(AdvType){
        if(AdvType ==  ShareAdvType.ShareAdvType.hint){
            this.sendHttpHint(1)
        }
    }
    sendHttpHint(type){
        //type 是否可以观看视频观看视频1，0未观看
        HttpCallBack.getInstance().sendChaKanTip(type,(responseData)=>{
            this.Gamestate = FightConst.Gamestate.StartGame;
            this.ViewFight.refreshHintLabel()
            if(type == 1){ 
                //添加体力
                ViewManager.getInstance().ShowView("ViewGetHint",{HintNum:responseData.data.tips_num});
            }else{
                //查看答案
                // ViewManager.getInstance().ShowView("ViewHint");
                this.Gamestate = FightConst.Gamestate.GameHint;
                this.hintAni()
            }
        })

    }
     /**
     * 发送过关请求
     * @param isPass 是否成功过关 false 失败 true 成功
     */
    sendHttpPassLevel(){
        let callback = function(responseText){
            if(!GameDataManager.getInstance().kaiGuan.isOpenRedPacket){//红包关闭
                ViewManager.getInstance().ShowView("ViewPass")
            }else{
                if(!GameDataManager.getInstance().serverData.redPacket.isShowPassPage){
                    ViewManager.getInstance().ShowView("ViewPass")
                }else{
                    ViewManager.getInstance().ShowView("ViewPassRedPacket")
                }
            }
        }.bind(this)
        HttpCallBack.getInstance().sendPassLevel(callback)
    }
    
    addVideoBox(){
        if(!this.VideoBox){
            let url = "prefabs/fight/VideoBox"
            LoaderManager.getInstance().loadPrefab(url,(Prefab)=>{
                let node: cc.Node = cc.instantiate(Prefab)
                node.parent = this.ViewFight.node;
                node.setPosition(0,AdaptarManager.getInstance().fullWidth/ 5)
                this.VideoBox = node.getComponent("VideoBox") as VideoBox
                this.VideoBox.init({selfPrefab:Prefab})
            })
        }
    }
}
