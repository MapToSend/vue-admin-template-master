<template>
  <div class="app-container">

    <!--查询表单-->

    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="objCondition.name" placeholder="讲师名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="objCondition.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"></el-option>
          <el-option :value="2" label="首席讲师"></el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getTeacher()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 页面讲师展示 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80"></el-table-column>

      <el-table-column prop="level" label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历"></el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"></el-table-column>

      <el-table-column prop="sort" label="排序" width="60"></el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/update/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
          </el-button>


        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="padding: 30px 0; text-align: center;"
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="limit"
      @current-change="getTeacher"
    >

    </el-pagination>
  </div>


</template>


<script>
  /*引入teacher.js组件并取名为teacher*/
  import teacher from '@/api/teacher'


  export default {
    /*组件初始化Vue属性初始值*/
    data() {
      return {
        listLoading: true, // 是否显示loading信息
        page: 1,//第几页
        limit: 8,//每页多少条
        total: 0,//总计录数
        list: null,//页面数据展示
        objCondition: {},//查询条件
        visible: false
      }
    },

    //页面渲染数据之前调用
    created() {
      this.getTeacher()
    },
    //定义方法
    methods: {




      //获取带条件查询老师
      getTeacher(page = 1) {
        this.listLoading = true;
        this.page = page;

        console.log(this.objCondition);
        teacher.queryTeacherPageList(this.page, this.limit, this.objCondition)
          .then(response => {
            //请求成功执行then
            this.list = response.data.teachers;
            this.total = response.data.total;
            console.log(this.list)
            console.log(this.total)
            this.listLoading = false;
          })
          .catch(response => {
            //请求失败执行catch
            console.log(response)

          })
      },

      //清空条件并查询所有
      resetData() {

        this.objCondition = {};
        this.getTeacher();

      },

      //根据id删除讲师
      removeDataById(id) {

        this.$confirm('此操作将永久删除老师信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          teacher.deleteTeacherById(id)
            .then(resp => {
              this.getTeacher();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

            }).catch(resp => {

            this.$message({
              type: 'info',
              message: '删除失败!'
            });
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      }

    }

  }

</script>
