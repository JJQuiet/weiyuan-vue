import { ElMessageBox, ElMessage } from 'element-plus';

export default class AlertTool {

    public static async alertDel(content:string){
        return new Promise((resolve)=>{
            ElMessageBox.confirm(content, '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

}