export default class MemberVo {
    public id:string;
    public name:string;
    public phone:string;

    public memberSelect:boolean = false;

    public dialSelect = false;

    public isIdle = true;


    constructor(obj:any){
        if(obj)
        {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                   (this as any)[key] = obj[key]; 
                }
            }
        }
    }
    public clone(){
        let vo = new MemberVo(null);
        vo.id = this.id;
        vo.name = this.name;
        vo.phone = this.phone;
        vo.memberSelect = this.memberSelect;
        return vo;
    }

}