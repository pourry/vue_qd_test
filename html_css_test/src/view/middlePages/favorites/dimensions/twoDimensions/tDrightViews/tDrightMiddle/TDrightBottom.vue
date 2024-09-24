<template>
    <div class='tdrightbottomcss'>

        <div class="paginationcss">
            <el-pagination
            v-model:currentPage="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
        </div>
        
    </div>
</template>

<script>
import {ref} from 'vue'
export default {
  name: 'TDrightBottom',
  components: {
  },
  setup(){
    const currentPage1 = ref(5)
    const currentPage2 = ref(5)
    const currentPage3 = ref(5)
    const currentPage4 = ref(4)
    const pageSize2 = ref(100)
    const pageSize3 = ref(100)
    const pageSize4 = ref(100)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const handleSizeChange = (number) => {
    console.log(`${number} items per page`)
    }
    const handleCurrentChange = (number) => {
    console.log(`current page: ${number}`)
    }
    return{
        currentPage1,currentPage2,currentPage3,currentPage4,
        pageSize2,pageSize3,pageSize4,small,background,disabled,
        handleCurrentChange,handleSizeChange}
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
</style>