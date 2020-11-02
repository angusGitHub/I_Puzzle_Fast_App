
import { LoaderManager } from "../../core/Loader/LoaderManager";
import Block from "./Block";


export default class FightPoolManger {
    private static instance: FightPoolManger = null;
    public static getInstance(): FightPoolManger {
		if (FightPoolManger.instance == null) {
			FightPoolManger.instance = new FightPoolManger();
		}
		return FightPoolManger.instance;
    }

    public static PATH_FIGHT = "prefabs/fight/"; //地址
    public static PATH_Block = "Block"; //答案方块
    
    
    BlockPool:cc.NodePool = null;;
    
    prefabTable: {[key: string]: cc.Prefab} = cc.js.createMap();;//所有预制体的集合

    prefabCallBack:Function = null; //回调
    constructor(){
        this.BlockPool = new cc.NodePool();
    }
    loadResPrefabArr(prefabCallBack){
        this.prefabCallBack = prefabCallBack;
        let arr = [
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_Block, 
        ];
        LoaderManager.getInstance().loadArr(arr,this.loaderPreScuess.bind(this))
    }
    loaderPreScuess(assets:cc.Prefab[]){
        this.prefabTable = {};
        for (let index = 0; index < assets.length; index++) {
            const prefabItem = assets[index];
            let path = prefabItem.name;
            this.prefabTable[path] = prefabItem;
        }
        if(assets.length == undefined){
            let asset:any  = assets;
            this.prefabTable[asset.name] = asset;
        }
        this.initPool()
    }
    initPool(){
        for(let i = 0;i < 16; i++){
            let pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_Block]);
            this.BlockPool.put(pool);
        } 
        if(this.prefabCallBack){
            this.prefabCallBack()
        }
    }
    putBlock(node:cc.Node) {
        node.parent = null;
        this.BlockPool.put(node);
    }
    createBlock(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj =  this.BlockPool.get();
        if (obj == null) {
            if (!this.prefabTable[FightPoolManger.PATH_Block]) return null;
            let prefab = this.prefabTable[FightPoolManger.PATH_Block];
            obj = cc.instantiate(prefab);
        }
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(Block) as Block;
        jsObj.init(data);
        return jsObj;
        // return jsItemBlock;
    }

   

    
}