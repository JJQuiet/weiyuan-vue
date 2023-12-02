import GroupVo from "./GroupVo";

export default class TreeVo {
    public id:string;
    public memberArr:TreeVo[] = [];
    public name:string;
    public isLeaf:boolean = false;

    public parentId:string = "";

    constructor(vo:any){
       if(vo != null)
       {
            this.id = vo.id;
            this.name = vo.groupName;
            this.parentId = this.id;
            
            for (const member of vo.memberArr) {
                let vo = new TreeVo(null);
                vo.id = member.id;
                vo.name = member.name+"："+member.phone;
                vo.isLeaf = true;
                vo.parentId = this.id;
                this.memberArr.push(vo);
            }
       }
    }

}