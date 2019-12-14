<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"></el-input>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"></el-option>
          <el-option :value="2" label="首席讲师"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"></el-input>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"></el-input>
      </el-form-item>
      <!--讲师头像：TODO-->
      <!--讲师头像-->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"></pan-thumb>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="showImg()">更换头像
        </el-button>

        <!--上传文件框-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduservice/oss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"></image-cropper>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">提交</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
  /*引入teacher.js组件并取名为teacher*/
  import teacherApp from '@/api/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    //添加组件
    components: {
      ImageCropper,
      PanThumb
    },
    data() {
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
        teacher: {},
        BASE_API: process.env.BASE_API, // 接口API地址
      }
    },
    watch: {

      $route(to, from) {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {


      //数据初始化
      init() {

        if (this.$route.params.id != null) {
          this.show();

        } else {
          this.teacher = {};
        }

      },


      //上传成功
      cropSuccess(data) {


        this.teacher.avatar = data.url;
        this.imagecropperShow = false;
        this.imagecropperKey++

      },
      //隐藏文件上传文件框
      close() {
        this.imagecropperShow = false;
        this.imagecropperKey++
      },
      //显示上传文件框
      showImg() {
        this.imagecropperShow = true;
      },


      //数据回显
      show() {

        let id = this.$route.params.id;
        teacherApp.queryTeacherById(id).then(resp => {
          this.teacher = resp.data.tea;
        }).catch(resp => {

        })

      },


      saveOrUpdate() {
        if (this.$route.params.id) {
          this.update()
        } else {
          this.save()
        }


      },

      //添加用户
      save() {

        if(this.teacher.name){
          teacherApp.save(this.teacher).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.$router.push({path: "/teacher/list"})

          }).catch(() => {
            this.$message.error('用户名被使用！！！');
          })

        }else {
          this.$message.error('用户名不能为空！！！');
        }



      },


      //更新讲师
      update() {

        teacherApp.updateTeacher(this.teacher).then(resp => {
          this.$message({
            message: '更新成功',
            type: 'success'
          });
          this.$router.push({path: "/teacher"})

        }).catch(() => {
          this.$message.error('更新失败，请稍后再试！！！');
        })

      }

    }

  }
</script>
