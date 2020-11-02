import SendDataHttp from "./SendDataHttp";
import GameDataManager from "../Data/GameDataManager";
import GameUtils from "../Util/GameUtils";
import ViewManager from "../View/ViewManager";
import Const from "../../game/Const";
import FightManger from "../../game/fight/FightManger";
import PlatformManger from "../Platform/PlatformManger";



export default class HttpCallBack{
    private static instance: HttpCallBack;
    public static getInstance(): HttpCallBack
    {
        if(this.instance == null)
        {
            this.instance = new HttpCallBack();
        }
        return this.instance;
    }
    sendIsCanTourist(packageName,version,callBack){
        SendDataHttp.getInstance().sendIsCanTourist(packageName,version,{
            success:function(responseText){
                let responseData = JSON.parse(responseText);
                console.log("=sendIsCanTourist=",responseData)
                
                if(callBack){
                    callBack(responseData);
                }
            }.bind(this),
            fail:function(str){
            }.bind(this),
        })
    }
    //获取token
    getToken(equipment,packageName,channel,version,openid,nickname,headimgurl,unionid,city,callBack?:any){
        SendDataHttp.getInstance().sendGetToken(equipment,packageName,channel,version,openid,nickname,headimgurl,unionid,city,{
            success:function(responseText){
                let responseData = JSON.parse(responseText);
                cc.log("=getToken=",responseData)
                if(responseData.code == 200){
                    let data = responseData.data;
                    this.setInfo(data)
                    GameDataManager.getInstance().userData.setUid(data.user.uid);//用户id
                    GameDataManager.getInstance().userData.setLoginToken(data.user.api_token);//用户唯一表标识
                }else{
                    GameUtils.showTip(responseData.message)
                }
                if(callBack){
                    callBack(responseData);
                }
            }.bind(this),
            fail:function(str){
            }.bind(this),
        })
    }
    setInfo(data){
        let setting = data.setting;
        let user = data.user;
        if(setting.is_shield == 2){//是否开启红包 是否屏蔽红包 1屏蔽 2不屏蔽
            GameDataManager.getInstance().kaiGuan.isOpenRedPacket = true;
            // GameDataManager.getInstance().kaiGuan.isOpenRedPacket = false;
        }else{
            GameDataManager.getInstance().kaiGuan.isOpenRedPacket = false;
            // GameDataManager.getInstance().kaiGuan.isOpenRedPacket = true;
        }
        if(setting.is_begin_task == 1){ //1显示 是否显示每日福利 1已开启 0已关闭
            GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare = true;
            // GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare = false;
        }else{
            GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare = false;
        }
        if(setting.is_show == 1){ //控制导出
            GameDataManager.getInstance().kaiGuan.isOpenExport = true;
        }else{
            GameDataManager.getInstance().kaiGuan.isOpenExport = false
        }
        GameDataManager.getInstance().serverData.tempData.exportIconUrl = setting.icon_address;//导出iconUrl
        GameDataManager.getInstance().serverData.tempData.exportUrl = setting.advert_address;//导出url

        GameDataManager.getInstance().serverData.tempData.newUserRedPacket = user.new_balance;//新用户给的金额
        GameDataManager.getInstance().serverData.tempData.headimgurl = user.headimgurl;  //用户头像
        GameDataManager.getInstance().serverData.tempData.name = user.nickname;    //用户昵称
        GameDataManager.getInstance().userData.level = user.current_point + 1;//关卡
        GameDataManager.getInstance().userData.money = user.balance;  //用户余额

        GameDataManager.getInstance().userData.hintNum = user.free_tips_num//提示数量;


        let count_down_time = user.count_down_time;//漂浮宝箱倒计时
        GameDataManager.getInstance().serverData.tempData.timingRedPacketTime = count_down_time.surplus_second//漂浮宝箱倒计时
        GameDataManager.getInstance().serverData.tempData.timingRedPacketType = count_down_time.is_receive;//是否可领取 0未到时间 1今日已完成 2待领取 


        GameDataManager.getInstance().serverData.tempData.appleTotalNum = user.need_num;//苹果总
        GameDataManager.getInstance().serverData.tempData.appleNum = user.fruits_num;//苹果分
        
        if(user.red_target_info){//签到信息
            GameDataManager.getInstance().serverData.tempData.signInLevelNum = user.red_target_info.member_red_num;//签到每天完成关卡
            GameDataManager.getInstance().serverData.tempData.signInTotalLevelNum = user.red_target_info.daily_red_num;//签到每天总关卡
        }
        if(user.medal){//任务信息
            GameDataManager.getInstance().serverData.tempData.dailyWelfareNum = user.medal.current_num;//每日福利数量
            GameDataManager.getInstance().serverData.tempData.dailyWelfareTotalNum = user.medal.need_num;//每日福利总数量
        }
        
        GameDataManager.getInstance().userData.powerNum = user.spirit;                         //能量
        // GameDataManager.getInstance().userData.lastRecoverPowerTime = user.pick_time;        //上次回复能量时间
        if(user.spirit_down_time != 0){
            Const.Power.recover_inteval = user.spirit_down_time;
        }
        Const.Power.maxNum = user.spirit_full;
        
    }
     //获取个人消息
    getInfo(city,channel,version,callback){
        SendDataHttp.getInstance().sendGetInfo(city,channel,version,{
            success:function(responseText){
                let responseData = JSON.parse(responseText)
                cc.log("=getInfo=",responseData)
                if(responseData.code == 200){
                    let data = responseData.data;
                    this.setInfo(data)            
                }else{
                    GameUtils.showTip(responseData.message)
                }
                if(callback){
                    callback(responseData)
                }
            }.bind(this),
            fail:function(str){
            }.bind(this),
        })
    }
     //扣除体力
     sendDeductPower(callback = null){
        let level = GameDataManager.getInstance().userData.level;
        SendDataHttp.getInstance().sendDeductPower(level,{
            success:function(responseText){
                 let responseData = JSON.parse(responseText)
                 console.log("=responseData=",responseData)
                 if(responseData.code == 200){
                     if(callback){
                         callback(responseData)
                     }
                 }else{
                    //  GameUtils.showTip(responseData.message)
                 }
            }.bind(this),
            fail:function(str){
            }.bind(this),
        })
    }
    sendAddPower(num,callback = null){
        SendDataHttp.getInstance().sendAddPower(num,{
            success:function(responseText){
                 let responseData = JSON.parse(responseText)
                 console.log("=responseData=",responseData)
                 if(responseData.code == 200){
                     if(callback){
                         callback(responseData)
                     }
                 }else{
                    //  GameUtils.showTip(responseData.message)
                 }
            }.bind(this),
            fail:function(str){
            }.bind(this),
        })
    }
    sendSeeVideoAddPower(callback){
        SendDataHttp.getInstance().sendSeeVideoAddPower({
            success:function(responseText){
                 let responseData = JSON.parse(responseText)
                 console.log("=responseData=",responseData)
                 if(responseData.code == 200){
                     if(callback){
                         callback(responseData)
                     }
                 }else{
                    //  GameUtils.showTip(responseData.message)
                 }
            }.bind(this),
            fail:function(str){
            }.bind(this),
        })
    }
    //获取登录红包
    // getLoginRedPacket(callback){
    //     SendDataHttp.getInstance().getLoginRedPacket({
    //         success:function(responseText){
    //             let responseData = JSON.parse(responseText)
    //             cc.log("=getLoginRedPacket=",responseData)
    //             if(responseData.code == 200){
    //                 let data = responseData.data;
    //                 GameDataManager.getInstance().serverData.tempData.loginRedPacketId = data.red_id// 红包id 0没有红包 = loginRedPacket;//登录给的钱   
    //                 if(callback){
    //                     callback(responseData)
    //                 }
    //             }else{
    //                 GameUtils.showTip(responseData.message)
    //             }
    //         }.bind(this),
    //         fail:function(str){
    //             this.getInfo(callback)
    //         }.bind(this),
    //     })
    // }
    //请求关卡数据
    // sendLevelData(callback){
    //     let level = GameDataManager.getInstance().userData.level
    //     MainSceneManager.getInstance().MainScene.showLoading()
    //     SendDataHttp.getInstance().sendIsRedPacket(level,{
    //         success:function(responseText){
    //             MainSceneManager.getInstance().MainScene.hideLoading();
    //             let responseData = JSON.parse(responseText)
    //             cc.log("===sendLevelData=",responseData)
    //             if(responseData.code == 200){
    //                 let data = responseData.data;
    //                 if(callback){
    //                     callback(responseData)
    //                 }
    //             }else{
    //                 GameUtils.showTip(responseData.message)
    //             }
    //         }.bind(this),
    //         fail:function(str){
    //             MainSceneManager.getInstance().MainScene.hideLoading();
    //         }.bind(this),
    //    })
    // }
    //获取money
    sendGetMoney(callback){
        let level = GameDataManager.getInstance().userData.level;
        SendDataHttp.getInstance().sendGetMoney(level,{
           success:function(responseText){
            ViewManager.getInstance().HideHttpLoading()
               let responseData = JSON.parse(responseText)
               cc.log("===sendGetMoney=",responseData)
                if(responseData.code == 200){
                    GameDataManager.getInstance().userData.money = responseData.data.total_balance;
                    let red_target_info = responseData.data.red_target_info;
                    if(red_target_info){
                        GameDataManager.getInstance().serverData.tempData.signInLevelNum = red_target_info.member_red_num;
                    }
                    if(callback){
                        callback(responseData)
                    }
                }else{
                    GameUtils.showTip(responseData.message)
                }
           }.bind(this),
           fail:function(str){
           }.bind(this),
       })
    }
    //过关请求
    sendPassLevel(callback){
        let Level = GameDataManager.getInstance().userData.level;
        SendDataHttp.getInstance().sendPassLevel(Level,{
           success:function(responseText){
               let responseData = JSON.parse(responseText)
               console.log("====sendPassLevel====",responseData)
               if(responseData.code == 200){
                let money = responseData.data.balance;
                if(money > 0){
                    GameDataManager.getInstance().serverData.redPacket.isShowPassPage = true;//是否显示过关界面
                    GameDataManager.getInstance().serverData.redPacket.passRedPacketMoney = money;//过关红包金额
                    if(responseData.data.is_see == 1){//1需要 0不需要
                        GameDataManager.getInstance().serverData.redPacket.isPassVideo = true;//过关领红包是否需要看视频
                    }else{
                        GameDataManager.getInstance().serverData.redPacket.isPassVideo = false;//过关领红包是否需要看视频
                    }
                    if(responseData.data.skip_see_video == 1){//1需要 0不需要
                        GameDataManager.getInstance().serverData.redPacket.isOpenPlayCloseVideo = true;//过关领红包是否需要看视频
                    }else{
                        GameDataManager.getInstance().serverData.redPacket.isOpenPlayCloseVideo = false;//过关领红包是否需要看视频
                    }
                }else{
                    GameDataManager.getInstance().serverData.redPacket.isShowPassPage = false;
                }
                if(GameDataManager.getInstance().kaiGuan.isOpenRedPacket){
                    
                    if(responseData.data.fruits_num){
                        PlatformManger.getInstance().showGetFruitsDialog(responseData.data.fruits_num)
                    }
                }
                if(callback){
                    callback(responseData)
                }
                }else{
                    GameUtils.showTip(responseData.message)
                }
           }.bind(this),
           fail:function(str){
           }.bind(this),
       })
    }

    //领取分红星
    sendGetRedStar(callback){
        SendDataHttp.getInstance().getRedStar({
           success:function(responseText){
                let responseData = JSON.parse(responseText)
                cc.log("===sendGetRedStar=",responseData)
                if(responseData.code == 200){
                    if(callback){
                        callback(responseData)
                    }
                }else{
                    GameUtils.showTip(responseData.message)
                }
           }.bind(this),
           fail:function(str){
           }.bind(this),
       })
    }
    //后台切换的时候调用
    sendGetMemberRedStar(callback){
        SendDataHttp.getInstance().getMemberRedStar({
           success:function(responseText){
               let responseData = JSON.parse(responseText)
                cc.log("===sendGetMemberRedStar=",responseData)
                if(responseData.code == 200){
                    let red_star = responseData.data.red_star;
                    let count_down_time = responseData.data.count_down_time;
                    GameDataManager.getInstance().serverData.tempData.redStarTotalTime = red_star.total_second;
                    GameDataManager.getInstance().serverData.tempData.redStarRemainTime = red_star.surplus_second;
                    GameDataManager.getInstance().serverData.tempData.redStarAddMoney = red_star.amount;
                    GameDataManager.getInstance().serverData.tempData.timingRedPacketType = count_down_time.is_receive;
                    GameDataManager.getInstance().serverData.tempData.timingRedPacketTime = count_down_time.surplus_second;
                    if(callback){
                        callback(responseData)
                    }
                }else{
                    GameUtils.showTip(responseData.message)
                }
           }.bind(this),
           fail:function(str){
           }.bind(this),
       })
    }

    sendChaKanTip(isSee,callback){
        let level = GameDataManager.getInstance().userData.level;
        SendDataHttp.getInstance().sendChaKanTip(level,isSee,{
           success:function(responseText){
               let responseData = JSON.parse(responseText)
                cc.log("===sendChaKanTip=",responseData)
                if(responseData.code == 200){
                    let tips_num = responseData.data.tips_num
                    GameDataManager.getInstance().userData.hintNum = tips_num;
                    if(callback){
                        callback(responseData)
                    }
                }else{
                    GameUtils.showTip(responseData.message)
                }
           }.bind(this),
           fail:function(str){
           }.bind(this),
       })
    }
}