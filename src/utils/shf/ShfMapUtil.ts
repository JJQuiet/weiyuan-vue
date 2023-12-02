export default class ShfMapUtil {
  private static chart: any;
  private static pointArr: any[];
  private static map: any;
  private static state: any;

  private static isClickMap = false;

  private static currentPnt: any[] = [];

  private static demoThat: any;

  private static editCamera = (that: any) => { };
  private static clickCamera = (that: any) => { };


  private static currentId = "";

  private static centerPnt: any = null;


  public static init(map: any, centerPnt: any, chart: any, pointArr: any, state: any, demoThat: any, editCamera: (that: any) => void, clickCamera: (that: any) => void) {
    this.demoThat = demoThat;
    this.centerPnt = centerPnt;
    this.editCamera = editCamera;
    this.clickCamera = clickCamera;
    this.chart = chart;
    this.pointArr = pointArr;
    this.state = state;
    //地图右击
    this.map = map;

    this.initClickEvent();
    this.initChartEvent();
  }

  public static initClickEvent() {
    this.map.addEventListener('click', (e: any) => {
      console.log("click3....................");
      if (this.isClickMap) {
        this.isClickMap = false;
        return;
      }
      console.log("click4....................");
      this.currentPnt = [e.point.lng, e.point.lat];
      this.state.dialogTitle = "添加监控";
      this.state.dialogVisible = true;
      this.state.addrInp = "";
      this.state.nameInp = "";

    });

  }

  public static hide(){
    this.chart.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: '指挥车',
          data:[]
        }
      ]
    });
  }
  public static display(){
    this.chart.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: '指挥车',
          data: this.pointArr
        }
      ]
    });
  }

  public static centerToZoom(lng: string, lat: string) {

    this.centerPnt.lng = lng;
    this.centerPnt.lat = lat;
    this.map.centerAndZoom(this.centerPnt, (window as any)["mapMaxZoom"]);
  }

  public static initChartEvent() {
    this.chart.getZr().on('mouseup', (e: any) => {
      console.log('mouseup1........................');
      // editDialogShowByLoc(e.offsetX, e.offsetY);
      //  this.state.dialogVisible = true;
    });
    this.chart.on('click', (e: any) => {
      console.log("map click2 ............");
      console.log("e.data.pointId = " + e.data.pointId);
      this.currentId = e.data.pointId;
      this.clickCamera(this.demoThat);
      this.isClickMap = true;

    });
    this.chart.on('contextmenu', (e: any) => {
      console.log("rightclick ............");
      console.log("e.data.pointId = " + e.data.pointId);
      this.currentId = e.data.pointId;
      this.editCamera(this.demoThat);
    });
  }
  public static delPoint(pointId: string) {
    let i = 0;
    for (const vo of this.pointArr) {
      if (vo.pointId == pointId) {
        this.pointArr.splice(i,1);
        continue;
      }
      i++;
    }
    this.chart.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: '指挥车',
          data: this.pointArr
        }
      ]
    });
  }
  public static editPoint(pointId: string, cameraName: string) {
    for (const vo of this.pointArr) {
      if (vo.pointId == pointId) {
        vo.name = cameraName;
        continue;
      }
    }
    this.chart.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: '指挥车',
          data: this.pointArr
        }
      ]
    });

  }
  public static addPoint(lng: string, lat: string, pointId: string, cameraName: string, addr: string) {
    //加图片
    this.pointArr.push({
      name: cameraName,
      value: [lng, lat],
      pointId: pointId,
      addr
    });
    this.chart.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: '指挥车',
          data: this.pointArr
        }
      ]
    });
  }
  public static getCurrnetPnt() {
    return this.currentPnt;
  }
  public static getCurrentId() {
    return this.currentId;
  }

}