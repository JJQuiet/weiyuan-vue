export default class ShfReqUtil {
    public static reqUrl = "";

    public static add(name:string,addr:string,lng:number,lat:number){
        return this.GET("camera/add",{name,addr,lng,lat});
    }
    public static edit(id:string,name:string,addr:string){
        return this.GET("camera/edit",{name,addr,id});
    }
    public static del(id:string){
        return this.GET("camera/del",{id});
    }
    public static list()
    {
        return this.GET("camera/list");
    }
    public static findAllByName(cameraName:string){
        return this.GET("camera/findAllByName",{cameraName})
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
        if(!ShfReqUtil.reqUrl)
        ShfReqUtil.reqUrl = (window as any)["reqUrl"];
        if (nowUrl == "")
            nowUrl = ShfReqUtil.reqUrl + "/" + api;

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
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
    public static async GET(api: string, params: any = {}, nowUrl: string = "") {
        return new Promise((resolve) => {
            if(!ShfReqUtil.reqUrl)
            ShfReqUtil.reqUrl = (window as any)["reqUrl"];
            if (nowUrl == "")
                nowUrl = ShfReqUtil.reqUrl + "/" + api;

            if (params) {
                let paramsArray:any[] = [];
                //拼接参数
                Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))

                if (paramsArray.length > 0)
                    nowUrl += ('?' + paramsArray.join('&'));
            }
            //fetch请求
            fetch(nowUrl, {
                method: 'GET',
            })
                .then((response) => response.text())
                .then((text) => {
                    this.dealData(text,resolve);
                    // console.log("戴假发"+JSON.stringify(json));
                    // this.setState({ discounts: json.data })
                })
                .catch((error) => {
                    // alert(error)
                    console.error("请求服务器失败：" + api);
                    resolve(null);
                })
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
                resolve(null);
                return;
            }
        }
    }
}