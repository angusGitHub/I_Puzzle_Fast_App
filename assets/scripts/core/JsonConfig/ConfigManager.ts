import ConfigLevels from "../JsonConfig/ConfigLevels";
import { LoaderManager } from "../Loader/LoaderManager";



export  class ConfigManager{
    private static instance: ConfigManager;
    public static getInstance(): ConfigManager
    {
        if(this.instance == null)
        {
            this.instance = new ConfigManager();
        }
        return this.instance;
    }
    sd_path:string = "json/"
    sd_path_levels: string = "levels";  //成语数据
   
    config_levels : ConfigLevels = null;
    
    callback:Function = null;

    public loadAllConfig(callback?: Function): void {
        this.callback = callback;
        let arrPath = [
                this.sd_path + this.sd_path_levels,
            ]
        LoaderManager.getInstance().loadArr(arrPath,this.onLoaded.bind(this))
    }
    public onLoaded(assets:cc.JsonAsset[])
    {
        this.config_levels = new ConfigLevels();
        for (let index = 0; index < assets.length; index++) {
            const json = assets[index];
            if(json.name == this.sd_path_levels){
                this.config_levels.load(json)
            }
        }
        if(assets.length == undefined){
            let asset:any  = assets;
            this.config_levels.load(asset)
        }
        cc.log("===this.config_levels==",this.config_levels.map)
        if (this.callback) {
            this.callback();
        }
    }
}
