import ReqUtils from "./ReqUtils";

export default class WarnReq {

    public static async planAdd(addrId: string, sourceValue: string, nameValue: string,contentValue:string) {
        return ReqUtils.GET("plan/add", {addrId,sourceValue,nameValue,contentValue});
    }
    public static async planDel(id: string) {
        return ReqUtils.GET("plan/del", { id });
    }
    public static async planList() {
        return ReqUtils.GET("plan/list");
    }
    public static async planEdit(id: string, addrId: string, sourceValue: string, nameValue: string,contentValue:string) {
        return ReqUtils.GET("plan/edit", { id, addrId, sourceValue, nameValue,contentValue });
    }

    public static async msgSend(phoneArr:string[],msgContent:string){
        return ReqUtils.POST("msg/send", { phoneArr,msgContent });
    }

    public static async groupAdd(groupName: string, memberJson: string, groupMsg: string) {
        return ReqUtils.GET("group/add", { groupMsg, groupName, memberJson });
    }
    public static async groupDel(id: string) {
        return ReqUtils.GET("group/del", { id });
    }
    public static async groupList() {
        return ReqUtils.GET("group/list");
    }
    public static async groupEdit(id: string, groupName: string, memberJson: string, groupMsg: string) {
        return ReqUtils.GET("group/edit", { id, groupMsg, groupName, memberJson });
    }
    public static async pingAdd(equipIp: string,
        equipName: string,
        sendMsg: boolean,
        warnGroupId: string,
        warnGroupName: string) {
        return ReqUtils.GET("ping/add", { equipIp, equipName, sendMsg, warnGroupId, warnGroupName });
    }
    public static async pingDel(id: string) {
        return ReqUtils.GET("ping/del", { id });
    }
    public static async pingList() {
        return ReqUtils.GET("ping/list");
    }
    public static async pingEdit(id: string, equipIp: string,
        equipName: string,
        sendMsg: boolean,
        warnGroupId: string,
        warnGroupName: string) {
        return ReqUtils.GET("ping/edit", { equipIp, equipName, sendMsg, warnGroupId, warnGroupName, id });
    }
}