<template>
	<div class="system-menu-dialog-container">
		<el-dialog @opened="openComplete" :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form  ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
				<el-row :gutter="35">
					<div class=" w-full hostContent" ref="homeLineRef"></div>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import * as echarts from 'echarts';
import { defineAsyncComponent,reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { i18n } from '/@/i18n/index';
// import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";


const homeLineRef = ref();


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const state = reactive({
	global:{
		homeChartOne: null,
	} as any,
	// 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
	ruleForm: {
		menuSuperior: [], // 上级菜单
		menuType: 'menu', // 菜单类型
		name: '', // 路由名称
		component: '', // 组件路径
		componentAlias: '', // 组件路径别名
		isLink: false, // 是否外链
		menuSort: 0, // 菜单排序
		path: '', // 路由路径
		redirect: '', // 路由重定向，有子集 children 时
		meta: {
			title: '', // 菜单名称
			icon: '', // 菜单图标
			isHide: false, // 是否隐藏
			isKeepAlive: true, // 是否缓存
			isAffix: false, // 是否固定
			isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
			isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
			roles: '', // 权限标识，取角色管理
		},
		btnPower: '', // 菜单类型为按钮时，权限标识
	},
	menuData: [] as RouteItems, // 上级菜单数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});

// 获取 pinia 中的路由
const getMenuData = (routes: RouteItems) => {
	const arr: RouteItems = [];
	routes.map((val: RouteItem) => {
		val['title'] = i18n.global.t(val.meta?.title as string);
		arr.push({ ...val });
		if (val.children) getMenuData(val.children);
	});
	return arr;
};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
	if (type === 'edit') {
		// 模拟数据，实际请走接口
		row.menuType = 'menu';
		row.menuSort = Math.floor(Math.random() * 100);
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '修改菜单';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增菜单';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	menuDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
	
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 是否内嵌下拉改变
const onSelectIframeChange = () => {
	if (state.ruleForm.meta.isIframe) state.ruleForm.isLink = true;
	else state.ruleForm.isLink = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	closeDialog(); // 关闭弹窗
	emit('refresh');
	// if (state.dialog.type === 'add') { }
	// setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
};
const openComplete = ()=>{
	console.log("openComplete>>>>>>>>");
	displayChart();
}
// 页面加载时
onMounted(() => {
	state.menuData = getMenuData(routesList.value);
	
});
const displayChart = ()=>{
	if(state.global.homeChartOne)return;
	debugger;
	state.global.homeChartOne = markRaw(echarts.init(homeLineRef.value, state.charts.theme));
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: '设备状态',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		grid: { top: 70, right: 20, bottom: 30, left: 30 },
		tooltip: { trigger: 'axis' },
		legend: { data: ['cpu占用率', '内存占用率'], right: 0 },
		xAxis: {
			data: ['2023/1/2 13:12', '2023/1/2 14:12', '2023/1/2 15:12', '2023/1/2 16:12', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		},
		yAxis: [
			{
				type: 'value',
				name: '占有率',
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
			},
		],
		series: [
			{
				name: 'cpu占用率',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [0, 41.1, 30.4, 10, 53.3, 53.3, 53.3, 41.1, 30.4, 10, 53.3, 10],
				lineStyle: { color: '#fe9a8b' },
				itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#fe9a8bb3' },
						{ offset: 1, color: '#fe9a8b03' },
					]),
				},
			},
			{
				name: '内存占用率',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [0, 24.1, 7.2, 15.5, 42.4, 42.4, 42.4, 24.1, 7.2, 15.5, 42.4, 0],
				lineStyle: { color: '#9E87FF' },
				itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#9E87FFb3' },
						{ offset: 1, color: '#9E87FF03' },
					]),
				},
				emphasis: {
					itemStyle: {
						color: {
							type: 'radial',
							x: 0.5,
							y: 0.5,
							r: 0.5,
							colorStops: [
								{ offset: 0, color: '#9E87FF' },
								{ offset: 0.4, color: '#9E87FF' },
								{ offset: 0.5, color: '#fff' },
								{ offset: 0.7, color: '#fff' },
								{ offset: 0.8, color: '#fff' },
								{ offset: 1, color: '#fff' },
							],
						},
						borderColor: '#9E87FF',
						borderWidth: 2,
					},
				},
			},
		],
	};
	state.global.homeChartOne.setOption(option);
}

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.hostContent {
	height: calc(90vh - 151px) !important;
}
</style>