/**
 * 支付管理 支付配置信息
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>跑批信息配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item>
        <el-input size="small" v-model="formInline.jobId" placeholder="输入任务id"></el-input>
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
      <el-table-column sortable prop="jobId" label="任务id" width="200">
      </el-table-column>
      <el-table-column sortable prop="jobDesc" label="跑批描述" width="200">
      </el-table-column>
      <el-table-column sortable prop="jobCron" label="时间规则" width="200">
      </el-table-column>
      <el-table-column sortable prop="jobPath" label="类路径" width="200">
      </el-table-column>
      <el-table-column sortable prop="jobStat" label="状态" width="200">
      </el-table-column>
      <el-table-column sortable prop="jobTime" label="修改时间" width="200">
        <!-- <template slot-scope="scope"> -->
          <!-- <div>{{scope.row.editTime|timestampToTime}}</div>
          </el-switch> -->
        <!-- </template>  -->
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
        <el-form-item label="任务id" prop="jobId">
          <el-input size="small"  v-model="editForm.jobId" auto-complete="off" placeholder="任务id"></el-input>
        </el-form-item>
        <el-form-item label="跑批描述" prop="jobDesc">
          <el-input size="small" v-model="editForm.jobDesc" auto-complete="off" placeholder="跑批描述"></el-input>
        </el-form-item>
        <el-form-item label="时间规则" prop="jobCron">
          <el-input size="small" v-model="editForm.jobCron" auto-complete="off" placeholder="时间规则"></el-input>
        </el-form-item>
        <el-form-item label="类路径" prop="jobPath">
          <el-input size="small" v-model="editForm.jobPath" auto-complete="off" placeholder="类路径"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="jobStat">
          <el-select size="small" v-model="editForm.jobStat" placeholder="请选择" class="userRole">
            <el-option label="正常" value="T"></el-option>
            <el-option label="禁用" value="N"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  TaskList,
  TaskEdit,
  TaskAdd,
} from '../../api/payMG'
import Pagination from '../../components/Pagination'
// import fromatTimeStamp from '../utils/util'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      // isRouterAlive: true, //列表显示关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        jobId: '',
        jobDesc: '',
        jobCron: '',
        jobPath: '',
        jobStat: '',
        jobTime: '',
        token: localStorage.getItem('logintoken')
      },
      addEditForm: {
        jobId: '',
        jobDesc: '',
        jobCron: '',
        jobPath: '',
        jobStat: '',
        jobTime: '',
        jobIndex: '',
        token: localStorage.getItem('logintoken')
      },
      // rules表单验证
      rules: {
        jobId: [
          { required: true, message: '请输入终端号', trigger: 'blur' }
        ],
        jobDesc: [
          { required: true, message: '请输入终端号', trigger: 'blur' }
        ],
        jobCron: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        jobPath: [
          { required: true, message: '请输入配置序号', trigger: 'blur' }
        ],
        jobStat: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      formInline: {
        jobId: '',
        page: 1,
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
        total: 0
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
     TaskList(_this.pageparm)
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
      TaskList(_this.formInline)
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
            jobId: '',
            jobDesc: '',
            jobCron: '',
            jobPath: '',
            jobStat: '',
            jobTime: '',
            jobIndex: ''
        }
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        let editTime = this.fromatTimeStamp();
        editForm.jobId = row.jobId
        editForm.jobDesc = row.jobDesc
        editForm.jobCron = row.jobCron
        editForm.jobPath = row.jobPath
        editForm.jobStat = row.jobStat
        editForm.jobTime = editTime
        editForm.jobIndex = index
        this.editForm = editForm
      } else {
        this.addEditForm = JSON.parse(JSON.stringify(this.editForm));
        this.title = '添加'
        this.editForm.jobId = ''
        this.editForm.jobDesc = ''
        this.editForm.jobCron = ''
        this.editForm.jobPath = ''
        this.editForm.jobStat = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      debugger
      let _this = this
      this.$refs[editData].validate(valid => {
        if (valid) {
          if('修改' == _this.title){
            TaskEdit(_this.editForm)
            .then(res => {
              _this.editFormVisible = false
              _this.loading = false
              let newData
              if ("0000" == res.code) {
                // _this.listData[_this.editForm.jobIndex] = _this.editForm
                _this.$set(_this.listData,_this.editForm.jobIndex,_this.editForm)
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
             TaskAdd(_this.editForm)
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
      this.$set(this.listData,this.addEditForm.jobIndex,this.addEditForm)
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

 
 