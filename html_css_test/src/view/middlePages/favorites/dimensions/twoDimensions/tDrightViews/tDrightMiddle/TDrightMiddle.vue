<template>
    <div class='tdrightmiddlecss'>
      <div>
         <div>1</div> 
         <div>2</div> 
         <div>3</div> 
         <div>4</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
         <div>5</div> 
      </div>

    </div>
</template>

<script>
export default {
  name: 'TDrightMiddle',
  components: {
  }
}
</script>

<style scoped>
.tdrightmiddlecss{
   height:100%;
   width:100%;
}
.tdrightmiddlecss >div{
   border:solid red 1px;
   display:flex;
   flex-wrap: wrap;
   align-content: flex-start;
   justify-content: center;   /* 居中对齐 */
   height:100%;
   width:100%;
   overflow:auto;
   
}
.tdrightmiddlecss >div >div{
   border:solid green 1px;
   height:25%;
   width:20rem;
}


</style>