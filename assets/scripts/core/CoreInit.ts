import GameDataManager from "./Data/GameDataManager"
import PlatformManger from "./Platform/PlatformManger"
import AudioManager from "./Audio/AudioManager"
import AdaptarManager from "./Adaptar/AdaptarManager"
import DebugHT from "../game/DebugHT"


export default class CoreInit{
    constructor() {
        //加载所有的data
        GameDataManager.getInstance().loadAllData()
        //初始化平台
        PlatformManger.getInstance().initPlatform()
        //屏幕适配初始化 (竖屏)
        AdaptarManager.getInstance().initVertical()
        //初始化音乐
        AudioManager.getInstance().init()

        cc.macro.ENABLE_MULTI_TOUCH = false;//关闭多点触摸

        cc.debug.setDisplayStats(DebugHT.isDebug)
        if(DebugHT.isDebug){
            DebugHT.Test()
        }
    }
}
