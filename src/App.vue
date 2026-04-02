<template>
  <div class="allbox">
      <div class="navigate">
        <RouterLink to="/home" class="nav-item">主页</RouterLink>
        <RouterLink to="/instore" class="nav-item">入库</RouterLink>
        <RouterLink to="/outstore" class="nav-item">出库</RouterLink>
        <RouterLink to="/store" class="nav-item">库存查询</RouterLink>
      </div>
      <div class="router-view">
          <RouterView></RouterView>
      </div>
  </div>
</template>

<script setup name="App">
  import{RouterView,RouterLink} from 'vue-router'
</script>

<style>
  .allbox{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .navigate{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15%;
    height: 100%;
    background-color: #ddf9dd; /* 浅墨绿色背景 */
    border-right: 2px solid #81c784; /* 墨绿色右边框 */
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.25);  /* 轻微阴影效果 */
  }
  .navigate .nav-item{               
    height: 17%;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    text-decoration: none;    /* 移除下划线 */
    color: #2e7d32;           /* 墨绿色文字 */
    font-weight: 500;         /* 设置字体粗细 */
    transition: all 0.3s ease; /* 添加过渡效果 */
    width: 90%;               
    margin: 8px 0;            
    border-radius: 6px;       
    border: 1px solid transparent; /* 透明边框，hover时显示 */
  }
  
  /* 悬停效果 */
  .navigate .nav-item:hover{
    background-color: #c8e6c9; /* 稍深的墨绿色背景 */
    border-color: #81c784;     /* 墨绿色边框 */
    color: #1b5e20;            /* 深墨绿色文字 */
    transform: translateX(4px); /* 轻微右移效果 */
  }
  
  /* 激活状态效果 */
  .navigate .nav-item.router-link-active{
    background-color: #81c784; /* 更深的墨绿色背景 */
    border-color: #4caf50;     /* 深墨绿色边框 */
    color: white;              /* 白色文字 */
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3); /* 绿色阴影 */
  }
  .router-view{
    position: relative;
    background-color: #ddf9dd;
    width: 85%;
    height: 100%;
  }
</style>