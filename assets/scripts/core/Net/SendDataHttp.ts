import Https from "./Https";
import Const from "../../game/Const";
import GameDataManager from "../Data/GameDataManager";

export default class SendDataHttp{
    private static instance: SendDataHttp;
    public static getInstance(): SendDataHttp
    {
        if(this.instance == null)
        {
            this.instance = new SendDataHttp();
        }
        return this.instance;
    }
    HttpUrl:string = Const.Url.HttpUrl; 
    sendIsCanTourist(packageName:any,version:any,_callBack:any){
        let url = this.HttpUrl + "isCanTourist"
        let data  = {
            package:packageName,
            version:version,
        };
        Https.getInstance().get(url,_callBack,data);
    }
    /**
     * 
     * @param equipment 设备号
     * @param channel 客户来源
     * @param _callBack 
     */
    sendGetToken(equipment:any,packageName:any,channel:any,version:any,openid:any,nickname:any,headimgurl:any,unionid:any,city:any,_callBack:any){
        let url = this.HttpUrl + "getJigsawToken"
        let data  = {
            equipment:equipment,
            package:packageName,
            channel:channel,
            version:version,
            openid:openid, 
            nickname: nickname,
            headimgurl: encodeURIComponent(headimgurl),
            unionid: unionid,
            city:city,
        };
        Https.getInstance().post(url,_callBack,data,false);
    }
    //获取用户信息
    sendGetInfo(city:any,channel:any,version:any,_callBack:any){
        let url = this.HttpUrl + "Jigsaw/getJigsawIndex?uid="+ GameDataManager.getInstance().userData.uid;
        let data  = {
            city:city,
            channel:channel,
            version:version,
        };
        Https.getInstance().post(url,_callBack,data,false);
    }

    //  //查询本关卡数据
    //  sendIsRedPacket(levle:number,_callBack:any){
    //     let url = this.HttpUrl + "answer?uid="+ GameDataManager.getInstance().userData.uid;
    //     let data  = {
    //         point:levle,
    //     };
    //     Https.getInstance().post(url,_callBack,data);
    // }
     //扣除体力
     sendDeductPower(levle:number,_callBack:any){
        let url = this.HttpUrl + "spirit/deduct?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            point:levle,
        };
        Https.getInstance().post(url,_callBack,data,false);
    }
    //添加体力
    sendAddPower(num:number,_callBack:any){
        let url = this.HttpUrl + "spirit/pick_up?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            num:num,
        };
        Https.getInstance().post(url,_callBack,data,false);
    }
    //看视频添加体力
    sendSeeVideoAddPower(_callBack:any){
        let url = this.HttpUrl + "spirit/seeVideo?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null;
        Https.getInstance().post(url,_callBack,data,false);
    }
    //领取红包
    sendGetMoney(levle:number,_callBack:any){
        let url = this.HttpUrl + "Jigsaw/receiveBalance?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            point:levle,
        };
        console.log("==data===",data)
        Https.getInstance().post(url,_callBack,data);
    }
    //过关
    sendPassLevel(point:any,_callBack:any){
        let url = this.HttpUrl + "Jigsaw/pass?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            point:point,
        };
        Https.getInstance().post(url,_callBack,data);
    }
   

    //领取红星 红包
    getRedStar(_callBack:any){
        let url = this.HttpUrl + "grantStar?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null;
        Https.getInstance().post(url,_callBack,data);
    }
    
    //后台返回请求
    getMemberRedStar(_callBack:any){
        let url = this.HttpUrl + "simpleDetail?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null;
        Https.getInstance().post(url,_callBack,data);
    }

    //查看提示
    sendChaKanTip(levle:number,is_see:number,_callBack:any){
        let url = this.HttpUrl + "Jigsaw/useTips?uid="+ GameDataManager.getInstance().userData.uid;
        let data  = {
            point:levle,
            is_see:is_see,//是否可以观看视频观看视频1，0未观看
        };
        Https.getInstance().post(url,_callBack,data);
    }

    //获取登录红包
    getLoginRedPacket(_callBack:any){
        let url = this.HttpUrl + "idiomStart?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null;
        Https.getInstance().post(url,_callBack,data);
    }
}
