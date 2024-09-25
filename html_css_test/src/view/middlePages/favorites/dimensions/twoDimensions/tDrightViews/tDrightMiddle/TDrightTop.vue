<template>
    <div class='tdrighttopcss'>
      <el-row :gutter="20" style='margin:0'>
        <el-col :span="6">1</el-col>
        <el-col :span="6">2</el-col>
        <el-col :span="6">3</el-col>
        <el-col :span="6">
                      <el-input
            v-model="input1"
            class="w-50 m-2"
            size="large"
            placeholder="请输入"
            :suffix-icon="Search"
            />
        </el-col>
      </el-row>

    </div>
</template>

<script>

export default {
  name: 'TDrightTop',
  components: {
  }
}
</script>

<style scoped>
.tdrighttopcss{ 
    width:100%;
    height:100%;
    position:relative;
}
.el-row {
  width:100%;
  position:absolute;
  bottom:10%;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
  border: solid green 1px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>