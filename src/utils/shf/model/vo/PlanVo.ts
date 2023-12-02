import GroupModel from "../GroupModel";

export default class PlanVo {
    public id: string;
    /**
     * addr id
     */
    public addrId: string;
    /**
     * source_value
     */
    public sourceValue: string;
    public nameValue: string;
    public contentValue: string;

    public addrName:string = "";


    constructor(obj: any) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const element = obj[key];
                (this as any)[key] = element;
                
            }
        }

        let group = GroupModel.getIns().getGroupById(this.addrId);
        if(group)
        {
            this.addrName = group.groupName;
        }
    }

}