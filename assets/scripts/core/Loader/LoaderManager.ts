import PlatformManger from "../Platform/PlatformManger";
import Const from "../../game/Const";

/**
 * 加载模块ts版本
 * author : lidongdong
 * time: 2020.07.06
 */
export  class LoaderManager{
    private static instance: LoaderManager;
    public static getInstance(): LoaderManager
    {
        if(this.instance == null)
        {
            this.instance = new LoaderManager();
        }
        return this.instance;
    }
    //--------------------------resources-----------------------------
    //resources加载数组
    loadArr(paths: Array<string>, callFun: Function) {
        cc.resources.load(paths, (err, assets)=>{
            if (err) {
                cc.log(err);
                return;
            }
            if(callFun){
                callFun(assets);
            }
        });
    }
    //resources加载音效
    loadAudio(path:string ,callFun:Function){
        cc.resources.load(path,cc.AudioClip,(err, clip) => {
            if (err) {
                cc.log(err);
                return;
            }
            if(callFun){
                callFun(clip);
            }
        })
    }
    //资源加载预制体
    loadViewPrefab(url: string) {
        if (!url ) {
            cc.log("参数错误", url);
            return;
        }
        return new Promise((resolve, reject) => {
            cc.resources.load(url, cc.Prefab, (err, asset) => {
                if (err) {
                    cc.log(`[资源预制体加载] 错误 ${err}`);
                    return;
                }
                resolve(asset);
            });
        });
    }
    //删除预制体View
    releaseViewPrefab(prefab:cc.Prefab) {
        if (!prefab ) {
            cc.log("参数错误", prefab);
            return;
        }
        this.releaseAsset(prefab)
    }

    //删除资源
    releaseAsset(Asset){
        cc.assetManager.releaseAsset(Asset)
    }
    //加载纹理
    loadTexure(path,callFun?:Function){
        cc.resources.load(path,cc.Texture2D,(err, texture) => {
            if (err) {
                cc.log(err);
                return;
            }
            if(callFun){
                callFun(texture);
            }
        })
    }
    //加载预制体
    loadPrefab(path,callFun?:Function){
        cc.resources.load(path,cc.Prefab,(err, prefab) => {
            if (err) {
                cc.log(err);
                return;
            }
            if(callFun){
                callFun(prefab);
            }
        })
    }

    loadHttpTexure(path,callFun?:Function){
        cc.assetManager.loadRemote(path,cc.Texture2D,(err, texture) =>{
                if (err) {
                    cc.log(err);
                    return;
                }
                if(callFun){
                    callFun(texture);
                }
        });
    }
    //预加载网络纹理
    preloadHttpTexure(path,callFun?:Function){
        cc.assetManager.loadRemote(path,cc.Texture2D,(err, texture) =>{
            if (err) {
                this.preloadHttpTexure(path,callFun)
                return;
            }
            if(callFun){
                callFun();
            }
    });
    }
    removeHttpTexure(path,callFun?:Function){
        //缓存管理器是一个模块，在非 WEB 平台上，用于管理所有从服务器上下载下来的缓存，这是一个单例，
        //所有成员能通过 `cc.assetManager.cacheManager` 访问。 */
        if(cc.sys.isBrowser){
            return;
        }
        cc.assetManager.loadRemote(path,cc.Texture2D, function (err, texture) {
            if (err) {
                cc.log(err);
                return;
            }
            cc.assetManager.cacheManager.removeCache(texture.nativeUrl);
            if(callFun){
                callFun();
            }
            
        });
    }
}