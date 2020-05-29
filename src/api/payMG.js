import axios from 'axios';
import { req } from './axiosFun';

//统计信息——今日接收数据/推送mq出错/消费mq出错/近7日接受/推送/消费统计/源系统发送占比/目标系统接收占比
export const TotalData = (params) => { return req("post", "/api/TotalData/lisInfo", params) };

//推送管理——推送Mq-查询失败数据
export const PushMQList = (params) => { return req("post", "/api/push-handler", params) };
//推送Mq-解锁，重新推送
export const PushMQEdit = (params) => { return req("post", "/api/push-handler", params) };
//消费Mq-查询失败数据
export const ConsuMQList = (params) => { return req("post", "/api/ConsuMQ/list", params) };
//消费Mq-解锁，重新推送
export const ConsuMQEdit = (params) => { return req("post", "/api/ConsuMQ/edit", params) };
//接口/文件补偿-查询失败数据
export const RepairDataList = (params) => { return req("post", "/api/repairData/list", params) };
//接口/文件补偿-解锁，重新推送
export const RepairDataEdit = (params) => { return req("post", "/api/RepairData/edit", params) };
//测试未删除
export const ConfigDelete = (params) => { return axios.delete("/api/Config/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

//配置管理——跑批配置管理-查询
export const TaskList = (params) => { return req("post", "/api/task/list", params) };
// 跑批配置管理-修改
export const TaskEdit = (params) => { return req("post", "/api/task/edit", params) };
//跑批信息-新增
export const TaskAdd = (params) => { return req("post", "/api/task/add", params) };
// 同步信息系统-查询
export const SyncList = (params) => { return req("post", "/api/sync/list", params) };
// 同步信息系统-修改
export const SyncEdit = (params) => { return req("post", "/api/sync/edit", params) };
// 同步信息系统-新增
export const SyncAdd = (params) => { return req("post", "/api/sync/add", params) };

