<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="提交审核"></el-step>
    </el-steps>


    <el-button type="primary" @click="shwoChapterFrom">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="(chapter,index) in chapterNestedList"
        :key="chapter.id">

        <p>
          第{{index+1}}章:{{ chapter.title }}

          <span class="acts">
            <!--<el-button style="" type="primary" @click="alert('sadasd')">编辑</el-button>-->
            <el-button type="primary" @click="showAddVideoForm(chapter.id)">添加课时</el-button>
           <el-button type="primary" icon="el-icon-edit" @click="updateChapter(chapter)" circle></el-button>
           <el-button type="danger" icon="el-icon-delete" @click="deleteChapter(chapter.id)" circle></el-button>
          </span>
        </p>


        <!-- 视频,小节 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.chapters "
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="primary" icon="el-icon-edit" @click="showUpdateVideo(video,chapter.id)"
                           circle></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteVideo(video.id)" circle></el-button>
                <!--<el-button type="text">编辑</el-button>-->
                <!--<el-button type="text">删除</el-button>-->
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="last">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>


    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"></el-input>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenChapter">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 添加更新小结表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title"></el-input>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :before-upload="handleUpload"
            :file-list="fileList"
            :action="BASE_API+'/videoService/vod/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>

        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenVideo">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo()">确 定</el-button>
      </div>
    </el-dialog>


  </div>


</template>

<script>
  import course from "@/api/course"
  import chapter_api from "@/api/chapter"
  import video_api from "@/api/video"


  export default {

    data() {
      return {
        fileList: [],
        BASE_API: process.env.BASE_API,
        falg: "",//1新增 2更新
        active: "2",
        chapterNestedList: [], //所有章节数据
        dialogChapterFormVisible: false,//添加章节表单
        chapter: {
          title: "",
          sort: "",
          id: "",
          videoId: ""
        },//章节对象

        chapter_redis_key: "qqqq",//redis存储章节的key


        //########################以上章节数据#############################


        //#################小节数据##############

        dialogVideoFormVisible: false,
        video: {
          title: "",
          sort: "",
          id: "",
          videoId: "",
          fileName: ""
        },
        chapterId: "",//章节id

        chapter_video_key: "",  //章节redis存储key值


      }
    },
    created() {
      //获取redis的key
      this.getsubjectID();


    },
    methods: {

      //上传前文件显示
      handleUpload(file) {

        if (file.size > 1024 * 1024 * 1024) {
          this.$message({
            message: '文件太大,只能上传1G视频',
            type: 'warning'
          });

          return false;
        }

      },
      //上传视频
      handleVodUploadSuccess(resp, file, files) {
        this.video.fileName = file.name;
        console.log(file);
        this.video.videoId = resp.data.videoId;

      },


      //删除视频
      handleVodRemove(file, files) {

        video_api.deleteAliyunVideo(this.video.videoId).then(resp=>{

          this.fileList = [];
          this.video.fileName = "";
          this.video.videoId="";

        }).catch(resp=>{
          this.fileList = [];
          this.video.fileName = "";
          this.video.videoId="";

        });


        // alert(this.video.videoId);


      },


      //**************小节数据**************
      //更新小节
      hiddenVideo() {

        this.getChapter_1();
        this.dialogVideoFormVisible = false;

      },

      //小节数据回显
      showUpdateVideo(video, chapterId) {
        this.falg = "2";
        this.chapterId = chapterId;
        this.video = video;


        if (video.fileName) {
          this.fileList = [{'name': video.fileName}];

        }

        console.log(this.video);
        this.dialogVideoFormVisible = true;

      },


      //删除小节
      deleteVideo(id) {

        this.$confirm('此操作将永久删除课程小节！！！, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video_api.deleteVideo_web(this.chapter_video_key, id).then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.chapterNestedList = resp.data.chapterList;
          }).catch(resp => {

          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },

      //显示条件小节表单并获取章节id
      showAddVideoForm(id) {
        this.fileList = [];
        this.falg = "1";
        this.chapterId = id;

        this.video.title = "";
        this.video.id = "";
        this.video.sort = "";
        this.dialogVideoFormVisible = true;
      },


      //章节数据存储
      saveOrUpdateVideo() {

        if (this.video.title) {
          if (this.falg === "1") {
            //保存小节
            video_api.addviDeo(this.chapter_video_key, this.video, this.chapterId).then(resp => {


              //课程名重复
              if (resp.data.error) {
                this.$message({
                  message: resp.data.error,
                  type: 'warning'
                });

              } else {
                this.chapterNestedList = resp.data.info

              }
              this.video.id = "";
              this.video.sort = "";
              this.video.title = "";
              this.dialogVideoFormVisible = false;


            }).catch(resp => {
              //TODO

            })
          } else {
            //更新小节
            // alert("qqq")
            video_api.updateVideo_web(this.chapter_video_key, this.video, this.chapterId).then(resp => {
              //课程名重复
              if (resp.data.error) {
                this.$message({
                  message: resp.data.error,
                  type: 'warning'
                });

              }
              this.chapterNestedList = resp.data.info
              this.video.id = "";
              this.video.sort = "";
              this.video.title = "";
              this.dialogVideoFormVisible = false;

            }).catch(resp => {

              //TODO
            })

          }
        } else {
          this.$message({
            message: '请输入课程小节！！！',
            type: 'warning'
          });

        }


      },


      //*****************************章节数据*********************************

      hiddenChapter() {


        this.getChapter_1();

        this.dialogChapterFormVisible = false

      },

      //更新章节数据,数据表单回显
      updateChapter(chapter) {


        this.falg = "2";
        this.chapter = chapter;
        this.dialogChapterFormVisible = true;

        console.log(this.chapter);

      }
      ,


      //添加章节
      saveOrUpdate() {
        if (this.chapter.title) {
          if (this.falg === "1") {

            console.log(this.chapter);
            //添加章节
            chapter_api.addChaper(this.$route.params.id + "_" + this.chapter_redis_key, this.chapter.title, this.chapter.sort).then(resp => {
              //清空数据
              this.chapter.sort = "";
              this.chapter.title = "";
              this.chapter.id = "";

              this.chapterNestedList = resp.data.chapterList

              this.dialogChapterFormVisible = false
            }).catch(resp => {

            })

          } else {
            //更新章节
            // console.log(this.chapter);

            chapter_api.updateChapter_web(this.$route.params.id + "_" + this.chapter_redis_key,
              this.chapter.title,
              this.chapter.sort, this.chapter.id).then(resp => {
              //清空数据
              this.chapter.sort = "";
              this.chapter.title = "";
              this.chapter.id = "";

              this.chapterNestedList = resp.data.chapterList

              this.dialogChapterFormVisible = false


            }).catch(resp => {
              //TODO

            });


          }
        } else {

          this.$message({
            message: '请输入课程章节！！！',
            type: 'warning'
          });

        }


      }
      ,

      //删除章节
      deleteChapter(id) {

        this.$confirm('此操作将永久删除该课程章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter_api.deleteChapter_web(this.$route.params.id + "_" + this.chapter_redis_key, id).then(resp => {
            //TODO
            this.chapterNestedList = resp.data.chapterList
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

          }).catch(resp => {

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
      ,


      //获取章节数据
      getChapter_1() {
        chapter_api.getChapter(this.$route.params.id + "_" + this.chapter_redis_key).then(resp => {


          this.chapterNestedList = resp.data.chapterList
          console.log("---------------")
          console.log(this.chapterNestedList)
        }).catch(resp => {

          //  TODO
        })

      }
      ,


      //获取分类id
      getsubjectID() {

        chapter_api.getSubjectId(this.$route.params.id).then(resp => {

          this.chapter_redis_key = resp.data.subjectId;


          this.chapter_video_key = this.$route.params.id + "_" + this.chapter_redis_key;

          // alert(this.chapter_video_key)
          // alert(this.chapter_redis_key);
          //获取章节数
          this.getChapter_1();

        }).catch(resp => {

        })
      },


      //新增小节数据表单清空
      shwoChapterFrom() {

        this.chapter.sort = "";
        this.chapter.title = "";
        this.chapter.id = "";

        this.falg = "1";

        this.fileList = [];
        this.dialogChapterFormVisible = true;

      },


      next() {
        this.$router.push({path: "/course/index_3/" + this.$route.params.id})
      }
      ,
      last() {
        this.$router.push({path: "/course/index_1/" + this.$route.params.id})
      }
    }


  }


</script>


<style scoped>
  .chanpterList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #div_1 {
    font-size: 50px;
    border: 2px solid #8b8b8b;

  }

  .chanpterList li {
    position: relative;
  }

  .chanpterList p {
    /*float: left;*/
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }

  /*#div_1{*/
  /*!*float: left;*!*/
  /*font-size: 20px;*/
  /*margin: 10px 0;*/
  /*padding: 10px;*/
  /*height: 70px;*/
  /*line-height: 50px;*/
  /*width: 100%;*/
  /*border: 1px solid #DDD;*/
  /*}*/

  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList {
    padding-left: 50px;
  }

  /*.videoList p {*/
  /*float: left;*/
  /*font-size: 14px;*/
  /*margin: 10px 0;*/
  /*padding: 10px;*/
  /*height: 50px;*/
  /*line-height: 30px;*/
  /*width: 100%;*/
  /*border: 1px dotted #DDD;*/
  /*}*/

</style>
