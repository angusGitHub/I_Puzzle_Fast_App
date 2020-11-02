// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import MainScene from "./MainScene";
import ViewMain from "../game/view/ViewMain";
import ViewFight from "../game/view/ViewFight";
import ViewPass from "../game/view/ViewPass";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainSceneManager{
    private static instance: MainSceneManager = null;
    public static getInstance(): MainSceneManager {
		if (MainSceneManager.instance == null) {
			  MainSceneManager.instance = new MainSceneManager();
		}
		return MainSceneManager.instance;
    }
    MainScene:MainScene = null;
    
    ViewMain:ViewMain = null;
    ViewFight:ViewFight = null;
    ViewPass:ViewPass = null;
    init(mainScene:MainScene){
        this.MainScene = mainScene;
    }
    setViewMain(ViewMain:ViewMain){
      this.ViewMain = ViewMain;
    }
    setViewFight(ViewFight:ViewFight){
      this.ViewFight = ViewFight;
    }
    setViewPass(ViewPass:ViewPass){
      this.ViewPass = ViewPass;
    }
    
}
