<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>


    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ coursePublish.teacher }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>


    <el-form label-width="120px">
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="last">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="submitChapter">发布课程</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>

  import coursePublish from "@/api/coursePublish"


  export default {

    data() {
      return {
        active: "3",
        coursePublish: {
          cover: "/static/springmvc.jpg",
          title: "aaa",
          lessonNum: "aaa",
          subjectLevelOne: "aaa",
          subjectLevelTwo: "aaa",
          teacher: "aaa",
          price: "aaa"
        },

        courseId: ""


      }
    },
    created() {

      this.getChapterInfo();
    },
    methods: {

      //课程数据全体提交
      submitChapter() {
        coursePublish.submitChapter(this.$route.params.id+"_"+this.courseId).then(resp => {
      
          if (resp.data.error){
            this.$message.error('该课程名已存在！！！！');
          }

          this.$router.push({path:"/course/list"})


        }).catch(resp => {


        })

      },

      //获取数据展示
      getChapterInfo() {
        coursePublish.getChapterInfo_web(this.$route.params.id).then(resp => {

          console.log(resp.data.chapterInfo);
          this.coursePublish.subjectLevelOne = resp.data.chapterInfo.subject[0];
          this.coursePublish.subjectLevelTwo = resp.data.chapterInfo.subject[1];
          this.coursePublish.cover = resp.data.chapterInfo.cover;
          this.coursePublish.title = resp.data.chapterInfo.title;
          this.coursePublish.lessonNum = resp.data.chapterInfo.lessonNum;
          this.coursePublish.teacher = resp.data.chapterInfo.teacher;
          this.coursePublish.price = resp.data.chapterInfo.price;


          this.courseId = resp.data.courseId;
        }).catch(resp => {
          //TODO

        })
      },

      last() {
        this.$router.push({path: "/course/index_2/" + this.$route.params.id})
      }

    }


  }


</script>

<style scoped>
  .ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
  }

  .ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
  }

  .ccInfo .main {
    margin-left: 520px;
  }

  .ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
  }

  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }

  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }

  .ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
  }
</style>
