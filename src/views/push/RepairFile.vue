/**
 * 订单管理 交易订单
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件补偿</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="文件批次">
        <el-input class="input" size="small" v-model="formInline.batchId" placeholder="批次号"></el-input>
      </el-form-item>
      <el-form-item label="目标系统">
        <el-input class="input" size="small" v-model="formInline.targetId" placeholder="目标系统id"></el-input>
      </el-form-item>
      <el-form-item label="文件路径">
        <el-input class="input" size="small" v-model="formInline.filePath" placeholder="文件路径"></el-input>
      </el-form-item>
      <el-form-item label="推送状态">
        <el-select class="input" size="small" v-model="formInline.pushStat" placeholder="推送状态">
          <el-option selected label="请选择" value="0"></el-option>
          <el-option v-for="parm in rapairList" :key="parm.code" :label="parm.desc" :value="parm.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
          <el-date-picker size="small" v-model="formInline.createTime" type="datetime" format="yyyy-MM-ddHH:mm:ss" value-format="yyyy-MM-ddHH:mm:ss" placeholder="开始时间">
          </el-date-picker>   
      </el-form-item>
      <el-form-item label="结束时间" >
          <el-date-picker size="small" v-model="formInline.editTime" type="datetime" format="yyyy-MM-ddHH:mm:ss" value-format="yyyy-MM-ddHH:mm:ss" placeholder="结束时间">
          </el-date-picker>   
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="batchId" label="批次号" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="targetId" label="目标系统id" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="filePath" label="文件路径" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="pushStat" label="推送状态" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="document" label="文件摘要" width="140" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column sortable prop="transType" label="推送状态" width="120" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column sortable prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          <div>{{scope.row.createTime|timestampToTime}}</div>
        </template> -->
      </el-table-column>
      <el-table-column sortable prop="editTime" label="修改时间" width="180" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template> -->
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">预览</el-button>
          <el-button size="mini" type="danger" @click="pushData(scope.$index, scope.row)">推送</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog('editForm')">
      <el-form label-width="100px" :model="editForm" ref="editForm">
        <el-row>
          <el-col :span="22">
            <el-form-item label="批次号">
              <el-input size="small" v-model="editForm.batchId" auto-complete="off" placeholder="请输入批次号" disabled></el-input>
            </el-form-item>
            <el-form-item label="目标系统">
              <el-input size="small" v-model="editForm.targetId" auto-complete="off" placeholder="请输入目标系统" disabled></el-input>
            </el-form-item>
            <el-form-item label="文件路径">
              <el-input size="small" v-model="editForm.filePath" auto-complete="off" placeholder="请输入文件路径" disabled></el-input>
            </el-form-item>
            <el-form-item label="推送状态">
              <el-input size="small" v-model="editForm.pushStat" auto-complete="off" placeholder="请输入推送状态" disabled></el-input>
            </el-form-item>
            <el-form-item label="文件摘要">
              <el-input size="small" v-model="editForm.document" auto-complete="off" placeholder="请输入文件摘要" disabled></el-input>
            </el-form-item>
          </el-col> 
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { RepairDataEdit,RepairDataList} from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      editForm: {
        batchId: '',
        targetId: '',
        filePath: '',
        pushStat: '',
        document: '',
        createTime: '',
        editTime: '',
        token: localStorage.getItem('logintoken')
      },
      formInline: {
        batchId: '',
        targetId: '',
        filePath: '',
        pushStat: '',
        document: '',
        createTime: '',
        editTime: '',
        orderStatus: 0,
        token: localStorage.getItem('logintoken')
      },
      // 删除部门
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      rapairList: [
        {code: '0', desc: '成功'},
        {code: '1', desc: '失败'}
      ],
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      startTime: null,
      endTime: null,
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
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
    //第一次进入刷新页面
    freshPage(){
     let _this = this;
     _this.loading = true
     //请求后台数据
     debugger
     _this.pageparm.repairType = 0
     RepairDataList(_this.pageparm)
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
    // 获取公司列表
    getdata(formInline) {
      debugger
      let _this = this
      _this.loading = true
      formInline.pageparm = this.pageparm;
      formInline.repairType = 0;
      this.loading = false
      RepairDataList(formInline)
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
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示预览界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = row
    },
    // 重新推送
    pushData(index, row) {
      debugger
      row.repairType = 0
      this.$confirm('确定要推送吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          RepairDataList(row)
            .then(res => {
              if ("0000" == res.code) {
                this.$message({
                  type: 'success',
                  message: '推送成功!'
                })
                row.pushStat = 2
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('推送失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推送'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(formName) {
      this.editFormVisible = false
      this.$refs[formName].resetFields()
    },
    beginDate(){
      const self = this
      return {
        disabledDate(time){
          if (self.form.endTime) {  //如果结束时间不为空，则小于结束时间
            return new Date(self.form.endTime).getTime() < time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    processDate() {
      const  self = this
      return {
        disabledDate(time) {
          if (self.form.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.form.startTime).getTime() > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
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
.input {
  width: 220px;
  height: 41px;
}
</style>

 
 

 