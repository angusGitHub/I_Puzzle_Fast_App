export class ConfigItemRiceData{
    level:number = 0;
    richNum:number = 0;
}
export default class ConfigRiceData {
        constructor() {}
        datas: ConfigItemRiceData[] = [];
        map : Map<number,ConfigItemRiceData> = null;
        load(jsonData:cc.JsonAsset){
            let json: Array<JSON> = jsonData.json;
            this.map = new Map<number,ConfigItemRiceData>();
            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                let data = new ConfigItemRiceData();
                data.level = element["level"];
                data.richNum = element["richNum"];
                this.datas.push(data);
                this.map.set(index + 1,data);
            }
        }
        getData(id : number) {
            return this.map.get(id);
        }
}

