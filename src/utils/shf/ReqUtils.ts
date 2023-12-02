
export default class ReqUtils {
    public static reqUrl = "";
    public static async getHosts(){
        return this.GET("getHosts");
    }
    // public static getHostCPU(){
    //     this.POST("/index.php?history.php%3Faction%3Dshowgraph%26itemids%255B0%255D%3D43504",
    //     {name:"Admin",password:"zabbix",autologin:1,enter:"登录"});
    // }
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
        if(!ReqUtils.reqUrl)
        ReqUtils.reqUrl = (window as any)["reqUrl"];
        if (nowUrl == "")
            nowUrl = ReqUtils.reqUrl + "/" + api;
        else
            nowUrl = nowUrl +"/"+api;

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
            // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Content-Type", "application/json");
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
            if(!ReqUtils.reqUrl)
            ReqUtils.reqUrl = (window as any)["reqUrl"];
            if (nowUrl == "")
                nowUrl = ReqUtils.reqUrl + "/" + api;

            if (params) {
                let paramsArray:any[] = [];
                //拼接参数
                Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])))

                if (paramsArray.length > 0)
                    nowUrl += ('?' +paramsArray.join('&'));
            }

            var xhr = new XMLHttpRequest();
            // Object.keys(param).forEach(key => {
            //     dataStr += key + '=' + encodeURIComponent(param[key]) + '&';
            // })
            // if (dataStr !== '') {
            //     dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
            // }
            xhr.open("GET", nowUrl);
            // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
            xhr.send();
            //fetch请求
            // fetch(nowUrl, {
            //     method: 'GET',
            // })
            //     .then((response) => response.text())
            //     .then((text) => {
            //         this.dealData(text,resolve);
            //         // console.log("戴假发"+JSON.stringify(json));
            //         // this.setState({ discounts: json.data })
            //     })
            //     .catch((error) => {
            //         // alert(error)
            //         console.error("请求服务器失败：" + api);
            //         resolve(null);
            //     })
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