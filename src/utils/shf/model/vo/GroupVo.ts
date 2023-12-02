import MemberVo from "./MemberVo";

export default class GroupVo {
    public createTime:string;
    public groupName:string;
    public id:string;
    public memberJson:string;
    public updateTime:string;
    public memberArr:MemberVo[] = [];
    public isSelect = false;
    constructor(obj:any){
        if(obj)
        {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                   (this as any)[key] = obj[key]; 
                }
            }
            let marr = JSON.parse(this.memberJson);
    
            for (const mem of marr) {
                let vo = new MemberVo(mem);
                this.memberArr.push(vo);
            }
        }
    }
    cloneSimple(){
        let vo = new GroupVo(null);
        vo.groupName = this.groupName;
        vo.id = this.id;
        return vo;
    }

}