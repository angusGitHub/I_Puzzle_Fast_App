export default class ConstView  {
    /**
     * src 预制体 路径
     * type 类型 
     * NormalNode 节点界面
     * ChildNode 子节点
     * PopUpNode 弹出框界面 
     */
    //节点
    static ViewNode = {
        Veiw_Node:"ViewNode",
        PopUp_Node:"PopUpNode",
        Http_Node:"HttpNode",
    }
    //path
    static ViewPath = {
        ViewRoot_Name:"Canvas/ViewRoot",
    }
    //窗口类型
    static ViewType = {
        /** 普通窗口 */
        View:0,  
        /** 弹出窗口 */
        PopUp:1, 
    }
    /** 是否清理弹出框 */
    static CleanPopUpView = {
        Clean:true,
        Unclean:false,
    }
    static ViewKeyMap = {
        /**
         * src 预制体路径
         * type 窗口类型
         * isCleanPopUpView : 是否清理弹出框
         * ZOrder
         */
        "ViewLogin":{src: "prefabs/view/ViewLogin",ViewType:0,IsCleanPopUpView:true,ZOrder:0},
        "ViewFight":{src: "prefabs/view/ViewFight",ViewType:0,IsCleanPopUpView:true,ZOrder:0},
        "ViewMain":{src: "prefabs/view/ViewMain",ViewType:0,IsCleanPopUpView:true,ZOrder:0},
        
        "ViewPassRedPacket":{src: "prefabs/view/ViewPassRedPacket",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewRedPacket":{src: "prefabs/view/ViewRedPacket",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewPass":{src: "prefabs/view/ViewPass",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewHint":{src: "prefabs/view/ViewHint",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewFail":{src: "prefabs/view/ViewFail",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewGetHint":{src: "prefabs/view/ViewGetHint",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewGetPower":{src: "prefabs/view/ViewGetPower",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        "ViewNoPower":{src: "prefabs/view/ViewNoPower",ViewType:1,IsCleanPopUpView:false,ZOrder:0},
        
        
        //"potView":{src: "prefabs/window/start/startWnd",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0}
    }

}
