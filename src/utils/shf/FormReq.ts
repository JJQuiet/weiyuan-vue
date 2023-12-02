export default class FormReq {
    private static isInit = false;

    public static addForm() {
        if(this.isInit)return;
        this.isInit = true;
        var form = document.createElement("form");
        form.name = "postform";
        form.method = "POST";

        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "name";
        form.appendChild(input);

        var input1 = document.createElement("input");
        input1.type = "hidden";
        input1.name = "password";
        form.appendChild(input1);

        var input2 = document.createElement("input");
        input2.type = "hidden";
        input2.name = "autologin";
        form.appendChild(input2);

        var input3 = document.createElement("input");
        input3.type = "hidden";
        input3.name = "enter";
        form.appendChild(input3);

        document.body.appendChild(form);
    }
    public static post() {
        var form1:any = document.getElementsByName("postform")[0];
        var input1:any = document.getElementsByName("name")[0];
        var input2:any = document.getElementsByName("password")[0];
        var input3:any = document.getElementsByName("autologin")[0];
        var input4:any = document.getElementsByName("enter")[0];
        input1.value = "Admin";
        input2.value = "zabbix";
        input3.value = "1";
        input4.value = "登录";
        form1.action = 'http://192.168.0.111/index.php?request=history.php%3Faction%3Dshowgraph%26itemids%255B0%255D%3D43504';
        form1.submit();
        
    }

}