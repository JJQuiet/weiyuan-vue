export default class CameraSearchVo {
    
    public value = "";
    public label = "";
    public id = "";
    public latVal = "";
    public lngVal = "";

    public constructor(obj:any){
        this.value = obj.id;
        this.label = obj.cameraName;
        this.latVal = obj.latVal;
        this.lngVal = obj.lngVal;
        this.id = obj.id;
    }

}