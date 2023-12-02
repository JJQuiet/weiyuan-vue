export default class HostVo {

    public host:string;
    public hostid:string;
    public name:string;

    public constructor(obj:any){
        this.host = obj.host;
        this.hostid = obj.hostid;
        this.name = obj.name;
    }

}