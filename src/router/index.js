// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
// 商品管理
import Goods from '@/views/goods/Goods';
// 交易订单
import Pushmq from '@/views/push/Pushmq';
//MQ消费管理
import Consumq from '@/views/push/Consumq';
//数据补偿管理
import RepairData from '@/views/push/RepairData';
//数据文件补偿管理
import RepairFile from '@/views/push/RepairFile';
// 用户管理
import user from '@/views/system/user';
// 菜单管理
import Module from '@/views/system/Module';
// 角色管理
import Role from '@/views/system/Role';
// 公司管理
import Dept from '@/views/system/Dept';
// 系统环境变量
import Variable from '@/views/system/Variable';
// 权限管理
import Permission from '@/views/system/Permission';
// 配置管理
import DatasyncConfig from '@/views/machine/DatasyncConfig';
// 支付配置信息npm
import TaskJobConfig from '@/views/machine/TaskJobConfig';
// 监控查询
import druidLogin from '@/views/druid/login';
// 图表界面
import statistics from '@/views/charts/statistics';
// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: '首页',
        component: index,
        iconCls: 'el-icon-tickets',
        children: [{
            path: '/goods/Goods',
            name: '商品管理',
            component: Goods,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/push/Pushmq',
            name: '推送MQ',
            component: Pushmq,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/push/Consumq',
            name: 'MQ消费',
            component: Consumq,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/push/RepairData',
            name: '接口补偿',
            component: RepairData,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/push/RepairFile',
            name: '文件补偿',
            component: RepairFile,
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/system/user',
            name: '用户管理',
            component: user,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Module',
            name: '菜单管理',
            component: Module,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Role',
            name: '角色管理',
            component: Role,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Dept',
            name: '公司管理',
            component: Dept,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Variable',
            name: '系统环境变量',
            component: Variable,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Permission',
            name: '权限管理',
            component: Permission,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/machine/TaskJobConfig',
            name: '支付配置信息',
            component: TaskJobConfig,
            meta: {
                requireAuth: true
            }
        }, , {
            path: '/machine/DatasyncConfig',
            name: '同步信息管理',
            component: DatasyncConfig,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/druid/login',
            name: '监控查询',
            component: druidLogin,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/charts/statistics',
            name: '数据可视化',
            component: statistics,
            meta: {
                requireAuth: true
            }
        }]
    }]
})