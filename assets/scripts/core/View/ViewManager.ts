import ConstView from "../View/ConstView";
import BaseView from "../View/BaseView";
import { LoaderManager } from "../Loader/LoaderManager";
import HttpLoading from "../../game/commom/HttpLoading";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewManager extends cc.Component {

    private viewNode: cc.Node = null;                              // 全屏显示的UI 挂载结点
    private httpNode: cc.Node = null;                               // 网络连接Node
    private popUpNode: cc.Node = null;                               // 弹出窗口 的节点
    
    HttpLoading:HttpLoading = null;

    private allViewTable: {[key: string]: BaseView} = cc.js.createMap();           // 所有的View
    private allPrefab: {[key: string]: cc.Prefab} = cc.js.createMap();             // 所有的预制体
    private popUpViewTable:Array<BaseView> = [];                                   // 所有弹出框View
    private nowShowViewTable: {[key: string]: BaseView} = cc.js.createMap();       // 正在显示的窗体(不包括弹窗)
    private allNameTable: {[key: string]: string} = cc.js.createMap()              // 所有的View名字

    private static instance: ViewManager;
    public static getInstance(): ViewManager
    {
        if(this.instance == null)
        {   
            //把ViewManager 添加到scene
            this.instance = cc.find(ConstView.ViewPath.ViewRoot_Name).addComponent<ViewManager>(this); 
        }
        return this.instance;
    }
    onLoad () {
        this.viewNode = this.node.getChildByName(ConstView.ViewNode.Veiw_Node); 
        this.popUpNode = this.node.getChildByName(ConstView.ViewNode.PopUp_Node);
        this.httpNode = this.node.getChildByName(ConstView.ViewNode.Http_Node);
        this.HttpLoading = this.httpNode.getChildByName("HttpLoading").getComponent("HttpLoading")
    }
    start() {
        
    }
    /**
     * 显示View
     * @param viewName 窗体的名字
     * @param obj 初始化信息, 可以不要
     */
    public async ShowView(viewName: string, obj?: any) {
        if(viewName == "" || viewName == null) return ;
        if(this.nameIsShowing(viewName)){
            cc.log(`${viewName}窗体已经在显示`);
            return ;
        }
        this.allNameTable[viewName] = viewName;
        let viewData = ConstView.ViewKeyMap[viewName]
        if(this.viewIsShowing(viewName)) {
            cc.log(`${viewName}窗体已经在显示`);
            return ;  
        }
        let baseView = await this.LoadAllVeiw(viewName);
        if(baseView == null) return ;
        // 初始化窗体名称
        baseView.ViewName = viewName;
        baseView.VeiwType.IsClearPopUpView = viewData.IsCleanPopUpView;//是否清除弹框
        baseView.VeiwType.View_Type = viewData.ViewType;//窗体类型
        // 是否清理弹窗
        if(baseView.VeiwType.IsClearPopUpView) {
            this.ClearPopUpViewTable();
        }
        switch(viewData.ViewType) {
            case ConstView.ViewType.View:                   
                this.LoadViewNowCache(viewName, obj);//界面
            break;
            case ConstView.ViewType.PopUp:                     
                this.PushViewToStack(viewName, obj); //弹窗
            break;
        }
    }
     /**
     * 重要方法 关闭
     * @param viewName 
     * @param isReleaseAsset(true)  是否释放资源 
     */
    public CloseView(viewName: string,isReleaseAsset:boolean = true) {
        let viewData = ConstView.ViewKeyMap[viewName]
        if(viewName == "" || viewName == null) return ;
        let baseView = this.allViewTable[viewName];
        if(baseView == null) return;
        switch(viewData.ViewType) {
            case ConstView.ViewType.View: //界面
                this.ExitView(viewName);
            break;
            case ConstView.ViewType.PopUp: //弹窗
                this.ExitPopVeiw(viewName);
            break;
        }
        // 判断是否释放资源 
        if(isReleaseAsset) {
            LoaderManager.getInstance().releaseViewPrefab(this.allPrefab[viewName])
            this.allPrefab[viewName] = null;
            delete this.allPrefab[viewName];
        }

    }
    /**
     * 窗体是否正在显示
     * @param viewName 
     */
    public viewIsShowing(viewName: string) {
        let baseView = this.allViewTable[viewName];
        if (baseView == null) {
            return false;
        }
        return baseView.node.active;
    }
    public nameIsShowing(viewName: string){
        let baseView = this.allNameTable[viewName];
        if (baseView == null) {
            return false;
        }
        return true;
    }
    /**
     * 从全部的UI窗口中加载, 并挂载到结点上
     */
    private async LoadAllVeiw(viewName: string) {
        let baseView = this.allViewTable[viewName];
        if (baseView == null) {
            //加载指定名称的“UI窗体”
            baseView  = await this.LoadVeiw(viewName) as BaseView;
        }
        return baseView;
    }
    /**
     * 从resources中加载
     * @param viewName 
     */
    private async LoadVeiw(viewName: string) {
        let viewData = ConstView.ViewKeyMap[viewName]
        let strViewPath = viewData.src
        if(strViewPath == "" || strViewPath == null){
            return ;
        }
        let prefab = await LoaderManager.getInstance().loadViewPrefab(strViewPath) as cc.Prefab;
        let node: cc.Node = cc.instantiate(prefab);
        let baseView = node.getComponent(BaseView);
        if(baseView == null) {
            return ;
        }
        node.active = false;
        switch(viewData.ViewType) {
            case ConstView.ViewType.View:
                ViewManager.getInstance().viewNode.addChild(node);
            break;
            case ConstView.ViewType.PopUp:
                ViewManager.getInstance().popUpNode.addChild(node);
            break;
        }
        this.allViewTable[viewName] = baseView;
        this.allPrefab[viewName] = prefab;
        return baseView;
    }
     /**
     * 清除弹出框所有窗口
     */
    private ClearPopUpViewTable(isReleaseAsset:boolean = true) {
        if(this.popUpViewTable.length >= 1){
            for (let index = this.popUpViewTable.length - 1; index >= 0; index--) {
                let element = this.popUpViewTable[index];
                for (const key in this.allViewTable) {
                    if(element == this.allViewTable[key]){
                        this.RemoveAllViewTable(key)
                        if(isReleaseAsset){
                            LoaderManager.getInstance().releaseViewPrefab(this.allPrefab[key])
                            this.allPrefab[key] = null;
                            delete this.allPrefab[key];
                        }
                        break;
                    }
                }
                element.onBaseViewClose();
            }
        }
        this.popUpViewTable = [];
    }
    /**
     * 加载到缓存中
     * @param viewName
     */
    private LoadViewNowCache(viewName: string, obj: any) {
        let baseView: BaseView = null;
        let baseViewFromAllCache: BaseView = null;
        baseView = this.nowShowViewTable[viewName];
        if(baseView != null) return ;     // 要加载的窗口正在显示
        baseViewFromAllCache = this.allViewTable[viewName];
        if(baseViewFromAllCache != null) {
            baseViewFromAllCache.init(obj);
            this.nowShowViewTable[viewName] = baseViewFromAllCache;
            baseViewFromAllCache.showBaseView();
        }
    }
    /**
     * 加载到栈中(弹窗)
     * @param viewName
     */
    private PushViewToStack(viewName: string, obj: any) {
        if(this.popUpViewTable.length > 0) {
            let topView = this.popUpViewTable[this.popUpViewTable.length-1];
            topView.hideBaseView(); 
        }
        let baseView = this.allViewTable[viewName];
        if(baseView == null) return ;
        baseView.init(obj);
        // 加入栈中, 同时设置其zIndex 使得后进入的窗体总是显示在上面
        this.popUpViewTable.push(baseView);       
        baseView.node.zIndex = this.popUpViewTable.length;
        baseView.showBaseView();
    }
    /**
     * --------------------------------- 关闭窗口 --------------------------
     */
    /**
     * 关闭View
     * @param viewName 
     */
    private ExitView(viewName: string) {
        let baseView = this.allViewTable[viewName];
        if(baseView == null) return ;
        baseView.onBaseViewClose();
        this.nowShowViewTable[viewName] = null;
        delete this.nowShowViewTable[viewName];
        this.RemoveAllViewTable(viewName)
    }
    private ExitPopVeiw(viewName) {
        if(this.popUpViewTable.length >= 2) {
            let topView = this.popUpViewTable.pop();
            topView.onBaseViewClose();
            topView = this.popUpViewTable[this.popUpViewTable.length-1];
            topView.showBaseView();
        }else if(this.popUpViewTable.length >= 1) {
            let topView = this.popUpViewTable.pop();//pop() 方法用于删除并返回数组的最后一个元素。
            topView.onBaseViewClose();
        }
        this.RemoveAllViewTable(viewName)
    }
    private RemoveAllViewTable(viewName: string){
        this.allViewTable[viewName] = null;
        delete this.allViewTable[viewName];
        
        this.allNameTable[viewName] = null;
        delete this.allNameTable[viewName];
    }

    public ShowHttpLoading(){
        this.HttpLoading.showLoading()
    }
    public HideHttpLoading(){
        this.HttpLoading.hideLoading()
    }
}
