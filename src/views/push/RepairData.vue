/**
 * 订单管理 交易订单
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>接口补偿</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="唯一消息">
        <el-input class="input" size="small" v-model="formInline.msgId" placeholder="输入消息id"></el-input>
      </el-form-item>
      <el-form-item label="发起系统">
        <el-input class="input" size="small" v-model="formInline.sourceId" placeholder="原系统id"></el-input>
      </el-form-item>
      <el-form-item label="目标系统">
        <el-input class="input" size="small" v-model="formInline.targetId" placeholder="目标系统id"></el-input>
      </el-form-item>
       <el-form-item label="推送状态">
        <el-select class="input" size="small" v-model="formInline.roleId" placeholder="推送状态">
          <el-option selected label="请选择" value="0"></el-option>
          <el-option v-for="parm in rapairList" :key="parm.code" :label="parm.desc" :value="parm.code"></el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="开始时间">
          <el-date-picker size="small" v-model="startTime" type="datetime" format="yyyy-MM-ddHH:mm:ss" value-format="yyyy-MM-ddHH:mm:ss" placeholder="开始时间">
          </el-date-picker>   
      </el-form-item>
      <el-form-item label="结束时间" >
          <el-date-picker size="small" v-model="endTime" type="datetime" format="yyyy-MM-ddHH:mm:ss" value-format="yyyy-MM-ddHH:mm:ss" placeholder="结束时间">
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
      <el-table-column sortable prop="msgId" label="消息id" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="sourceId" label="源系统id" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="targetId" label="目标系统id" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="repairStat" label="补偿状态" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="msgBody" label="消息体" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="otpFlag" label="操作类型" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="sourceType" label="消息来源" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{scope.row.createTime|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="editTime" label="修改时间" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">预览</el-button> -->
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">推送</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog('editForm')">
      <el-form label-width="120px" :model="editForm" ref="editForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="消息id">
              <el-input size="small" v-model="editForm.msgId" auto-complete="off" placeholder="请输入消息id" disabled></el-input>
            </el-form-item>
            <el-form-item label="源系统id">
              <el-input size="small" v-model="editForm.sourceId" auto-complete="off" placeholder="请输入源系统id" disabled></el-input>
            </el-form-item>
            <el-form-item label="目标系统id">
              <el-input size="small" v-model="editForm.targetId" auto-complete="off" placeholder="请输入目标系统id" disabled></el-input>
            </el-form-item>
            <el-form-item label="补偿状态">
              <el-input size="small" v-model="editForm.repairStat" auto-complete="off" placeholder="请输入补偿状态" disabled></el-input>
            </el-form-item>
            <el-form-item label="消息体">
              <el-input size="small" v-model="editForm.msgBody" auto-complete="off" placeholder="请输入消息体" disabled></el-input>
            </el-form-item>
            <el-form-item label="操作类型">
              <el-input size="small" v-model="editForm.otpFlag" auto-complete="off" placeholder="请输入操作类型" disabled></el-input>
            </el-form-item>
            <el-form-item label="消息来源">
              <el-input size="small" v-model="editForm.sourceType" auto-complete="off" placeholder="请输入消息来源" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input size="small" v-model="editForm.remark" auto-complete="off" placeholder="请输入微信证书路径" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { OrderList, OrderRefund, OrderDelete } from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      payType: [
        { key: '请选择', value: 0 },
        { key: '现金', value: 1 },
        { key: '支付宝', value: 2 },
        { key: '微信', value: 3 },
        { key: 'POS通', value: 4 },
        { key: '闪付', value: 5 },
        { key: 'POS通C扫B', value: 6 },
        { key: '银联二维码', value: 8 },
        { key: '会员余额支付', value: 9 }
      ],
      payway: [
        { key: '请选择', value: 0 },
        { key: '初始化', value: 1 },
        { key: '已支付', value: 2 },
        { key: '出货成功', value: 3 },
        { key: '出货失败', value: 4 },
        { key: '订单超时', value: 5 },
        { key: '退款初始化', value: 11 },
        { key: '退款进行中', value: 12 },
        { key: '退款成功', value: 13 },
        { key: '退款失败', value: 14 },
        { key: '订单处理中', value: 10 }
      ],
      editForm: {
        msgId: '',
        targetId: '',
        sourceId: 1,
        repairStat: '',
        msgBody: '',
        otpFlag: '',
        sourceType: '',
        createTime: '',
        editTime: '',
        token: localStorage.getItem('logintoken')
      },
      formInline: {
        page: 1,
        limit: 10,
        msgId: '',
        targetId: '',
        sourceId: '',
        repairStat: '',
        msgBody: '',
        otpFlag: '',
        sourceType: '',
        createTime: '',
        editTime: '',
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
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      // 模拟数据开始
      let res = {
        code: 0,
        msg: null,
        count: 23,
        data: [
          {
            msgId: 1232131231211,
            targetId: '213213',
            sourceId: 1,
            repairStat: '成功',
            msgBody: 'cdsf:dwede,dewdew:12321',
            otpFlag: '新增',
            sourceType: '风控',
            createTime: 1526380176000,
            editTime: 1526380176000,
          },
          {
           msgId: '1232131231211',
            targetId: '213213',
            sourceId: 1,
            repairStat: '成功',
            msgBody: 'cdsf:dwede,dewdew:12321',
            otpFlag: '新增',
            sourceType: '风控',
            createTime: 1526380176000,
            editTime: 1526380176000,
          },
          {
            msgId: '1232131231211',
            targetId: '213213',
            sourceId: 1,
            repairStat: '成功',
            msgBody: 'cdsf:dwede,dewdew:12321',
            otpFlag: '新增',
            sourceType: '风控',
            createTime: 1526380176000,
            editTime: 1526380176000,
          },
          {
           msgId: '1232131231211',
            targetId: '213213',
            sourceId: 1,
            repairStat: '成功',
            msgBody: 'cdsf:dwede,dewdew:12321',
            otpFlag: '新增',
            sourceType: '风控',
            createTime: 1526380176000,
            editTime: 1526380176000,
          }         
        ]
      }
      this.loading = false
      this.listData = res.data
      this.pageparm.currentPage = this.formInline.page
      this.pageparm.pageSize = this.formInline.limit
      this.pageparm.total = res.count
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */

      // OrderList(parameter)
      //   .then(res => {
      //     this.loading = false
      //     if (res.success == false) {
      //       this.$message({
      //         type: 'info',
      //         message: res.msg
      //       })
      //     } else {
      //       this.listData = res.data
      //       // 分页赋值
      //       this.pageparm.currentPage = this.formInline.page
      //       this.pageparm.pageSize = this.formInline.limit
      //       this.pageparm.total = res.count
      //     }
      //   })
      //   .catch(err => {
      //     this.loading = false
      //     this.$message.error('菜单加载失败，请稍后再试！')
      //   })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = row
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          ConfigSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '公司保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('支付配置信息保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除公司
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ConfigDelete(row.deptId)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '公司已删除!'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('支付配置信息删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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

 
 

 