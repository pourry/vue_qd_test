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
  color: white;
}
::v-deep .el-pagination__jump{
  color: white;
}

</style>