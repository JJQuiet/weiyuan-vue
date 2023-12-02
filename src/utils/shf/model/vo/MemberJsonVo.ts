export default class MemberJsonVo {
    public name:string;
    public phone:string;
    public id:string;
    public constructor(obj:any){
        this.name = obj.name;
        this.phone = obj.phone;
        this.id = obj.id;
    }
}