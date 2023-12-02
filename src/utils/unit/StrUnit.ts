export default class StrUnit {

    public static getNumber(str:string):string{
        str = str+"";
        if(!str)
        return "";
        var numArr = str.match(/\d+/g);
        if(!numArr)
        return "";
        return numArr.join("");
    }
    public static getUUID():string{
            return Math.random().toString(16).slice(2);  
    }

    public static isNum(str:string){
        let isnum = /^\d+$/.test(str);
        return isnum;
    }
}