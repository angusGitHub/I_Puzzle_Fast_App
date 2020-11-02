import SendDataHttp from "../core/Net/SendDataHttp";
import Const from "./Const";
import GameDataManager from "../core/Data/GameDataManager";

export default class DebugHT  {
    
    static USE_VERSION = "version1";
    static VERSION = "1.0.0";
    static Package = "com.jy.pintu";//
    public static isDebug : boolean = true;//true 测试模式 false 不是测试模式
    static Test(){
        SendDataHttp.getInstance().HttpUrl = Const.Url.HttpUrlTest;
        // GameDataManager.getInstance().userData.propHammer = 10;
        // GameDataManager.getInstance().userData.propRefrsh = 10;
        // GameDataManager.getInstance().userData.propIncolor= 10;
    }
}
