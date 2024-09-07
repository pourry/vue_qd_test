<template>
    <div class="tdiv">
      <div class="leftdiv">left</div>
      <div class="middlediv">middle</div>
      <div class="rightdiv">right</div>
    </div>
</template>

<script>
export default {
  name: 'Top',
  components: {
  }
}
</script>

<style scoped>
.tdiv {
  
  display: flex;
}
.leftdiv {
  width: 30%;
}
.middlediv {
  width: 40%;
}
.rightdiv {
  width: 30%;
}

</style>