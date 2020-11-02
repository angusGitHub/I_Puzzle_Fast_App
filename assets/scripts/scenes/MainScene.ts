
import MainSceneManager from "./MainSceneManager";
import AdaptarManager from "../core/Adaptar/AdaptarManager";
import ViewManager from "../core/View/ViewManager";
import CoreInit from "../core/CoreInit";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    

    isShowLoading:boolean = false;
    init(){
        
    }
    onLoad () {
        new CoreInit();
        MainSceneManager.getInstance().init(this);
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("Main_Bg"));
        AdaptarManager.getInstance().adaptarLogo(this.node.getChildByName("Logo"));
        this.loadLoad()
    }
    loadLoad(){
        ViewManager.getInstance().ShowView("ViewLogin")
    }
    start () {

    }

    // update (dt) {}
}
