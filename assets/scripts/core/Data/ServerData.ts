
//临时数据
class TempData {
    name:string = "";                       //名字
    headimgurl:any = null;                  //头像

    perCapitaMoney:any = 0.0;               //人均提现钱
    shareOutBonusMoney:any = 0.0;           //每日分红的钱
    redStarRemainTime:number = 0;           //分红星剩余的时间
    redStarTotalTime:number = 0;            //分红星需要的总时间
    redStarAddMoney:number = 0;             //分红星添加的钱

    timingRedPacketTime:number = 0;         //定时红包的时间
    timingRedPacketType:number = 0;         //定时红包的状态 0未到时间 1今日已完成 2待领取 


    newUserRedPacket:number = 0;            //新用户红包数量;
    loginRedPacketId:number = 0;            //登录红包数Id;

    exportIconUrl:string = "";              //导出icon
    exportUrl:string = "";                  //导出url

    signInTotalLevelNum:any = 0;         //签到每天总关卡
    signInLevelNum:any = 0;              //签到每天完成关卡
    
    appleNum:number = 0;                //苹果数量
    appleTotalNum:number = 0;                //苹果总数量

    dailyWelfareNum:number = 0;         //每日福利数量
    dailyWelfareTotalNum:number = 0;         //每日福利总数量
} 
//红包数据
class RedPacket {
    //过关
    isShowPassPage:boolean = true;          //是否显示过关界面
    passRedPacketMoney:number = 0;          //过关红包金额
    isPassVideo:boolean = true;             //过关领红包是否需要看视频
    passRedPacketNum:number = 0;            //过关红包剩余次数
    // passRedPacketId:number = 1;             //过关领红包Id
    isOpenPlayCloseVideo:boolean = true;    //跳过是否播放是否打开视频
    
}
export default class ServerData  {
    constructor() {
    }
    tempData: TempData = new TempData();
    redPacket: RedPacket = new RedPacket();
}
