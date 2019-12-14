<template>
  <div class="app-container">

    <!--查询表单-->

    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="queryconditon" placeholder="课程名"></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
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

      <el-table-column prop="title" label="课程标题"></el-table-column>


      <el-table-column prop="teacher" label="讲师" width="80"></el-table-column>
      <!--<el-table-column prop="intro" label="课时数" width="60"></el-table-column>-->
      <el-table-column prop="price" label="价格" width="80"></el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="100"></el-table-column>
      <el-table-column prop="buyCount" label="购买人数" width="100"></el-table-column>
      <el-table-column prop="viewCount" label="浏览人数" width="100"></el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"></el-table-column>


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
      @current-change="getCourseList"
    >
    </el-pagination>

  </div>


</template>


<script>
  /*引入teacher.js组件并取名为teacher*/
  import chourse_api from '@/api/course'


  export default {
    /*组件初始化Vue属性初始值*/
    data() {
      return {
        listLoading: false, // 是否显示loading信息
        page: 1,//第几页
        limit: 8,//每页多少条
        total: 0,//总计录数
        list: [],//页面数据展示

        // title:"1",
        // description:"1",
        // price:"1",
        // lesson_num:"1",
        // buy_count:"1",
        // view_count:"1",
        // gmt_create:"1",

        queryconditon: "",//查询条件
        visible: false
      }
    },

    //页面渲染数据之前调用
    created() {
      this.getCourseList()
    },
    //定义方法
    methods: {


      removeDataById(id) {


        this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chourse_api.deleteCourse(id).then(resp => {

            this.$message({
              message: '删除成功！！！',
              type: 'success'
            });

            this.getCourseList(1);
          }).catch(resp => {

          })
          // alert(id)


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },


      resetData() {
        this.queryconditon = "";
        this.getCourseList();
      },

      //c查询数据
      getCourseList(page = 1) {
        this.listLoading = true;
        this.page = page;

        chourse_api.queryCoursePageList(this.page, this.limit, this.queryconditon).then(resp => {

          //讲师数据显示
          for (const respElement of resp.data.course) {


            for (const argument of resp.data.teacher) {


              if (respElement.teacherId === argument.id) {

                respElement.teacher = argument.name;

                break;
              }


            }

          }


          this.list = resp.data.course;
          this.total = resp.data.total;
          console.log(this.list);
          this.listLoading = false;


        }).catch(resp => {

        })

      }


    }

  }

</script>
