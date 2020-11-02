
export default class ShareAdvType {

    public static TypeNum = 8
    //分享 视频 类型
    public static ShareAdvType = {
        none: 0,            //无
        hint: 1,            //提示
        passVideoClose:2,   //过关视频（可关闭）
        passGetRedPacket:3, //过关领取红包
        passGetRedPacketClose:4, //过关红包(关闭)
        passDoubelGetRedPacket:5, //过关双倍领取红包
        videoBox:6, //视频宝箱
        addPower:7, //添加体力
        powerNot:8, //体力不足
    }
    //显示广告 或者 分享
    public static shareAdvShow:{ [index: number]: number } = {
        0: 0,     // 0 显示分享 1 显示广告
        1: 1,            
        2: 1,               
        3: 1,               
        4: 1,                              
        5: 1,                              
        6: 1,                              
        7: 1,                              
        8: 1,                              
        9: 1,                              
        10: 1,                              
    }  
    public static shareAdvName:{ [index: number]: string } = {
        0: "大图",               
        1: "提示-视频",            
        2: "过关视频（可关闭）",                 
        3: "过关领取红包-视频",                                      
        4: "过关红包(关闭)",                                      
        5: "过关双倍领取红包",  
        6: "视频宝箱-视频", 
        7: "体力加号-视频",                                    
        8: "体力不足-视频",                                      
    }  
    public static androidName:{ [index: number]: string } = {
        0: "datu",    //大图           
        1: "shipin-tishi",           
        2: "shipin-guoguanquanping", //可关闭               
        3: "shipin-guoguanhongbao",            
        4: "shipin-guanbiguoguanhongbao",               
        5: "shipin-shuangbei",                
        6: "shipin-piaofubaoxiang", 
        7: "shipin-tilijiahao",             
        8: "shipin-tilibuzhu",                
    } 
    public static AllAdv(){
        for(let index = 1;index <= ShareAdvType.TypeNum;++index){
            ShareAdvType.shareAdvShow[index] = 1
        }
    }
    public static AllShare(){
        for(let index = 1;index <= ShareAdvType.TypeNum;++index){
            ShareAdvType.shareAdvShow[index] = 0
        }
    }
    
}
