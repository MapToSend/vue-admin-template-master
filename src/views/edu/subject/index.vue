<template>
  <div class="app-container">
    <el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"
             :expand-on-click-node=false>
       <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => append(data)">添加</el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendLevelOne()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import subject from "@/api/subject"

  export default {
    data() {
      return {
        dialogFormVisible: false,
        subject: {
          title: "",
          parent_title: ""
        },
        data: []
      }
    },
    created() {
      this.querySubject()

    },
    methods: {

      //添加一级课程
      appendLevelOne() {

        subject.saveOneSubject(this.subject).then(resp => {
          console.log(resp);

          if (resp.code === 20000) {
            this.$message({
              type: 'success',
              message: resp.data.info
            });
          }
          this.querySubject();
          this.dialogFormVisible = false;
          this.subject.title = ""
        }).catch(resp => {

          console.log(resp);
          this.$message.error("该课程以存在！！！");

          this.dialogFormVisible = false;
          this.subject.title = ""

        })
      },

      //添加二级课程
      append(data) {
        console.log(data);
        this.subject.parent_title = data.label;
        this.dialogFormVisible = true;
        //subject.saveTwoSubject(data.label).then(()=>{


      },


      //删除课程
      remove(node, data) {

        this.$confirm('此操作将永久删除课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          subject.deleteSubject(data.label).then(resp => {

            this.$router.push({path: "/subject/list"});
            this.querySubject();
            // this.$router.go(0)
            if (resp.code === 20000) {
              this.$message({
                type: 'success',
                message: "删除成功！！！"
              });

            }
          }).catch(resp => {

            this.$message.error("删除失败！！！");

            this.$router.push({path: "/subject/list"})

          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },


      //加载节点数据
      querySubject() {

        subject.querySubjectTree().then(resp => {
          console.log(resp);
          this.data = resp.data.subjectLists;

        }).catch(() => {

        })
      }

    }


  };
</script>
