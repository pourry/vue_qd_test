<template>
    <div class='tdrightbottomcss'>

        <div >
            <el-pagination 
            v-model:currentPage="pagemsg.msg.currentPage"
            v-model:page-size="pagemsg.msg.pageSize"
            :page-sizes="[10, 50, 100, 200]"
            :small="small"
            :disabled="disabled"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagemsg.msg.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
        </div>
        
    </div>
</template>

<script>
import {ref,reactive,onMounted} from 'vue'
export default {
  name: 'TDrightBottom',
  components: {
  },
  props:{
    pagemsg:{
      type:Object,
      required: true
    }
  },
  emits:["togetList"],
  setup(props,{emit}){
    let pagemsg = reactive(props.pagemsg);
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const handleSizeChange = (number) => {
      pagemsg.animation.pageSize = number;
      
      emit("togetList",pagemsg.animation);
    }
    const handleCurrentChange = (number) => {
      pagemsg.animation.pageNumber = number;
      console.log("123333333",pagemsg.animation)
      emit("togetList",pagemsg.animation);
    }
    onMounted(()=>{
    })
    return{small,background,disabled,
        handleCurrentChange,handleSizeChange,pagemsg}
  }
}
</script>

<style scoped>
.tdrightbottomcss{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--theme-bg-card);
    padding: var(--theme-spacing-sm);
    border-top: 1px solid var(--theme-border);
}
.paginationcss{
    
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
::v-deep .el-pagination__total{
  color: var(--theme-text-regular);
}
::v-deep .el-pagination__jump{
  color: var(--theme-text-regular);
}
::v-deep .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
  background-color: var(--theme-primary);
}
::v-deep .el-pagination.is-background .btn-next,
::v-deep .el-pagination.is-background .btn-prev,
::v-deep .el-pagination.is-background .el-pager li {
  background-color: var(--theme-bg-middle);
  color: var(--theme-text-regular);
}
::v-deep .el-pagination.is-background .btn-next:hover,
::v-deep .el-pagination.is-background .btn-prev:hover,
::v-deep .el-pagination.is-background .el-pager li:hover {
  color: var(--theme-primary);
}

</style>