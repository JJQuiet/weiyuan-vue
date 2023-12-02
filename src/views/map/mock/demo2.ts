// 顶部下来菜单
export const dropdownList: Array<object> = [
	{
		label: '战备物资装备',
	},
	{
		label: '专业队伍管理',
	},
	{
		label: '指挥机构管理',
	},
	{
		label: '重要经济目标',
	},
	{
		label: '疏散要素管理',
	},	
];

// sky 天气
export const skyList: Array<object> = [
	{
		v1: '时间',
		v2: '天气',
		v3: '温度',
		v4: '湿度',
		v5: '降水概率',
		v6: '风向',
		v7: '风力',
		type: 'title',
	},
	{
		v1: '今天',
		v2: 'el-icon-cloudy-and-sunny',
		v3: '20°/26°',
		v4: '80%',
		v5: '50%',
		v6: '东南风',
		v7: '13m/s',
	},
	{
		v1: '明天',
		v2: 'el-icon-lightning',
		v3: '20°/26°',
		v4: '80%',
		v5: '50%',
		v6: '东南风',
		v7: '13m/s',
	},
	{
		v1: '后天',
		v2: 'el-icon-sunny',
		v3: '20°/26°',
		v4: '80%',
		v5: '50%',
		v6: '东南风',
		v7: '13m/s',
	},
];

// 当前设置状态
export const dBtnList: Array<object> = [
	{
		v1: '坑洞左侧',
		v2: '风机运转',
		v3: '126天',
		v4: '设备在线',
	},
	{
		v1: '坑洞右侧',
		v2: '风机运转',
		v3: '360天',
		v4: '设备预警',
	},
];

// 当前设备监测
export const chartData4List: Array<object> = [
	{
		label: '安防',
	},
	{
		label: '设备',
	},
	{
		label: '渗水',
	},
	{
		label: '漏水',
	},
	{
		label: '入侵',
	},
	{
		label: '消防',
	},
];

// 3DEarth 地图周围按钮组
export const earth3DBtnList: Array<object> = [
	{
		topLevelClass: 'fixed-top',
		icon: 'el-icon-s-marketing',
		label: '专业队伍',
		type: 0,
	},
	{
		topLevelClass: 'fixed-right',
		icon: 'el-icon-s-cooperation',
		label: '指挥机构',
		type: 1,
	},
	{
		topLevelClass: 'fixed-bottom',
		icon: 'el-icon-s-order',
		label: '经济目标',
		type: 2,
	},
	{
		topLevelClass: 'fixed-left',
		icon: 'el-icon-s-claim',
		label: '战备物资',
		type: 3,
	},
];
