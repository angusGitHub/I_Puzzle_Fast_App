import UserData from "../Data/UserData";
import UserLocalData from "../Data/UserLocalData";
import ServerData from "../Data/ServerData";
import GameUtils from "../Util/GameUtils";

class TempData {
    
} 
class KaiGuan {
    isOpenRedPacket:boolean = true;    //是否开启红包
    isOpenDailyWelfare:boolean = true;//是否开始每日福利
    isOpenExport:boolean = true;//是否导出

    isOpenShare: boolean = true;   //是否开启分享
    shareDelay : number = 3000;     //分享延迟
    isAllVideo: boolean = false;    //是否全视频
    isAllShare: boolean = false;    //是否全分享
    isEnableOut: boolean = false;    //是否允许导出
    bannerRefreshTime:number = 300000;//banner刷新时间
    isTouShu:boolean = false;       //是否关闭投诉
    
    isAreaMask: boolean = false;    //是否区域屏蔽
    isPingbiUser : boolean = false; //是否屏蔽用户
}

export default class GameDataManager  {

    private static instance: GameDataManager;
    public static getInstance(): GameDataManager
    {
        if(this.instance == null)
        {
            this.instance = new GameDataManager();
        }
        return this.instance;
    }
    // tempData: TempData = new TempData();
    kaiGuan: KaiGuan = new KaiGuan();
    serverData: ServerData = new ServerData();
    
    static KEY_USER_DATA = "userData_rice";
    userData: UserData = new UserData();
    static KEY_USER_LOCAL_DATA = "userLocalData_rice";
    userLocalData:UserLocalData = new UserLocalData();
    init(){
        this.loadAllData()
    }
    loadAllData(){
        let userData = this.getLocalData(GameDataManager.KEY_USER_DATA);
        if(userData){
            this.userData.copy(userData);
            this.onDataInit();
        }
        // let name = GameUtils.randomWord(false,8,8)
        // this.userData.setName(name,false)
        let userLocalData = this.getLocalData(GameDataManager.KEY_USER_LOCAL_DATA);
        if(userLocalData){
            this.userLocalData.copy(userLocalData);
        }
        let openId = GameUtils.randomWord(true,6,10)
        this.userLocalData.setOpenId(openId) //设置openId
        this.userLocalData.setRegisteredTime(Date.now())//设置注册时间
    }
    //获取数据
    getLocalData(key:string) {
        let str =cc.sys.localStorage.getItem(key);
        if (str) {
            try {
                let data = JSON.parse(str);
                return data;
            } catch (error) {
                console.log(error);
            }
            return null;
        }
        return null;
    }
    //保存数据
    setLocalData(key:string,data:any) {
        let str = "{}";
        if (data) {
            str = JSON.stringify(data);
        }
        cc.sys.localStorage.setItem(key, str);
    }
    saveUserData(){
        this.setLocalData(GameDataManager.KEY_USER_DATA,this.userData);
    }
    saveUserLocalData(){
        this.setLocalData(GameDataManager.KEY_USER_LOCAL_DATA,this.userLocalData);
    }
    /**
     * 玩家数据初始化
     */
    onDataInit() {
        //隔天初始化
        GameDataManager.getInstance().userData.nextDayClean();
    }
    //移除键值对
    removeItem(key:string){
        cc.sys.localStorage.removeItem(key)
    }
    getUserHead() {
        
    }
    // update (dt) {}
}
