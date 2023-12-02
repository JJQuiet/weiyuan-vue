<template>
	<div class="system-menu-container layout-pd ">
        <el-card shadow="hover">
            <!-- el-tree -->
             <el-tree
			 ref="treeRef"
			     node-key="id"
                :data="state.dataArr"
                :props="props"
                show-checkbox
                @check-change="handleCheckChange"
				default-expand-all
				@node-contextmenu="handleContextMenu"
                />
				<div :style="{'z-index': 9999, position: 'fixed',left: state.rightClickMenuPosition.x + 'px', 
					top: state.rightClickMenuPosition.y + 'px', background: 'white',
					 'box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}" 
					  v-show="state.rightClickMenuVisible" id="option-button-group">
					 <el-dropdown  ref="dropdown1" @command="handleContextMenuCommand" :hide-on-click="false" >
						 <span class=" w-0 h-0 bg-red-100" >
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="0" >发送短信</el-dropdown-item>
								<el-dropdown-item command="1" divided>添加成员</el-dropdown-item>
								<el-dropdown-item command="2" divided>{{state.rightClickLeaf?'修改成员':'添加分组'}}</el-dropdown-item>
								<el-dropdown-item command="3" divided>{{state.rightClickLeaf?'删除成员':'修改分组'}}</el-dropdown-item>
								<el-dropdown-item v-if="!state.rightClickLeaf" command="4" divided>删除分组</el-dropdown-item>
								<!-- <el-dropdown-item>Action 2</el-dropdown-item>
								<el-dropdown-item>Action 3</el-dropdown-item>
								<el-dropdown-item disabled>Action 4</el-dropdown-item>
								<el-dropdown-item divided>Action 5</el-dropdown-item> -->
							</el-dropdown-menu>
						</template>
					 </el-dropdown>
					
				</div>			
        </el-card>
		<el-dialog
			v-model="state.dialogVisible"
			:title="state.dialogTitleName"
			width="30%"
			>
			<el-input v-model="state.dialogInp1" :placeholder="state.dialogPlaceHolder1" />
			<div class=" h-4"></div>
			<el-input v-if="state.dialogPlaceHolder2" v-model="state.dialogInp2" :placeholder="state.dialogPlaceHolder2" />
			<template #footer>
				<span class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="tapDialogTrueBtn">
					确定
				</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog
			v-model="state.diallogSendMsg"
			title="发送短信"
			width="30%"
			>
			<span>发送目的地</span>
			<div class=" h-2"></div>
			<el-input readonly  v-model="state.msgMemStr"  type="textarea" :autosize="{ 'minRows': 1,'maxRows':6}" placeholder=""/>
			<div class=" h-2"></div>
			<span>发送内容</span>
			<div class=" h-2"></div>
			<el-input  v-model="state.msgContent"  type="textarea" :autosize="{ 'minRows': 4,'maxRows':8}" placeholder="请输入短信内容"/>
			<template #footer>
				<span class="dialog-footer">
				<el-button @click="state.diallogSendMsg = false">取消</el-button>
				<el-button type="primary" @click="tapSendMsg">
					发送
				</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive,onBeforeMount } from 'vue';
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
// import { fa } from 'element-plus/es/locale';
import WarnReq from '/@/utils/shf/WarnReq';
import { Tree } from 'element-plus/es/components/tree-v2/src/types';
import AsReq from '/@/utils/shf/AsReq';
import GroupModel from '/@/utils/shf/model/GroupModel';
import AlertTool from '/@/utils/unit/AlertTool';
import GroupVo from '/@/utils/shf/model/vo/GroupVo';
import StrUnit from '/@/utils/unit/StrUnit';
import TipTool from '/@/utils/unit/TipTool';


const dropdown1 = ref();
const treeRef = ref();

const props = {
  children: 'memberArr',
  label: 'name'
}

let delayTime:any = -1;

let dialogStatus = "";

let selectId = "";

let selectParentId = "";


const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean
) => {
  console.log(data, checked, indeterminate)
}

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
	nameInp:"",
	phoneInp:"",
	contentInp:"",
	dataArr: [],
	rightClickMenuPosition:{x:0,y:0},
	rightClickMenuVisible:false,
	dialogVisible:false,
	dialogInp1:"",
	dialogPlaceHolder1:"",
	dialogInp2:"",
	dialogPlaceHolder2:"",
	rightClickLeaf:false,
	dialogTitleName:"",
	diallogSendMsg:false,
	msgMemberArr:[],
	msgMemStr: "",
	msgContent:""

});

// 获取路由数据，真实请从接口获取
const getTableData = async() => {
	state.tableData.loading = true;
	setTimeout(() => {
		state.tableData.loading = false;
	}, 500);

	let hosts:any = await ReqUtils.getHosts();
	let arr:any[] = [];
	for (const host of hosts) {
		let vo = new HostVo(host);
		arr.push(vo);
	}
	state.tableData.data = arr;
};
const onOpenAddHost = async ()=>{
	state.dialogVisible = true;
	state.nameInp = "";
	state.contentInp = "";
	state.phoneInp = "";
	
}
const onOpenHost = (obj:any) => {
	localStorage.setItem("currentHostid",obj.hostid);
	router.push({
		path: '/iframesFour',
	});
};
const tapCreate = (obj:any)=>{
	if(!state.nameInp)return;
	if(!state.phoneInp)return;
	if(!state.contentInp)return;
}
// 打开编辑菜单弹窗
const onOpenEditMenu = (obj:any) => {
	localStorage.setItem("currentHostid",obj.hostid);
	router.push({
		path: '/iframesthree',
	});
};
const tapSendMsg = async ()=>{
	if(!state.msgContent)
	{
		return;
	}
	let phoneArr = [];
	for (const vo of state.msgMemberArr) {
		let nameArr = (vo.name as string).split("：");
		let phone = nameArr[nameArr.length-1];
		if(StrUnit.isNum(phone))
		phoneArr.push(phone);
	}
	let res = await WarnReq.msgSend(phoneArr,state.msgContent);
	
}
// 删除当前行
const onTabelRowDel = (row: RouteRecordRaw) => {
	ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			ElMessage.success('删除成功');
			getTableData();
			//await setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
		})
		.catch(() => {});
};
const tapDialogTrueBtn = async ()=>{
	if(dialogStatus == "addGroup")
	{
		if(!state.dialogInp1)return;
		state.dataArr = [];
		await AsReq.addGroup(state.dialogInp1);
		refreshTree();
		state.dialogVisible = false;
		return;
	}
	if(dialogStatus == "addMember")
	{
		if(!state.dialogInp1)return;
		if(!state.dialogInp2)return;
		let vo:GroupVo = GroupModel.getIns().getGroupById(selectParentId);
		if(vo == null)return;
		state.dataArr = [];
		await AsReq.addMember(vo.id,vo.memberArr,{name:state.dialogInp1,phone:state.dialogInp2,id: StrUnit.getUUID()});
		refreshTree();
		state.dialogVisible = false;

		return;
	}
	if(dialogStatus == "editMember")
	{
		if(!state.dialogInp1)return;
		if(!state.dialogInp2)return;
		let vo:GroupVo = GroupModel.getIns().getGroupById(selectParentId);
		if(vo == null)return;
		state.dataArr = [];
		await AsReq.editMember(selectParentId,vo.memberArr,state.dialogInp1,state.dialogInp2,selectId);
		refreshTree();
		state.dialogVisible = false;
		return;
	}
	if(dialogStatus == "editGroup")
	{
		if(!state.dialogInp1)return;
		state.dataArr = [];
		await AsReq.editGroup(state.dialogInp1,selectParentId);
		refreshTree();
		state.dialogVisible = false;
		return;
	}
	
}
const handleContextMenuCommand = async (command: string | number | object)=>{
	if(command == 0)
	{
		let nodes = treeRef.value.getCheckedNodes();
		let memArr:any[] = [];
		state.msgMemStr = "";
		for (const data of nodes) {
			if(data.isLeaf == true)
			{
				let nameArr = (data.name as string).split("：");
				let phone = nameArr[nameArr.length-1];
				if(StrUnit.isNum(phone))
				{
					state.msgMemStr+=(data.name+"；");
				    memArr.push({id:data.id,name:data.name});
				}
			}
		}
		if(memArr.length <= 0)
		{
			return TipTool.tipError("未选择成员");
		}
		state.msgMemberArr = memArr;
		state.diallogSendMsg = true;
		return;
	}
	if(!state.rightClickLeaf)
	{
		if(command == 1)
		{
			state.dialogTitleName = "添加成员";
			state.dialogInp1 = "";
			state.dialogPlaceHolder1 = "请输入成员名";
			state.dialogInp2 = "";
			state.dialogPlaceHolder2 = "请输入成员号码";
			state.dialogVisible = true;
			dialogStatus = "addMember";
		}	
		else if(command == 2)
		{
			state.dialogTitleName = "添加分组";
			state.dialogInp1 = "";
			state.dialogPlaceHolder2 = "";
			state.dialogPlaceHolder1 = "请输入分组名";
			state.dialogVisible = true;
			dialogStatus = "addGroup";
		}
		else if(command == 3)
		{
			let group = GroupModel.getIns().getGroupById(selectParentId);
			if(group == null)return
			state.dialogTitleName = "修改分组";
			state.dialogInp1 = group.groupName;
			state.dialogPlaceHolder2 = "";
			state.dialogPlaceHolder1 = "请输入分组名";
			state.dialogVisible = true;
			dialogStatus = "editGroup";
		}
		else if(command == 4)
		{
			let res = await AlertTool.alertDel("是否删除该分组");
			if(res)
			{
				state.dataArr = [];
				await  AsReq.delGroup(selectId);
				refreshTree();
			}
		}	
	}
	else
	{
		if(command == 1){
			state.dialogTitleName = "添加成员";
			state.dialogInp1 = "";
			state.dialogPlaceHolder1 = "请输入成员名";
			state.dialogInp2 = "";
			state.dialogPlaceHolder2 = "请输入成员号码";
			state.dialogVisible = true;
			dialogStatus = "addMember";
			return;
		}
		if(command == 2)
		{
			let mem = GroupModel.getIns().getMemberById(selectParentId,selectId);
			if(mem == null)
			{
				TipTool.tipError("未找到该成员");
				return;
			}
			state.dialogTitleName = "修改成员";
			state.dialogInp1 = mem.name;
			state.dialogPlaceHolder1 = "请输入成员名";
			state.dialogInp2 = mem.phone;
			state.dialogPlaceHolder2 = "请输入成员号码";
			state.dialogVisible = true;
			dialogStatus = "editMember";
			return;
		}
		if(command == 3)
		{
			let res = await AlertTool.alertDel("是否删除该成员");
			if(res)
			{
				let group = GroupModel.getIns().getGroupById(selectParentId);
				state.dataArr = [];
				await AsReq.delMember(group.id,group.memberArr,selectId);
				refreshTree();
			}
		}
	}

}
const handleContextMenu = (e:any,data:any,node:any)=>{
	e.preventDefault();
	e.preventDefault();
	selectId = data.id;
	selectParentId = data.parentId;
	if(data.isLeaf)
	{
		state.rightClickLeaf = true;
	}
	else
	{
		state.rightClickLeaf = false;
	}
	// 获取鼠标点击位置
	const x = e.clientX;
	let y = e.clientY;
	// 将鼠标点击位置存储在数据中
	//调整菜单顶点的位置，如果超出页面下端就要调整		    
	if (y>450){
		y=450;
	}
	state.rightClickMenuPosition.x = x;
	state.rightClickMenuPosition.y = y;
	
	if(delayTime !=-1)
	{
		clearTimeout(delayTime);
		delayTime = -1;
	}
	state.rightClickMenuVisible = false; // 显示右键菜单
	dropdown1.value.handleClose();
	delayTime = setTimeout(()=>{
		delayTime = -1;
		state.rightClickMenuVisible = true; // 显示右键菜单
		dropdown1.value.handleOpen();
	},200);
}
const refreshTree = async ()=>{
	await GroupModel.getIns().getGroup();
   (state.dataArr as any) = GroupModel.getIns().getTreeArr();
}
// 页面加载时
onMounted(async() => {
	// getTableData();
	// mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 2, ...router }));
	// // FormReq.addForm();
    
    // let groupArr = GroupModel.getIns().getGroupArrData();
    // dataArr.splice(0,dataArr.length);
    // dataArr.push(...groupArr);
	refreshTree();
  
});
onBeforeMount(async() => {
    // await GroupModel.getIns().getGroup();
    // let groupArr = GroupModel.getIns().getGroupArrData();
    // // dataArr.splice(0,dataArr.length);
    // // dataArr.push(...groupArr);
    // setTimeout(()=>{
    //   dataArr.splice(0,dataArr.length);
    //   dataArr.push(...groupArr);
    //   debugger;
    // },2000)

});

</script>
