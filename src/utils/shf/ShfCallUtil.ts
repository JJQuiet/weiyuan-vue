import { ElMessage } from "element-plus";

export default class ShfCallUtil {
    public static reqUrl = "";
    public static call(caller:string,phone:string){
        return this.POST("",{type:"call", phone, caller})
    }

    /**
     * POST请求
     *
     * @static
     * @param {*} url
     * @param {object} [param={}]
     * @param {*} callback
     * @memberof HttpUtil
     */
    public static async POST(api: string,param: object = {},nowUrl: string = "") {
        if(!ShfCallUtil.reqUrl)
        ShfCallUtil.reqUrl = (window as any)["callReqUrl"];

        if (nowUrl == "" && api)
            nowUrl = ShfCallUtil.reqUrl + "/" + api;
        else
            nowUrl = ShfCallUtil.reqUrl;

        console.log("httputil post "+JSON.stringify(param))
        return new Promise((resolve) => {
            var xhr = new XMLHttpRequest();
            let dataStr = JSON.stringify(param);
            // Object.keys(param).forEach(key => {
            //     dataStr += key + '=' + encodeURIComponent(param[key]) + '&';
            // })
            // if (dataStr !== '') {
            //     dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
            // }
            xhr.open("POST", nowUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            // xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange =  ()=> {
                if (xhr.readyState === 4) {
                    let response = xhr.responseText;
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // let httpStatus = xhr.statusText;
                        // callback(true, JSON.parse(response));
                        this.dealData(response,resolve);
                    }
                    else
                    {

                        resolve(null);
                    }
                }
            };
            xhr.send(dataStr);
        });
    }
private static dealData(response:any,resolve:any){
        let jsonObj: any = null;
        try {
            jsonObj = JSON.parse(response);
        } catch (error) {

        }
        if (response) {
            if (jsonObj) {
                resolve(jsonObj);
                return;
            }
            if (typeof response == 'string') {
                if (response == 'success' ) {
                    resolve(response);
                    return;
                }
                ElMessage({
					type: 'error',
					message: response
				})
                resolve(null);
                return;
            }
        }
    }
}