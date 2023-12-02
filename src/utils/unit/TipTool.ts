import { ElMessageBox, ElMessage } from 'element-plus';
export default class TipTool {
    constructor(){
    }
    public static tipError(err:string){
        ElMessage.error(err);
    }

}