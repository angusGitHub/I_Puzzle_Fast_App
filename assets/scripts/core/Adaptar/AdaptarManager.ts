/**
 * 
 * 屏幕适配
 * 
 * 
 */
export default class AdaptarManager{
    private static instance: AdaptarManager;
    public static getInstance(): AdaptarManager
    {
        if(this.instance == null)
        {
            this.instance = new AdaptarManager();
        }
        return this.instance;
    }
    static WIDTH = 750;
    static HEIGHT = 1334;
    fullWidth:number=0;
    fullHeight:number = 0;
    //横屏
    initLandscape(){
        let designSize = cc.view.getFrameSize();
        let deviceHeight = designSize.height
        let deviceWidth = designSize.width
        this.fullWidth = deviceHeight/deviceWidth * AdaptarManager.WIDTH;
        this.fullHeight = AdaptarManager.WIDTH;
    }
    //---------------------------
    /**
     * 竖屏
     */
    initVertical(){
        let designSize = cc.view.getFrameSize();
        let deviceHeight = designSize.height
        let deviceWidth = designSize.width
        this.fullHeight = deviceHeight/deviceWidth * AdaptarManager.WIDTH;
        this.fullWidth = AdaptarManager.WIDTH;
        cc.log("===fullHeight=====",this.fullHeight)
    }
    adaptarBg(bgNode:cc.Node){
        if (bgNode) {
            bgNode.width = this.fullWidth;
            bgNode.height = this.fullHeight;
            bgNode.setPosition(cc.v2(0,0))
        }
    }
    adaptarLogo(logoNode){
        if (logoNode) {
            logoNode.y = this.fullHeight/2 - 250
        }
    }
    adaptarHeadNode(headNode){
        if (headNode) {
            headNode.y = this.fullHeight/2 - 50
            if((this.fullHeight / this.fullWidth ) > 2.0){
                headNode.y = this.fullHeight/2 - 170
            }
        }
    }
    
    //适配游戏的底部配置
    adapterPassBottom(node) {
        if (node) {
            node.y = -this.fullHeight/2 + 260;
        }
    }
    adapterPassTop(node) {
        if (node) {
            node.y = this.fullHeight/2 - 400;
        }
    }
    adapterFight(node){
        if (node) {
            node.y = this.fullHeight/2 - 30
            if((this.fullHeight / this.fullWidth ) > 2.0){
                node.y = this.fullHeight/2 - 170
            }
        }
    }
    
    //是不是长屏幕
    isChangPing(){
        if(this.fullHeight >= 1400){
            return true;
        }
        return false;
    }
    //适配上面的UI
    adapterVerticalUIFindTop(node) {
        if (node) {
            node.y = this.fullHeight/2
            if((this.fullHeight / this.fullWidth ) > 2.0){
                node.y = this.fullHeight/2 - 170
            }
        }
    }
    //适配弹出框
    adapterVerticalUIWnd(node){
        if (node) {
            node.x = AdaptarManager.WIDTH/2
            node.y = this.fullHeight/2
        }
    }
}
