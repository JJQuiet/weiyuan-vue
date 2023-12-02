import ReqUtils from "./ReqUtils";
import MemberJsonVo from "./model/vo/MemberJsonVo";

export default class AsReq {
    private static asReqUrl = "";
    public static init(){
        this.asReqUrl = (window as any)["asReqUrl"];
    }

    public static groupsGet(){
        return this.req({ type:'groups'});
    }

    public static async editGroup(name:string,id:string){
        return this.req({ type: 'group/edit', name,id});
     }
     public static async delGroup(id:string){
         return this.req({type:'group/del',id});
     }
     public static async addGroup(name:string){
         return this.req({ type: 'group/add', name, members: JSON.stringify([]) });
     }

     public static async addMember(id:string,membersArr:any[],addmember:any){
        let members:any[] = [];
        for (const mem of membersArr) {
            let vo = new MemberJsonVo(mem);
            members.push(vo);
        }
        members.push(new MemberJsonVo(addmember));
        let data = { type: 'member/update', id,memberJson: JSON.stringify(members) };
        return this.req(data);
    }
    public static async editMember(id:string,membersArr:any[],name:string,phone:string,memberId:string){
        let members:any[] = [];
        for (const mem of membersArr) {
            let vo = new MemberJsonVo(mem);
            if(mem.id == memberId)
            {
                vo.name = name;
                vo.phone = phone;
            }
            members.push(vo);
        }
        let data = { type: 'member/update', id,memberJson: JSON.stringify(members) };
        return this.req(data);
    }
    public static async delMember(id:string,membersArr:any[],memberId:string){
        let members:any[] = [];
        for (const mem of membersArr) {
            if(mem.id == memberId)
            {
                continue;
            }
            let vo = new MemberJsonVo(mem);
            members.push(vo);
        }
        let data = { type: 'member/update',id,memberJson: JSON.stringify(members) };
        return this.req(data);
    }

    public static req(param: object = {},api: string = "any"){
        return ReqUtils.POST(api,param,this.asReqUrl);
    }

}