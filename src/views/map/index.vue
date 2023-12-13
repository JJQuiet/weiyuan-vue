<template>
	<div class="visualizing-demo1 flex-grow relative flex" style="height: 100%; width: 100%">
		<div class="absolute inset-0">
			<!-- 地图 -->
			<div id="visualizingDemo1" class="w-full h-full"></div>
			<div class="visualizing-container">
				<!-- 头部 -->
				<div class="visualizing-container-head">
					<div class="visualizing-container-head-left">
						<div class="visualizing-container-head-left-text">
							<div class="visualizing-container-head-left-text-box">{{ time.txt }}</div>
						</div>
					</div>
					<div class="visualizing-container-head-center">
						<div class="visualizing-container-head-center-box">
							<div class="visualizing-container-head-center-maintitle">GNSS定位</div>
							<div class="visualizing-container-head-center-subtitle">GPS&BDS</div>
						</div>
					</div>
					<div class="visualizing-container-head-right">
						<div class="flex flex-row-reverse justify-between">
							<div class="selectClass flex flex-col w-60">
								<div class="h-2"></div>
								<el-select
									v-model="searchVal"
									filterable
									clearable
									remote
									reserve-keyword
									placeholder="请输入监控名称"
									:remote-method="remoteSearch"
									:loading="searchLoading"
									@change="remoteChange"
								>
									<el-option v-for="item in searchOptArr" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</div>
							<el-image
								v-if="isDisplayIcon"
								class="ml-16"
								style="width: 40px"
								src="/static/images/display.png"
								:fit="contain"
								@click="tapDisplay(false)"
							/>
							<el-image
								v-if="!isDisplayIcon"
								class="ml-16"
								style="width: 40px"
								src="/static/images/hidedisplay.png"
								:fit="contain"
								@click="tapDisplay(true)"
							/>
							<!--  -->
						</div>
					</div>
				</div>

				<!-- 图表左侧 -->
				<!--
				<div class="visualizing-container-content-left">
					<div class="visualizing-container-content-left-flex">
						<div class="visualizing-container-title">
							<i class="el-icon-s-shop"></i>
							<span>重要经济目标热力图</span>
						</div>
						<hr class="visualizing-container-title-colorful" />
						<div ref="visualizingContentLeftTop" style="height: 100%"></div>
					</div>
					
					<div class="visualizing-container-content-left-flex">
						<div class="visualizing-container-title">
							<i class="el-icon-s-promotion"></i>
							<span>疏散要素统计(金牛区)</span>
						</div>
						<hr class="visualizing-container-title-colorful" />
						<div ref="visualizingContentLeftBottom" style="height: 100%"></div>
					</div>
				</div>
				-->

				<!-- 图表中间 -->
				<!--
				<div class="visualizing-container-content-center">
					<div class="visualizing-container-content-center-bottom">
						<div class="visualizing-container-content-center-bottom-flex">
							<div class="visualizing-container-title">
								<i class="el-icon-s-custom"></i>
								<span>档案归档累计</span>
							</div>
							<hr class="visualizing-container-title-colorful" />
							<div ref="visualizingContentCenterTop" style="height: 100%"></div>
						</div>
						<div class="visualizing-container-content-center-bottom-flex">
							<div class="visualizing-container-title">
								<i class="el-icon-s-flag"></i>
								<span>物资采购统计</span>
							</div>
							<hr class="visualizing-container-title-colorful" />
							<div ref="visualizingContentCenterBottom" style="height: 100%"></div>
						</div>
					</div>
				</div>
				-->

				<!-- 图表右侧 -->
				<!--
				<div class="visualizing-container-content-right">
					<div class="visualizing-container-content-right-flex">
						<div class="visualizing-container-title">
							<i class="el-icon-s-marketing"></i>
							<span>经济目标增长分析</span>
						</div>
						<hr class="visualizing-container-title-colorful" />
						<div ref="visualizingContentRightTop" style="height: 100%"></div>
					</div>
					<div class="visualizing-container-content-right-flex">
						<div class="visualizing-container-title">
							<i class="el-icon-s-data"></i>
							<span>疏散人数统计分析</span>
						</div>
						<hr class="visualizing-container-title-colorful" />
						<div ref="visualizingContentRightBottom" style="height: 100%"></div>
					</div>
				</div>
				-->
			</div>
			<el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
				<el-input v-model="nameInp" placeholder="请输入监控名称" />
				<el-input v-model="addrInp" placeholder="请输入监控地址" />
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogVisible = false">取消</el-button>
						<el-button v-if="dialogTitle == '修改监控'" type="warning" @click="onTapDelBtn"> 删除 </el-button>
						<el-button type="primary" @click="onTapTrueBtn"> 确认 </el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog v-model="videoVisible" :title="videoTitle" width="30%" @close="closeVideo">
				<!-- <HttpFlvPlayer v-if="flvurl" ref="videoPlay" :src="flvurl" /> -->
				<div class="photo-list" v-if="photos.length" v-for="photo in photos" :key="photo.id">
					<div class="photo-container">
						<!-- <div class="timestamp">{{ photo.photoName }}</div> -->
						<div class="timestamp">{{ formatPhotoName(photo.photoName) }}</div>
						<img
							class="photo"
							:class="{ enlarged: enlargedPhotoId === photo.id }"
							:src="photo.photoPath"
							:alt="photo.photoName"
							@click="toggleEnlarge(photo.id)"
						/>
						<div class="description">{{ photo.photoDescription }}</div>
					</div>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="videoVisible = false">取消</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script lang="ts">
import HttpFlvPlayer from '/@/components/httpFlvPlayer/index.vue';
import { toRefs, ref, reactive, onMounted, onUnmounted, getCurrentInstance, defineComponent } from 'vue';
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import { formatDate } from '/@/utils/formatTime';
import { echartsMapList, echartsMapData, echartsMapImgs } from './mock/demo1';

import { ElMessage, ElMessageBox, ElForm } from 'element-plus';
import coordtransform from 'coordtransform';
import ShfMapUtil from '/@/utils/shf/ShfMapUtil';
import ShfReqUtil from '/@/utils/shf/ShfReqUtil';
import { stat } from 'fs';
import CameraVo from '/@/utils/shf/vo/CameraVo';
import CameraSearchVo from '/@/utils/shf/vo/CameraSearchVo';
import ShfCallUtil from '/@/utils/shf/ShfCallUtil';

////import { initWebsocket } from '/@/request/http';

export default defineComponent({
	name: 'visualizingLinkDemo1',
	components: { HttpFlvPlayer },
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			isDisplayIcon: true,
			displayPhone: '',
			searchOptArr: [],
			searchVal: '',
			searchLoading: false,
			flvurl: '',
			videoTitle: '监控：XXXX',
			videoVisible: false,
			dialogTitle: '',
			nameInp: '',
			addrInp: '',
			dialogVisible: false,
			echartsMapList,
			echartsMapData,
			echartsMapImgs,
			time: {
				txt: '',
				fun: 0,
			},
			gnss: {
				jiekou: 0,
				tianxian: 0,
				shuju: -1,
				jingdu: '',
				weidu: '',
				haiba: '',
				sudu: '',
				fangxiang: '',
				shifenmiao: '',
				riyuenian: '',
			},
			myCharts: [],
			/////////////////集结点.etc//////////////
			zhihuiChe: [],
			luxianData: [],
			luxianDian: [],

			ssysOptions: ['集结点', '疏散路线', '疏散地域', '隐蔽地域', '保障点', '经济目标'],
			pagedata: {
				currentPage: 1,
				pageCount: 1000,
			},
			getTblData: {},
			pageType: '',
			jjmbReli: [
				[0, 0, 0],
				[1, 0, 0],
				[2, 0, 0],
				[0, 1, 0],
				[1, 1, 0],
				[2, 1, 0],
				[0, 2, 0],
				[1, 2, 0],
				[2, 2, 0],
				[0, 3, 0],
				[1, 3, 0],
				[2, 3, 0],
				[0, 4, 0],
				[1, 4, 0],
				[2, 4, 0],
				[0, 5, 0],
				[1, 5, 0],
				[2, 5, 0],
				[0, 6, 0],
				[1, 6, 0],
				[2, 6, 0],
				[0, 7, 0],
				[1, 7, 0],
				[2, 7, 0],
			],
			ssysCnt: [1, 2, 3, 4, 5],
			enlargedPhotoId: null,
		});
		const mapCameraMap: any = {};
		const closeVideo = () => {
			state.flvurl = '';
		};
		const testlist: any[] = [
			{ value: 'Alabama', label: 'Alabama' },
			{ value: 'Arizona', label: 'Arizona' },
		];
		const remoteSearch = async (query: string) => {
			if (query) {
				state.searchLoading = true;
				let res: any = await ShfReqUtil.findAllByName(query);
				if (res) {
					let arr = [];
					for (const data of res) {
						arr.push(new CameraSearchVo(data));
					}
					(state.searchOptArr as any) = arr;
				}
				state.searchLoading = false;
			} else {
				state.searchOptArr = [];
			}
		};
		const remoteChange = async (e: any) => {
			let searchVal = state.searchVal;
			if (!searchVal) return;
			for (const opt of state.searchOptArr) {
				if (searchVal == (opt as any).id) {
					let lngVal: any = (opt as any).lngVal;
					let latVal: any = (opt as any).latVal;
					ShfMapUtil.centerToZoom(lngVal, latVal);
					break;
				}
			}
		};
		const tapDisplay = async (value: boolean) => {
			state.isDisplayIcon = value;
			if (value == false) {
				ShfMapUtil.hide();
			} else {
				ShfMapUtil.display();
			}
		};
		const onTapCallPhone = async () => {
			let phone = state.displayPhone;
			let caller = (window as any)['handCaller'];
			let call = await ShfCallUtil.call(caller, phone);
			if (call) {
				ElMessage({
					type: 'info',
					message: '呼叫已发送',
				});
			}
		};
		const onTapDelBtn = async () => {
			let currentPnt = ShfMapUtil.getCurrnetPnt();
			if (state.dialogTitle == '添加监控' && currentPnt.length <= 1) return;
			let id = ShfMapUtil.getCurrentId();
			let item: any = await ShfReqUtil.del(id);

			ShfMapUtil.delPoint(id);

			state.dialogVisible = false;
		};

		const onTapTrueBtn = async () => {
			let currentPnt = ShfMapUtil.getCurrnetPnt();
			if (state.dialogTitle == '添加监控' && currentPnt.length <= 1) return;
			if (!state.nameInp) return;
			if (!state.addrInp) return;
			if (state.dialogTitle == '添加监控') {
				let item: any = await ShfReqUtil.add(state.nameInp, state.addrInp, currentPnt[0], currentPnt[1]);
				if (!item) return;
				let vo = new CameraVo().init(item);
				ShfMapUtil.addPoint(vo.lngVal, vo.latVal, vo.id, vo.cameraName, vo.cameraAddr);
				state.dialogVisible = false;
				mapCameraMap[vo.id] = vo;
				return;
			} else {
				let id = ShfMapUtil.getCurrentId();
				let vo: CameraVo = mapCameraMap[id];
				if (!vo) return;
				state.dialogVisible = false;

				let item: any = await ShfReqUtil.edit(id, state.nameInp, state.addrInp);
				if (!item) return;
				let newVo = new CameraVo().init(item);
				ShfMapUtil.editPoint(newVo.id, newVo.cameraName);
				state.dialogVisible = false;
				mapCameraMap[newVo.id] = newVo;
				return;
			}
		};

		// 初始化时间
		const initTime = () => {
			state.time.txt = formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ');
			state.time.fun = window.setInterval(() => {
				state.time.txt = formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ');
			}, 1000);
		};
		// echartsMap 将坐标信息和对应物理量的值合在一起
		const convertData = (data: any) => {
			let res = [];
			for (let i = 0; i < data.length; i++) {
				let geoCoord = state.echartsMapData[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value),
					});
				}
			}
			return res;
		};

		const procWsInfos = () => {};

		//test start
		const initTest = () => {
			console.log('coordtransform:', coordtransform);
			state.gnss.jingdu = '120.151047';
			state.gnss.weidu = '30.285548';

			//坐标系转换->wgs84->gcj->bd09
			var wgs84togcj02 = coordtransform.wgs84togcj02(state.gnss.jingdu * 1, state.gnss.weidu * 1);
			var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
			console.log(state.gnss.jingdu * 1, state.gnss.weidu * 1, gcj02tobd09);
		};
		//test end

		//初始化websocket
		const initWebsocket = () => {
			//构建WebSocket
			if (typeof WebSocket == 'undefined') {
				console.log('您的浏览器不支持WebSocket');
			} else {
				console.log('您的浏览器支持WebSocket');
				var socketUrl = `ws://${window.location.host}/api/websocket`;
				console.log(socketUrl);
				/*
		    if (socket != null){
		        socket.close();
		        socket = null;
		    }*/

				// let socket = new WebSocket(socketUrl);

				// //打开事件
				// socket.onopen = function () {}

				// //获取消息事件
				// socket.onmessage = function (messageEvent){
				//     //addMsg(messageEvent.data);
				//     //console.log(messageEvent.data);
				//     procWsInfos(messageEvent.data);
				// }

				// //关闭事件
				// socket.onclose = function () {
				//     console.log("ws已关闭");
				//     procWsInfos("ws已关闭");
				// }

				// //发生错误事件
				// socket.onerror = function () {
				//     console.log("ws发生了错误");
				// }
			}
		};

		// 初始化 echartsMap（地图上的点）
		const initEchartsMap = () => {
			let documDemo1 = document.getElementById('visualizingDemo1');
			// debugger;
			const myChart = echarts.init(documDemo1);
			const option = {
				tooltip: {
					trigger: 'item',
					formatter(params) {
						// 自定义鼠标放入样式
						//let item = state.echartsMapImgs.find((v) => v.name === params.name);
						// let item = state.getTblData.data.find((v) => v.title == params.name);
						// let pointId = params.data.pointId
						let name = params.data.name;
						let item = { title: name, lng: params.data.value[0], lat: params.data.value[1], addr: params.data.addr };
						let html = `<div style="width: 240px">
							<div style="display: flex; align-items: center">
								<img src="/static/images/xx.jpg" style="width: 50px; height: 50px; border-radius: 100%; position: relative; border: 4px solid #ffffff; margin-left: -4px" />
								<div
									style="
										background: #51c1ff;
										width: 100%;
										height: 32px;
										margin-left: -14px;
										display: flex;
										align-items: center;
										padding-left: 20px;
										color: #fff;
									"
								>
									${item?.title}
								</div>
							</div>
							<div style="margin-top: 10px; font-size: 12px">
								<div style="width: 61px"><i class="el-icon-location-information" style="margin-right: 5px"></i>经纬度：</div>
								<div style="flex: 1; white-space: pre-wrap; word-break: break-all; margin-top: 5px; color: #333">${item.lng}，${item.lat}</div>
							</div>
							<div style="margin-top: 10px; font-size: 12px">
								<div style="width: 61px"><i class="el-icon-chat-dot-round" style="margin-right: 5px"></i>监控：</div>
								<div style="flex: 1; white-space: pre-wrap; word-break: break-all; margin-top: 5px; color: #333">${item.addr}</div>
							</div>
						</div>`;
						return html;
					},
				},
				color: ['#ea7ccc'],
				bmap: {
					center: (window as any)['mapCenter'], //东平
					zoom: 16,
					roam: true,
					mapStyle: {},
				},
				series: [
					{
						name: '指挥车',
						type: 'scatter',
						coordinateSystem: 'bmap',
						data: state.zhihuiChe,
						symbol: 'image://static/images/zhihuiche.png',
						symbolSize: 40,
						encode: {
							value: 2,
						},
						label: {
							formatter: '{b}',
							position: 'right',
							show: true,
							color: '#ff0000',
							fontSize: 14,
						},
					},
					{
						name: '路线点',
						type: 'scatter',
						coordinateSystem: 'bmap',
						data: state.luxianDian,
						symbol: 'image://static/images/end_e68ad9a.png',
						symbolSize: 10,
						encode: {
							value: 2,
						},
						label: {
							formatter: '{b}',
							//position: 'right',
							position: 'top',
							show: false,
							color: '#ff0000',
							fontSize: 14,
						},
					},
					{
						name: '轨迹路线',
						type: 'lines',
						coordinateSystem: 'bmap',
						polyline: true,
						// 统一的样式设置
						lineStyle: {
							color: '#00ff00',
							opacity: 0.8,
							width: 10,
						},
						data: state.luxianData,
					},
				],
			};

			myChart.setOption(option, true);
			state.myCharts.push(myChart);
			// 地图
			const map = myChart.getModel().getComponent('bmap').getBMap();
			// BMAP_NORMAL_MAP ：此地图类型展示普通街道视图
			// BMAP_PERSPECTIVE_MAP ：此地图类型展示透视图像视图。（这个还不会用）
			// BMAP_SATELLITE_MAP：卫星地图 （没有坐标， 绿绿的一片的卫星地图）
			// BMAP_HYBRID_MAP：混合地图 （既有坐标，也是绿绿的一片的卫星地图）
			// eslint-disable-next-line no-undef
			map.setMapType(BMAP_HYBRID_MAP);
			//lhc add begin
			console.log('+++++++++++++++++++++++++');
			map.setMinZoom((window as any)['mapMinZoom']);
			map.setMaxZoom((window as any)['mapMaxZoom']);
			map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用。
			map.enableDragging(); //启用地图拖拽，默认启用。
			ShfMapUtil.init(map, new BMap.Point(104.00943, 30.7209), state.myCharts[0], state.zhihuiChe, state, this, editCamera, clickCamera);
			/*
			map.enableDoubleClickZoom();//启用双击放大，默认启用。
			map.enableKeyboard();//启用键盘操作，默认禁用。键盘的上、下、左、右键可连续移动地图。同时按下其中两个键可使地图进行对角移动。PgUp、PgDn、Home和End键会使地图平移其1/2的大小。+、-键会使地图放大或缩小一级。
			map.enableInertialDragging();// 启用地图惯性拖拽，默认禁用。
			map.enableContinuousZoom();// 启用连续缩放效果，默认禁用。
			map.enablePinchToZoom();//启用双指操作缩放，默认启用。
			map.enableAutoResize();//启用自动适应容器尺寸变化，默认启用。
			map.addControl(new BMap.MapTypeControl());// 添加地图类型控件（地图/卫星/三维）
			map.addControl(new BMap.OverviewMapControl());//添加可折叠的缩略地图控件
			map.addControl(new BMap.ScaleControl());//平移和缩放
			*/
			//lhc add end
			// eslint-disable-next-line no-undef
			/*
			let bdary = new BMap.Boundary();
			// 获取行政区域
			bdary.get('成都', function (rs) {
				// 行政区域的点有多少个
				let count = rs.boundaries.length;
				for (let i = 0; i < count; i++) {
					// eslint-disable-next-line no-undef
					let ply = new BMap.Polygon(rs.boundaries[i], {
						// 设置多边形边线线粗
						strokeWeight: 4,
						// 设置多边形边线透明度0-1
						strokeOpacity: 1,
						// 设置多边形边线样式为实线或虚线，取值 solid 或 dashed
						StrokeStyle: 'dashed',
						// 设置多边形边线颜色
						strokeColor: '#febb50',
						// 设置多边形填充颜色
						fillColor: '',
					});
					// 建立多边形覆盖物
					// 添加覆盖物
					map.addOverlay(ply);
					// 调整视野
					map.setViewport(ply.getPath());
				}
				// 初始化地图，设置中心点坐标和地图级别
				// new BMap.Point('深圳市', 11)
				// eslint-disable-next-line no-undef
				map.centerAndZoom(new BMap.Point(104.00943, 30.7209), 16);				
			});*/
		};

		const jjLeibie = ['通信类', '能源动力', '交通枢纽', '军工类', '生命线', '次生灾害', '金融类', '工矿化工'];

		// 批量设置 echarts resize
		const initEchartsResize = () => {
			window.addEventListener('resize', () => {
				for (let i = 0; i < state.myCharts.length; i++) {
					state.myCharts[i].resize();
				}
			});
		};
		const getList = async () => {
			let list: any = await ShfReqUtil.list();
			if (!list) return;
			for (const item of list) {
				let vo = new CameraVo().init(item);
				ShfMapUtil.addPoint(vo.lngVal, vo.latVal, vo.id, vo.cameraName, vo.cameraAddr);
				mapCameraMap[vo.id] = vo;
			}
		};
		const editCamera = (that: any) => {
			let id = ShfMapUtil.getCurrentId();
			let vo: CameraVo = mapCameraMap[id];
			if (!vo) return;
			state.dialogTitle = '修改监控';
			state.dialogVisible = true;
			state.addrInp = vo.cameraAddr;
			state.nameInp = vo.cameraName;
		};
		const clickCamera = async (that: any) => {
			let id = ShfMapUtil.getCurrentId();
			let vo: CameraVo = mapCameraMap[id];
			await fetchPhotos(vo.cameraName);
			if (!vo) return;
			state.videoVisible = true;
			state.flvurl = (window as any)['rstpUrl'] + vo.cameraAddr;
			//  state.flvurl = "http://localhost:8800/test.flv";
			state.displayPhone = vo.cameraAddr;
			state.videoTitle = vo.cameraName;
		};
		const webSocket = ref<WebSocket | null>(null); // 指定类型为WebSocket或null
		const locationData = ref({ latitude: 0, longitude: 0 });
		// 创建WebSocket连接
		const connectWebSocket = () => {
			// webSocket.value = new WebSocket('ws://192.168.0.113:8080/ws');
			webSocket.value = new WebSocket('ws://localhost:8080/ws');
			webSocket.value.onopen = () => {
				// 处理连接建立
				console.log('WebSocket connection established');
			};
			webSocket.value.onmessage = (event) => {
				// 当从服务器接收到消息时处理
				const data = JSON.parse(event.data);
				locationData.value = { latitude: data.latitude, longitude: data.longitude };
			};

			webSocket.value.onclose = (event) => {
				// 处理连接关闭
				console.log('WebSocket connection closed:', event);
			};

			webSocket.value.onerror = (error) => {
				// 处理错误
				console.error('WebSocket error:', error);
			};
		};
		const photos = ref([]);
		const fetchPhotos = async (uploaderName: string) => {
			try {
				const response = await fetch(`http://localhost:8080/getPhotos?uploaderName=${encodeURIComponent(uploaderName)}`);
				// const response = await fetch(`http://192.168.0.113:8080/getPhotos?uploaderName=${encodeURIComponent(uploaderName)}`);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const res = await response.json();
				photos.value = res;
				// photos.value = await response.json();
			} catch (error) {
				console.error('Error fetching photos:', error);
			}
		};
		const formatPhotoName = (photoName: any) => {
			// 匹配格式为 "20231207_224553.jpg" 的文件名
			const match = photoName.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);

			if (match) {
				// 构建一个更可读的日期时间字符串
				return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}`;
			}

			// 如果格式不匹配，返回原始字符串
			return photoName;
		};

		const toggleEnlarge = (id: any) => {
			state.enlargedPhotoId = state.enlargedPhotoId === id ? null : id;
		};
		// 页面加载时
		onMounted(async () => {
			initTime();
			//await loadTypeName();
			await initEchartsMap();
			//await initVisualizingContentLeftTop();
			//await initVisualizingContentLeftBottom();
			//await initVisualizingContentCenterTop();
			//await initVisualizingContentCenterBottom();
			//await initVisualizingContentRightTop();
			//await initVisualizingContentRightBottom();
			await initEchartsResize();
			//初始化websocket
			// initWebsocket();

			getList();
			//temptest
			//initTest();
		});

		// 页面卸载时
		onUnmounted(() => {
			window.clearInterval(state.time.fun);
			for (let i = 0; i < state.myCharts.length; i++) {
				state.myCharts[i].dispose();
			}
			state.myCharts = [];
		});
		return {
			...toRefs(state),
			onTapTrueBtn,
			closeVideo,
			remoteSearch,
			remoteChange,
			onTapCallPhone,
			onTapDelBtn,
			tapDisplay,
			photos,
			toggleEnlarge,
			formatPhotoName,
		};
	},
});
</script>

<style scoped lang="scss">
/* 改变input框背景颜色 */

// ::v-deep .selectClass .el-input__inner {
//   background-color: #d5ffff !important;
// }
// 左右两侧图表宽度
$lrWidth: 288px;
// 中部图表高度
$cheight: 240px;
// 标题宽度
$titleWidth: 240px;
.visualizing-demo1 {
	height: 100%;
	width: 100%;
	position: relative;
	::v-deep(.BMap_cpyCtrl) {
		display: none;
	}
	::v-deep(.anchorBL) {
		display: none;
	}
	.visualizing-container {
		.visualizing-container-head {
			height: 60px;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			color: var(--color-whites);
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.02));
			z-index: 3;
			.visualizing-container-head-left {
				flex: 1;
				position: relative;
				height: 60px;
				.visualizing-container-head-left-text {
					position: relative;
					z-index: 1;
					font-size: 12px;
					opacity: 0.6;
					width: 93%;
					padding-left: 15px;
					top: 50%;
					transform: translateY(-100%);
					.visualizing-container-head-left-text-box {
						width: 100%;
						position: relative;
						padding-left: 15px;
						&::after {
							content: '';
							height: 20px;
							width: 100%;
							position: absolute;
							background: linear-gradient(to right, rgba(22, 207, 208, 0.1), rgba(22, 207, 208, 0.3));
							top: -1px;
							left: 0;
							transform: skew(30deg);
						}
					}
				}
				&::before,
				&::after {
					content: '';
					height: 3px;
					background: linear-gradient(-90deg, #16cfd0, transparent);
					position: absolute;
					width: 100%;
				}
				&::before {
					top: 1px;
					right: 33px;
					opacity: 0.8;
				}
				&::after {
					top: 41px;
					right: -2px;
				}
			}
			.visualizing-container-head-center {
				height: 60px;
				font-size: 18px;
				text-align: center;
				display: flex;
				flex-direction: column;
				position: relative;
				padding: 0 60px;
				background: radial-gradient(rgba(0, 0, 0, 0.7) 5%, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 0.02) 70%);
				.visualizing-container-head-center-box {
					margin: auto;
					position: relative;
					z-index: 1;
					.visualizing-container-head-center-maintitle {
						position: relative;
						&::before,
						&::after {
							content: '';
							position: absolute;
							min-width: 21%;
							height: 29px;
							top: 2px;
							opacity: 0.3;
							border-top: 1px solid #16cfd0;
						}
						&::before {
							left: -70px;
							border-right: 2px solid #16cfd0;
							transform: skew(50deg);
						}
						&::after {
							right: -70px;
							border-left: 2px solid #16cfd0;
							transform: skew(-50deg);
						}
					}
					.visualizing-container-head-center-subtitle {
						font-size: 14px;
						opacity: 0.8;
						position: relative;
						&::before,
						&::after {
							content: '';
							position: absolute;
							min-width: 35%;
							height: 23px;
							bottom: 8px;
							border-bottom: 2px solid #16cfd0;
						}
						&::before {
							transform: skew(50deg);
							left: -33px;
							border-left: 3px solid #16cfd0;
							border-image: linear-gradient(to right, #16cfd0, rgba(22, 207, 208, 0.02)) 1 10;
						}
						&::after {
							transform: skew(-50deg);
							right: -33px;
							border-right: 3px solid #16cfd0;
							border-image: linear-gradient(to left, rgba(22, 207, 208, 1), rgba(22, 207, 208, 0.02)) 1 10;
						}
					}
					&::before,
					&::after {
						content: '';
						position: absolute;
						width: 36px;
						height: 17px;
						top: -8px;
						border-bottom: 2px solid rgba(22, 207, 208, 0.7);
					}
					&::before {
						transform: skew(32deg);
						left: -89px;
						border-left: 3px solid rgba(22, 207, 208, 0.7);
					}
					&::after {
						transform: skew(-32deg);
						right: -89px;
						border-right: 3px solid rgba(22, 207, 208, 0.7);
					}
				}
				&::before,
				&::after {
					content: '';
					position: absolute;
					min-width: 50%;
					height: 15px;
					bottom: 0px;
					border-bottom: 4px solid #16cfd0;
				}
				&::before {
					transform: skew(60deg);
					left: 13px;
					border-left: 5px solid #16cfd0;
				}
				&::after {
					transform: skew(-60deg);
					right: 13px;
					border-right: 5px solid #16cfd0;
				}
			}
			.visualizing-container-head-right {
				flex: 1;
				position: relative;
				height: 60px;
				.visualizing-container-head-right-text {
					position: relative;
					z-index: 1;
					font-size: 12px;
					opacity: 0.6;
					width: 93%;
					float: right;
					text-align: right;
					padding-right: 15px;
					top: 50%;
					transform: translateY(-100%);
					.visualizing-container-head-right-text-box {
						width: 100%;
						position: relative;
						padding-right: 15px;
						&::after {
							content: '';
							height: 20px;
							width: 100%;
							position: absolute;
							background: linear-gradient(to left, rgba(22, 207, 208, 0.1), rgba(22, 207, 208, 0.3));
							top: -1px;
							right: 0;
							transform: skew(-30deg);
						}
					}
				}
				&::before,
				&::after {
					content: '';
					height: 3px;
					background: linear-gradient(90deg, #16cfd0, transparent);
					position: absolute;
					width: 100%;
				}
				&::before {
					top: 1px;
					left: 33px;
					opacity: 0.8;
				}
				&::after {
					top: 41px;
					left: -2px;
				}
			}
		}
		.visualizing-container-title {
			max-width: $titleWidth;
			font-size: 14px;
			color: var(--color-whites);
			opacity: 0.8;
			padding: 0 5px;
			border-bottom: 1px solid var(--color-whites);
			border-image: linear-gradient(to right, var(--color-whites), rgba(22, 207, 208, 0.02)) 1 10;
			position: relative;
			i {
				padding-right: 5px;
				color: orange;
			}
			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 0;
				width: 1px;
				height: 10px;
				background: linear-gradient(to top, var(--color-whites), rgba(255, 255, 255, 0.5));
			}
		}
		.visualizing-container-title-colorful {
			max-width: $titleWidth;
			border: 0;
			padding: 1px;
			background: linear-gradient(135deg, red, orange, green, #16cfd0, purple);
			--mask-image: repeating-linear-gradient(135deg, #000 0px, #000 1px, transparent 1px, transparent 4px);
			-webkit-mask-image: var(--mask-image);
			mask-image: var(--mask-image);
		}
		.visualizing-container-content-left {
			width: $lrWidth;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.01));
			padding-top: 60px;
			z-index: 2;
			.visualizing-container-content-left-flex {
				height: 50%;
				display: flex;
				flex-direction: column;
				padding-left: 15px;
			}
		}
		.visualizing-container-content-center {
			width: 100%;
			height: $cheight;
			position: absolute;
			bottom: 0;
			left: 0;
			background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.01));
			z-index: 1;
			.visualizing-container-content-center-bottom {
				width: calc(100% - #{$lrWidth * 2});
				height: $cheight;
				left: $lrWidth;
				bottom: 0;
				position: absolute;
				display: flex;
				padding: 0 15px;
				.visualizing-container-content-center-bottom-flex {
					width: 50%;
					padding: 0 15px;
				}
			}
		}
		.visualizing-container-content-right {
			width: $lrWidth;
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			padding-top: 60px;
			background: linear-gradient(to left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.01));
			z-index: 2;
			.visualizing-container-content-right-flex {
				height: 50%;
				display: flex;
				flex-direction: column;
				padding-right: 15px;
			}
		}
	}
}
.photo-container {
	position: relative;
	cursor: pointer;
}

.timestamp {
	position: absolute;
	top: 5px;
	left: 5px;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	padding: 5px;
}

.description {
	display: none;
	position: absolute;
	bottom: 5px;
	left: 5px;
	background-color: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 5px;
	z-index: 10;
}
.photo:hover + .description {
	display: block;
}

.photo {
	width: 80%;
	// transition: transform 0.3s ease;
}

.enlarged {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(1);
	max-width: 100%;
	max-height: 100%;
	z-index: 1000;
	object-fit: contain;
}
</style>
