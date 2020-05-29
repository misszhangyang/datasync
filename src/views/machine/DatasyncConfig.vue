/**
 * 支付管理 支付配置信息
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>同步信息配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item>
        <el-input size="small" v-model="formInline.sysCode" placeholder="输入系统编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="sysCode" label="系统编号" width="200">
      </el-table-column>
      <el-table-column sortable prop="sysName" label="系统名称" width="200">
      </el-table-column>
      <el-table-column sortable prop="sysQueue" label="指定队列" width="200">
      </el-table-column>
      <el-table-column sortable prop="sysRoutekey" label="路由key" width="200">
      </el-table-column>
      <el-table-column sortable prop="sysApi" label="接口地址" width="200">
      </el-table-column>
      <el-table-column sortable prop="sysTime" label="修改时间" width="200">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="系统编号" prop="sysCode">
          <el-input size="small" v-model="editForm.sysCode" auto-complete="off" placeholder="请输入系统编号"></el-input>
        </el-form-item>
        <el-form-item label="系统名称" prop="sysName">
           <el-input size="small" v-model="editForm.sysName" auto-complete="off" placeholder="请输入系统名称"></el-input>
        </el-form-item>
        <el-form-item label="指定队列" prop="sysQueue">
          <el-input size="small" v-model="editForm.sysQueue" auto-complete="off" placeholder="请输入指定队列"></el-input>
        </el-form-item>
        <el-form-item label="路由key" prop="sysRoutekey">
          <el-input size="small" v-model="editForm.sysRoutekey" auto-complete="off" placeholder="请输入路由key"></el-input>
        </el-form-item>
        <el-form-item label="接口地址" prop="sysApi">
          <el-input size="small" v-model="editForm.sysApi" auto-complete="off" placeholder="请输入接口地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="路由key" prop="sysRoutkey">
          <el-input size="small" v-model="editForm.configName" auto-complete="off" placeholder="请输入显示名称"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="状态" prop="payOpen">
          <el-select size="small" v-model="editForm.payOpen" placeholder="请选择" class="userRole">
            <el-option label="正常" value="T"></el-option>
            <el-option label="禁用" value="N"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  SyncList,
  SyncEdit,
  SyncAdd,
} from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        sysCode: '',
        sysName: '',
        sysQueue: '',
        sysRoutekey: '',
        sysApi: '',
        sysTime: '',
        sysIndex: '',
      },
      addEditForm: {
        sysCode: '',
        sysName: '',
        sysQueue: '',
        sysRoutekey: '',
        sysApi: '',
        sysTime: '',
        sysIndex: '',
      },
      // rules表单验证
      rules: {
        sysCode: [
          { required: true, message: '请输入终端号', trigger: 'blur' }
        ],
        sysName: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        sysQueue: [
          { required: true, message: '请输入配置序号', trigger: 'blur' }
        ],
        sysRoutekey: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        sysApi: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        payOpen: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      formInline: {
        sysCode: '',
        page: 1,
        limit: 10,
        varLable: '',
        varName: '',
        token: localStorage.getItem('logintoken')
      },
      // 删除部门
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.freshPage()
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    freshPage(){
     let _this = this;
     _this.loading = true
     //请求后台数据
     debugger
     SyncList(_this.pageparm)
     .then(res => {
       if ("0000" == res.code) {
          this.$message({
              type: 'success',
              message: '刷新成功!'
            })
            let pageSize = res.list.length
            if(_this.pageparm.pageSize < pageSize){
               _this.totalList = res.list
               _this.listData = res.list.slice(0,_this.pageparm.pageSize) 
            }else{
              _this.listData = res.list;
            }
            _this.loading = false
            _this.pageparm.total = pageSize 
          } else {
            this.$message({
              type: 'info',
              message: res.error_msg
            })
          }
     })
      .catch(() => {
          this.$message({
            type: 'info',
            message: '初次刷新失败'
          })
        })
    },
    // 搜索事件
    search() {
      debugger
      let _this = this
      _this.loading = true
      _this.loading = false
      SyncList(_this.formInline)
     .then(res => {
       if ("0000" == res.code) {
          this.$message({
              type: 'success',
              message: '查询成功!'
            })
            let pageSize = res.list.length
            if(_this.pageparm.pageSize < pageSize){
               _this.totalList = res.list
               _this.listData = res.list.slice(0,_this.pageparm.pageSize) 
            }else{
              _this.listData = res.list;
            }
            _this.loading = false
            _this.pageparm.total = pageSize 
          } else {
            this.$message({
              type: 'info',
              message: res.error_msg
            })
          }
     })
      .catch(() => {
          this.$message({
            type: 'info',
            message: '查询失败!'
          })
        })
    },
    // 分页插件事件
    callFather(parm) {
      // let currentPage = parm.currentPage % 1000 == 0 ? parm.currentPage : parm.currentPage % 1000;
      this.listData = this.totalList.slice((parm.currentPage-1) * 10,parm.currentPage * 10);
      //当翻页到最后一页，再次调用
      debugger
      if(parm.currentPage * 10 == this.pageparm.total){
        this.pageparm.currentPage = parm.currentPage + 1;
        this.freshPage();
      }
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      debugger
      this.editFormVisible = true
      let editForm = {
          sysCode: '',
          sysName: '',
          sysQueue: '',
          sysRoutekey: '',
          sysApi: '',
          sysTime: '',
          sysIndex: ''
        }
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        let editTime = this.fromatTimeStamp();
        editForm.sysCode = row.sysCode
        editForm.sysName = row.sysName
        editForm.sysQueue = row.sysQueue
        editForm.sysRoutekey = row.sysRoutekey
        editForm.sysApi = row.sysApi
        editForm.sysTime = editTime
        editForm.sysIndex = index
        this.editForm = editForm
      } else {
        this.addEditForm = JSON.parse(JSON.stringify(this.editForm));
        this.title = '添加'
        this.editForm.sysCode = ''
        this.editForm.sysName = ''
        this.editForm.sysQueue = ''
        this.editForm.sysRoutekey = ''
        this.editForm.sysApi = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      debugger
      let _this = this
      this.$refs[editData].validate(valid => {
        if (valid) {
          if('修改' == _this.title){
            SyncEdit(_this.editForm)
            .then(res => {
              _this.editFormVisible = false
              _this.loading = false
              let newData
              if ("0000" == res.code) {
                // _this.listData[_this.editForm.jobIndex] = _this.editForm
                _this.$set(_this.listData,_this.editForm.sysIndex,_this.editForm)
                _this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
              } else {
                _this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('修改失败，请稍后再试！')
            })
          }else{
             SyncAdd(_this.editForm)
            .then(res => {
              _this.editFormVisible = false
              _this.loading = false
              let newData
              if ("0000" == res.code) {
                // _this.listData[_this.editForm.jobIndex] = _this.editForm
                _this.$set(_this.listData,_this.editForm.jobIndex,_this.editForm)
                _this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
              } else {
                _this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('新增失败，请稍后再试！')
            })
          }
        } else {
          return false
        }
      })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
      this.$set(this.listData,this.addEditForm.sysIndex,this.addEditForm)
    },
    fromatTimeStamp() {
      let dt = new Date();
      var y=dt.getFullYear();
      var mt=dt.getMonth()+1;
      var day=dt.getDate();
      var h=dt.getHours();//获取时
      var m=dt.getMinutes();//获取分
      var s=dt.getSeconds();//获取秒
      return y+"-"+mt+"-"+day+' '+ h+":"+m + ":"+s;
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 