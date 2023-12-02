export default class CameraVo {
    public cameraAddr = "";
    public cameraName = "";
    public latVal = "";
    public lngVal = "";
    public id = "";

    public init(obj:any){
        this.cameraAddr = obj.cameraAddr;
        this.cameraName = obj.cameraName;
        this.latVal = obj.latVal;
        this.lngVal = obj.lngVal;
        this.id = obj.id;
        return this;
    }


}