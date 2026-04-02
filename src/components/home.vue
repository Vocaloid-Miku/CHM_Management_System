<template>
  <div class="home-box">
    <h2>中草药库存管理系统</h2>
    <img src="/src/assets/img/naxida.png">  
    <p>
      by cemo
      <br>
      微信:ETHMiku
    </p>
  </div>
  
</template>

<script setup name="home">

</script>

<style scoped>
  .home-box{
    position: relative;
    height: 100%;
    width: 100%;
  } 
  h2{
    height: auto;
    width: auto;
    color: #2e7d32;
    font-size: 60px;
    font-weight: 700;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img{
    position: absolute;
    left: 25%;
    top: 100%;
    width: 25%;
    height: auto;
    transform: translate(-100%, -100%);
  }
  p{
    position: absolute;
    transform: translate(-100%, -100%);
    font-size: 20px;
    font-weight: 500;
    color: #2e7d32;
    top: 90%;
    left: 90%;
    width: auto;
    height: auto;
  }
</style>