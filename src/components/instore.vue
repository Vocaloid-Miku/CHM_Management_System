<template>
  <div class="container">
    <div class="table-container">
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>品名</th>
              <th>入库价</th>
              <th>毛利率</th>
              <th>出库价</th>
              <th>库存(克)</th>
              <th>入库时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.inputprice }}</td>
              <td>{{ item.rate }}</td>
              <td>{{ item.outputprice }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="input">
      <div class="input-group">
        <label>品名</label>
        <input ref="nameInput" type="text" v-model="newlist.name" @input="handleNameInput" @keyup.enter="focusInputPrice">
      </div>
      <div class="input-group">
        <label>入库价</label>
        <input ref="inputPriceInput" type="text" v-model="newlist.inputprice" @keyup.enter="focusRate">
      </div>
      <div class="input-group">
        <label>出库倍率</label>
        <input ref="rateInput" type="text" v-model="newlist.rate" @keyup.enter="focusCount">
      </div>
      <div class="input-group">
        <label>出库价</label>
        <input type="text" v-model="newlist.outputprice" disabled>
      </div>
      <div class="input-group">
        <label>库存(克)</label>
        <input ref="countInput" type="text" v-model="newlist.count">
      </div>
      <div class="input-group">
        <label>入库时间</label>
        <input type="text" v-model="newlist.time" disabled>
      </div>
      <button class="submit-btn" @click="inputsubmit">入库</button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, onMounted, watch, ref } from 'vue'
  import axios from 'axios'

  // 存储从后端获取的数据
  const list = ref([])
  
  // 输入框引用
  const nameInput = ref(null)
  const inputPriceInput = ref(null)
  const rateInput = ref(null)
  const countInput = ref(null)
  
  // 创建响应式的newlist对象
  const newlist = reactive({
    name:'',
    inputprice:0,
    rate:0,
    outputprice:0,
    count:0,
    time:''
  })
  
  // 获取当前日期并格式化为"年-月-日"形式
  const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 月份从0开始，需要加1
    const day = date.getDate()
    return `${year}-${month}-${day}`
  }
  
  // 组件挂载时设置当前日期并获取数据
  onMounted(() => {
    newlist.time = getCurrentDate()
    fetchData() // 加载后端数据
  })
  
  // 从后端获取数据
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/data')
      // 对数组进行逆序处理（使用扩展运算符创建新数组，避免原地修改）
      list.value = [...response.data].reverse()
      console.log('获取数据成功:', response.data)
      console.log('逆序后的数据:', list.value)
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }
  
  // 监听出库倍率和入库价变化，自动计算出库价
  watch(
    [() => newlist.rate, () => newlist.inputprice],
    ([newRate, newInputPrice]) => {
      const inputprice = Number(newInputPrice) || 0
      const rate = Number(newRate) || 0
      newlist.outputprice = (inputprice * (rate / 100)).toFixed(4)
    },
    { immediate: true }
  )
  
  // 处理品名输入，去除空格
  const handleNameInput = () => {
    // 去除所有空格
    newlist.name = newlist.name.replace(/\s/g, '')
  }

  // 聚焦到入库价输入框
  const focusInputPrice = () => {
    inputPriceInput.value.focus()
  }

  // 聚焦到出库倍率输入框
  const focusRate = () => {
    rateInput.value.focus()
  }

  // 聚焦到库存输入框
  const focusCount = () => {
    countInput.value.focus()
  }

  // 提交数据
  const inputsubmit = async ()=>{
    try {
      // 再次验证品名是否为空
      if (!newlist.name.trim()) {
        alert('品名不能为空')
        return
      }
      
      console.log('准备发送数据:', newlist)
      const response = await axios({
        method:'post',
        url:'http://localhost:8080/inputsubmit',
        data:newlist
      })
      console.log('请求成功:', response.data)
      // 重新获取数据，更新表格
      fetchData()
      // 清空表单
      Object.assign(newlist, {
        name:'',
        inputprice:0,
        rate:0,
        outputprice:0,
        count:0,
        time:getCurrentDate()
      })
      // 聚焦到品名输入框
      nameInput.value.focus()
    } catch (error) {
      console.error('请求失败:', error)
    }
  }
</script>
<style scoped>
  /* 全局背景 */
  body {
    background-color: #e8f5e8;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
  
  /* 容器布局 */
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
  }
  
  /* 表格容器 - 占据70%高度 */
  .table-container {
    flex: 7;
    margin-bottom: 20px;
    overflow: hidden;
  }
  
  /* 表格样式 */
  .table {
    height: 100%;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #c8e6c9;
    overflow: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    background-color: #81c784;
    color: white;
    font-weight: 600;
    padding: 12px;
    text-align: left;
  }
  
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #e8f5e8;
  }
  
  tr:nth-child(even) {
    background-color: #f1f8e9;
  }
  
  tr:hover {
    background-color: #e8f5e8;
  }
  
  /* 输入区域 - 占据30%高度 */
  .input {
    flex: 3;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #c8e6c9;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  
  /* 输入组 */
  .input-group {
    display: flex;
    flex-direction: column;
  }
  
  .input-group label {
    margin-bottom: 5px;
    color: #2e7d32;
    font-weight: 500;
    font-size: 14px;
  }
  
  .input-group input {
    padding: 8px 10px;
    border: 1px solid #c8e6c9;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .input-group input:focus {
    outline: none;
    border-color: #81c784;
    box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.2);
  }
  
  /* 提交按钮 */
  .submit-btn {
    grid-column: 1 / -1;
    padding: 12px;
    background-color: #81c784;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
  }
  
  .submit-btn:hover {
    background-color: #4caf50;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .container {
      padding: 10px;
    }
    
    .table {
      padding: 10px;
    }
    
    .input {
      padding: 10px;
      grid-template-columns: 1fr;
    }
    
    th, td {
      padding: 8px 10px;
      font-size: 12px;
    }
  }
</style>