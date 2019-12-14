<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a href="/static/课程表.xls">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/upload'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>


  export default {

    data(){
      return{
        fileUploadBtnText:"上传",
        BASE_API:process.env.BASE_API,
        importBtnDisabled:false,//上传文件禁用
        loading:false,//懒加载
      }
    },
    created(){


    },

    methods:{

      //提交表单
      submitUpload(){
        this.importBtnDisabled=true;
        this.loading=true;
        this.$refs.upload.submit();


      },

      //上传成功调用方法
      fileUploadSuccess(data){
        this.importBtnDisabled=false;
        this.loading=false;

        this.$message({
          message: data.data.success,
          type: 'success'
        });


        //上传成功跳转到分类列表
        this.$router.push({path:"/subject/list"})
      },
      //上传失败调用方法
      fileUploadError(data){
        this.importBtnDisabled=false;
        this.load=false;
        console.log(data);
        this.$message.error(data.data.error);

      }



    }


  }



</script>
