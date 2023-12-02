import AsReq from "../AsReq";
import GroupVo from "./vo/GroupVo";
import MemberVo from "./vo/MemberVo";
import TreeVo from "./vo/TreeVo";

export default class GroupModel {

    private static instance: GroupModel;
    public static getIns(): GroupModel {
        if (!this.instance) {
            this.instance = new GroupModel();
        }
        return this.instance;
    }

    private groupArr: GroupVo[] = [];

    private _treeArr:TreeVo[] = [];

    public async getGroup() {
        let res: any = await AsReq.groupsGet();
        if (res) {
            this.groupArr = [];
            for (const data of res) {
                let gp = new GroupVo(data);
                this.groupArr.push(gp);
            }
            this._treeArr = [];
            for (const group of this.groupArr) {
                this._treeArr.push(new TreeVo(group));
            }
        }
        return Promise.resolve();
    }

    public getGroupById(id:string):GroupVo
    {
        for (const group of this.groupArr) {
            if(group.id == id)
            {
                return group;
            }
        }
        return null;
    }

    


    public saveSelect(group: GroupVo,nowMemberArr:MemberVo[]){
        if(group == null)return;
        let groupVo = this.getGroupByVo(group);
        if (groupVo) {
            for (const mem of groupVo?.memberArr) {
                for (const nowmem of nowMemberArr) {
                    if(mem.id == nowmem.id)
                    {
                        mem.memberSelect = nowmem.memberSelect;
                    }
                }
            }
        }
    }

    public getMemberArrByGroup(group: GroupVo) {
        let groupVo = this.getGroupByVo(group);
        if (groupVo) {
            let arr = [];
            for (const mem of groupVo?.memberArr) {
                arr.push(mem.clone());
            }
            return arr;
        }
        return [];
    }

    public getMemberArr(groupArr: GroupVo[]) {
        for (const vo of groupArr) {
            if (vo.isSelect) {
                let groupVo = this.getGroupByVo(vo);
                if (groupVo) {
                    let arr = [];
                    for (const mem of groupVo?.memberArr) {
                        arr.push(mem.clone());
                    }
                    return arr;
                }
                break;
            }
        }
        return [];
    }

    public getGroupArrData(index:number=0) {
        let arr = [];
        for (const vo of this.groupArr) {
            arr.push(vo.cloneSimple());
        }
        if(arr.length > 0)
        arr[index].isSelect = true;
        return arr;
    }

    private getGroupByVo(vo: GroupVo):GroupVo {
        for (const data of this.groupArr) {
            if (data.id == vo.id) {
                return data;
            }
        }
        return null;
    }

    public getNameByRtsp(phone: string): string {
        for (const gp of this.groupArr) {
            for (const mem of gp.memberArr) {
                if (mem.phone == phone) {
                    return mem.name;
                }
            }
        }
        return "";
    }
    public getJoinMeetArr(group:GroupVo){
        let groupVo = this.getGroupByVo(group);
        let joinMeetArr:any[] = [];
        for (const gp of this.groupArr) {
            if(groupVo&&gp == groupVo)continue;
            for (const mem of gp.memberArr) {
                if(mem.memberSelect)
				joinMeetArr.push(mem.clone());
            }
        }
        return joinMeetArr;
       
    }
    public clearAllSelect(){
        for (const gp of this.groupArr) {
            for (const mem of gp.memberArr) {
                mem.memberSelect = false;
            }
        }
    }

    public getTreeArr(){
        return this._treeArr;
    }

    public getGroupArr(){
        return this.groupArr;
    }

    public getMemberById(parentId:string,id:string ):MemberVo{
        for (const group of this.groupArr) {
            if(group.id = parentId)
            {
                for (const mem of group.memberArr) {
                    if(mem.id == id)
                    {
                        return mem;
                    }
                }
                break;
            }
        }
        return null;
    }

}