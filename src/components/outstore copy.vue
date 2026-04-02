<template>
  <div class="outstore-container">
    <div class="table-container">
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>品名</th>
              <th>数量(克)</th>
              <th>出库价(元)</th>
              <th>小计(元)</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 动态生成的表格行 -->
            <tr v-for="(item, index) in outstoreItems" :key="index">
              <td><input type="text" v-model="item.name" @input="fetchPriceByName(item.name, index)" placeholder="请输入品名"></td>
              <td><input type="number" v-model.number="item.count" placeholder="0" min="0" step="1"></td>
              <td><input type="number" v-model.number="item.price" placeholder="0.00" min="0" step="0.01" disabled></td>
              <td>{{ calculateSubtotal(item) }}</td>
              <td>
                <button class="delete-btn" @click="deleteItem(index)">删除</button>
              </td>
            </tr>
            <!-- 添加按钮 -->
            <tr class="add-row">
              <td colspan="5">
                <button class="add-btn" @click="addItem">+ 新增一行</button>
              </td>
            </tr>
            <!-- 合计行 -->
            <tr class="total-row">
              <td>合计</td>
              <td></td>
              <td></td>
              <td>{{ totalAmount }}</td>
              <td></td>
            </tr>
            <!-- 出库按钮行 -->
            <tr class="outstore-btn-row">
              <td colspan="5">
                <button class="outstore-btn" @click="handleOutstore">出库</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

// 出库数据数组
const outstoreItems = ref([
  { name: '', count: 0, price: 0 }
])

// 新增一行数据
const addItem = () => {
  outstoreItems.value.push({ name: '', count: 0, price: 0 })
}

// 删除一行数据
const deleteItem = (index) => {
  // 至少保留一行
  if (outstoreItems.value.length > 1) {
    outstoreItems.value.splice(index, 1)
  }
}

// 计算单项小计
const calculateSubtotal = (item) => {
  return (item.count * item.price).toFixed(2)
}

// 计算总数量
const totalCount = computed(() => {
  return outstoreItems.value.reduce((sum, item) => sum + (item.count || 0), 0)
})

// 计算总金额
const totalAmount = computed(() => {
  return outstoreItems.value.reduce((sum, item) => sum + (item.count || 0) * (item.price || 0), 0).toFixed(2)
})

// 根据品名获取出库价
const fetchPriceByName = async (name, index) => {
  if (!name.trim()) {
    outstoreItems.value[index].price = 0
    return
  }
  
  try {
    const response = await axios.get('http://localhost:8080/api/get-price', {
      params: { name }
    })
    if (response.data && response.data.price) {
      outstoreItems.value[index].price = response.data.price
    }
  } catch (error) {
    console.error('获取出库价失败:', error)
  }
}

// 处理出库
const handleOutstore = async () => {
  // 过滤有效的出库数据
  const validItems = outstoreItems.value.filter(item => item.name.trim() && item.count > 0 && item.price > 0)
  
  if (validItems.length === 0) {
    alert('请输入有效的出库数据')
    return
  }
  
  try {
    const response = await axios.post('http://localhost:8080/api/outstore', {
      items: validItems
    })
    
    if (response.data.success) {
      alert('出库成功')
      // 清空表格，只保留一行
      outstoreItems.value = [{ name: '', count: 0, price: 0 }]
    } else {
      alert('出库失败: ' + response.data.message)
    }
  } catch (error) {
    console.error('出库失败:', error)
    alert('出库失败，请检查网络连接')
  }
}
</script>

<style scoped>
/* 整体布局 */
.outstore-container {
  min-height: 100vh;
  background-color: #ddf9dd;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #c8e6c9;
  overflow: hidden;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* 隐藏滚动条 */
.table-container::-webkit-scrollbar {
  display: none;
}

/* 表格样式 */
.table {
  padding: 20px;
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
  position: sticky;
  top: 0;
  z-index: 1;
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid #e8f5e8;
}

/* 合计行样式 */
.total-row {
  font-weight: bold;
  background-color: #f1f8e9;
}

/* 添加行样式 */
.add-row {
  background-color: #f8f9fa;
  text-align: center;
}

/* 添加按钮样式 */
.add-btn {
  padding: 8px 16px;
  background-color: #81c784;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  min-width: 100%;
}

.add-btn:hover {
  background-color: #4caf50;
}

/* 删除按钮样式 */
.delete-btn {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.add-btn:hover {
  background-color: #4caf50;
}

/* 出库按钮行样式 */
.outstore-btn-row {
  background-color: #f8f9fa;
  text-align: right;
  padding: 10px 0;
}

/* 出库按钮样式 */
.outstore-btn {
  padding: 8px 16px;
  background-color: #81c784;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  min-width: 100%;
  margin: 0;
}

.outstore-btn:hover {
  background-color: #4caf50;
}

/* 输入框样式 */
input {
  padding: 5px;
  border: 1px solid #c8e6c9;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #81c784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .outstore-container {
    padding: 10px;
  }
  
  .table {
    padding: 10px;
  }
  
  th, td {
    padding: 8px 10px;
    font-size: 12px;
  }
}
</style>