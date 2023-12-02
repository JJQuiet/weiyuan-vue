<template>
	<div class="system-menu-container layout-pd ">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<!-- <el-input size="default" placeholder="请输入主机名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button> -->
				<el-button size="default" type="success" class="ml10" @click="onOpenAddHost">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增
				</el-button>
			</div>
			<el-table
				:data="state.tableData.data"
				v-loading="state.tableData.loading"
				style="width: 100%"
				row-key="path"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				
				<el-table-column prop="nameValue" label="预案名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="addrName" label="通讯组" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sourceValue" label="报警来源" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditMenu(scope.row)">修改</el-button>
						<el-button size="small" text type="danger" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getTableData()" />
		<el-dialog
		v-model="state.dialogVisible"
		title=""
		width="30%"
		class=" flex flex-col"
		>
		<el-input v-model="state.nameInp" placeholder="预案名称" />
		<div class=" h-4"></div>
		<el-select v-model="state.addrValue" class="m-2" placeholder="选择通讯录中的分组" size="large">
			<el-option
			v-for="item in state.addrBookArr"
			:key="item.value"
			:label="item.label"
			:value="item.value"
			/>
		</el-select>
		<div class=" h-4"></div>
		<el-select v-model="state.sourceValue" class="m-2" placeholder="选择报警来源" size="large">
			<el-option
			v-for="item in state.sourcesArr"
			:key="item.value"
			:label="item.label"
			:value="item.value"
			/>
		</el-select>
		<div class=" h-4"></div>
		<el-input v-model="state.contentInp"  type="textarea" :autosize="{ 'minRows': 4}" placeholder="短信通知内容，例如：{0}出现sos报警，经纬度为:{1}，tip:{0}为报警号码，{1}为经纬度"/>
		<template #footer>
			<span class="dialog-footer">
			<el-button @click="state.dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="tapCreate">
				确认
			</el-button>
			</span>
		</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import ReqUtils from '/@/utils/shf/ReqUtils';
import HostVo from '/@/utils/shf/model/vo/HostVo';
import FormReq from '/@/utils/shf/FormReq';
import { useRouter } from 'vue-router';
import GlobalData from '/@/utils/shf/GlobalData';
import mittBus from '/@/utils/mitt';
import { fa } from 'element-plus/es/locale';
import WarnReq from '/@/utils/shf/WarnReq';
import GroupModel from '/@/utils/shf/model/GroupModel';
import TipTool from '/@/utils/unit/TipTool';
import PlanVo from '/@/utils/shf/model/vo/PlanVo';
import AlertTool from '/@/utils/unit/AlertTool';

let isEditPlan = false;
let editPlanVo:PlanVo;

const router = useRouter();
// import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/hosts/hostMenu.vue'));

// 定义变量内容
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const menuDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as RouteRecordRaw[],
		loading: true,
	},
	dialogVisible:false,
	nameInp:"",
	phoneInp:"",
	contentInp:"",
	sourcesArr:[{
		value: 'SOS',
		label: '单兵SOS',
  	}],
	addrBookArr:[],
	addrValue:"",
	sourceValue:""
});

// 获取路由数据，真实请从接口获取
const getTableData = async() => {
	state.tableData.loading = true;
	setTimeout(() => {
		state.tableData.loading = false;
	}, 500);

	// let hosts:any = await ReqUtils.getHosts();
	// let arr:any[] = [];
	// for (const host of hosts) {
	// 	let vo = new HostVo(host);
	// 	arr.push(vo);
	// }
	// state.tableData.data = arr;

	let planArr:any = await WarnReq.planList();
	let arr:any[] = [];
	if(planArr)
	{
		for (const host of planArr) {
			let vo = new PlanVo(host);
			arr.push(vo);
		}
	}
	state.tableData.data = arr;
};
const onOpenAddHost = async ()=>{
	state.dialogVisible = true;
	state.nameInp = "";
	state.contentInp = "";
	state.sourceValue = "";
	state.addrValue = "";
	isEditPlan = false;
}
const onOpenHost = (obj:any) => {
	localStorage.setItem("currentHostid",obj.hostid);
	router.push({
		path: '/iframesFour',
	});
};
const tapCreate = async (obj:any)=>{
	if(!state.addrValue)
		return TipTool.tipError("未选择通讯录中的分组");
	if(!state.sourceValue)
		return TipTool.tipError("未选择报警来源");
	if(!state.nameInp)
		return TipTool.tipError("未输入预案名称");
	if(!state.contentInp)
		return TipTool.tipError("未输入短信通知内容");

	
	if(isEditPlan == false)
	await WarnReq.planAdd(state.addrValue,state.sourceValue,state.nameInp,state.contentInp);
	else
	await WarnReq.planEdit(editPlanVo.id,state.addrValue,state.sourceValue,state.nameInp,state.contentInp);

	state.dialogVisible = false;

	getTableData();
}
// 打开编辑菜单弹窗
const onOpenEditMenu = (obj:any) => {
	state.dialogVisible = true;
	state.nameInp = obj.nameValue;
	state.contentInp = obj.contentValue;
	state.sourceValue = obj.sourceValue;
	state.addrValue = obj.addrId;
	isEditPlan = true;
	editPlanVo = obj;
	// localStorage.setItem("currentHostid",obj.hostid);
	// router.push({
	// 	path: '/iframesthree',
	// });
};
// 删除当前行
const onTabelRowDel = async (row:any) => {
	let res = await AlertTool.alertDel("是否删除");
	if(res)
	{
		await WarnReq.planDel(row.id);
		getTableData();
	}
};
// 页面加载时
onMounted(async() => {
	// mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 2, ...router }));
	// FormReq.addForm();
	await GroupModel.getIns().getGroup();
	let groupArr = GroupModel.getIns().getGroupArr();
	for (const group of groupArr) {
		(state.addrBookArr as any).push({value: group.id,label:group.groupName});
	}

	getTableData();
});
</script>
