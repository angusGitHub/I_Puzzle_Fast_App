import ConstView from "./ConstView";
import ListenerManager from "../Protobuf/ListenerManager";


export class ViewType {
    /** 是否清弹窗 */
    public IsClearPopUpView = false;
    //UI窗体（位置）类型
    public View_Type = ConstView.ViewType.View;
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseView extends cc.Component {
    /** 窗体名字,该窗体的唯一标示(请不要对这个值进行赋值操作, 内部已经实现了对应的赋值) */
    public ViewName: string;
    /** 窗体类型 */
    public VeiwType = new ViewType();

    // onLoad () {}
    start () {
    }
    /**
     * 消息初始化
     * 子类需重写此方法
     * @param obj
     */
    public init(obj?: any) {
        // todo...
    }
    /**
     * 显示View
     */
    public showBaseView(){
        this.node.active = true;
        //是不是弹出窗口
        if(this.VeiwType.View_Type == ConstView.ViewType.PopUp) {//弹出框
            this.ShowPopUpAnimation(() => {
                
            });
        }else if(this.VeiwType.View_Type == ConstView.ViewType.View){//

        }
    }
    /**
     * 隐藏View
     */
    public hideBaseView() {
        if(this.VeiwType.View_Type == ConstView.ViewType.PopUp) {
            this.HidePopUpAnimation(() => {
                this.node.active = false;
            });
        }else if(this.VeiwType.View_Type == ConstView.ViewType.View){
            this.node.active = false;
        }
    }
    /**
     * 隐藏, 已经进行删除操作(在全局表中有缓存)
     */
    public onBaseViewClose(){
        this.node.destroy();
        ListenerManager.getInstance().removeMessageByTarget(this)
    }
    /**
     * 弹窗动画
     */
    public ShowPopUpAnimation(callback: Function) {
        callback();
    }
    public HidePopUpAnimation(callback: Function) {
        callback();
    }

    // update (dt) {}
}
