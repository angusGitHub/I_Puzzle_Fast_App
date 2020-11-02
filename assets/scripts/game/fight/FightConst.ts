// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightConst{

    
    static Gamestate = { //游戏状态
        NoStart:0,      //没有开始
        StartGame:1,    //开始游戏
        GameHint:2,     //提示
        TouchEnd:3,
        EndGame:4,     //游戏结束
    }
    static MaxLevel = 18;
    static CutImgWidth = 720;
    static CutImgHeight = 720;
    
    static gameOverDelayTime = 0.5;//游戏结束延时

    static clickAngleTime = 300;//点击旋转时间

    static CutLineType = {
        one:1,
        two:2,
        three:3
    }

    static GuideLevel = 1;
}
