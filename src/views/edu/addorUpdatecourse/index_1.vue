<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="提交审核"></el-step>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"></el-input>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <div class="block">
          <!--<span class="demonstration">hover 触发子菜单</span>-->
          <el-cascader
            v-model="courseInfo.subject"
            :options="subject"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"></el-cascader>
        </div>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="讲师名称">
        <el-select v-model="courseInfo.teacher" placeholder="请选择">
          <el-option
            v-for="item in teacherName"
            :key="item.name"
            :label="item.teacher"
            :value="item.teacherId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right"
                         placeholder="请填写课程的总课时数"></el-input-number>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"></tinymce>
      </el-form-item>


      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduservice/oss?token=1'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>


      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right"
                         placeholder="免费课程请设置为0元"></el-input-number>
        元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import course from "@/api/course"
  import Tinymce from '@/components/Tinymce'//富文本编辑器


  export default {

    //声明引入的组件
    components: {Tinymce},
    data() {
      return {
        active: "1",
        BASE_API: process.env.BASE_API, // 接口API地址
        courseInfo: {
          title: "",//标题
          lessonNum: "",//课程时长
          price: "",//价格
          subject: "",//分类
          teacher: "",   //讲师
          description: "", //课程简介
          cover: "static/springmvc.jpg",//课程封面
        },

        teacherName: [],//老师下拉列表数据


        subject: [], //分类下拉列表数据
      }
    },
    created() {
      this.queryTeacherName_1();
      this.querySubject();

      if (this.$route.params.id != null) {
        this.dataShow();
      }

    }
    ,
    methods: {


      //数据回显
      dataShow() {

        course.getCourse(this.$route.params.id).then(resp => {

          this.courseInfo = resp.data.courseInfo
        }).catch(resp => {


        })

      },


      //课程首页图片上传阿里云返回图片路径
      handleAvatarSuccess(resp) {

        const h = this.$createElement;
        this.$notify({
          title: '封面上传提示',
          message: h('i', { style: 'color: teal'}, '图片封面上传中,请耐心等待')
        });
        this.courseInfo.cover = resp.data.url;

      },


      //保存跳转下一步
      next() {

        if (
          this.courseInfo.title === "" ||
          this.courseInfo.subject === "" ||
          this.courseInfo.teacher === "" ||
          this.courseInfo.description === ""
        ) {
          this.$message({
            message: "请填写课程基本信息！！！",
            type: 'warning'
          });

          return false;
        }

        if (!this.$route.params.id) {
          //保存数据
          course.saveCourse(this.courseInfo).then(resp => {
            this.$router.push({path: "/course/index_2/" + resp.data.redis_key})
          }).catch(resp => {
          });

        } else {
          //更新课程基本信息
          //  alert(this.$route.params.id);
          course.updateCourse(this.courseInfo, this.$route.params.id).then(resp => {
            this.$router.push({path: "/course/index_2/" + resp.data.redis_key})
          }).catch(resp => {
          });


        }

      },

      /**
       * 获取分类的下拉列表
       */
      querySubject() {

        course.querySubject_1().then(resp => {

          this.subject = resp.data.subjects

        }).catch(resp => {

        })

      },

      //获取讲师下拉框数据
      queryTeacherName_1() {
        course.queryTeacherName().then(resp => {
          this.teacherName = resp.data.teacherInfo;
        }).catch(resp => {
        })
      }
      ,

      handleChange(value) {
        console.log(value);
      }
    }
  }


</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
