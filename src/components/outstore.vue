<template>
  <div class="outstore-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <!-- 导航模式 -->
      <div v-if="showNavigation">
        <h3>字母导航</h3>
        <div class="letter-groups">
          <div class="letter-group">
            <div class="letter-title">A-C</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('A')">A</span>
              <span class="letter" @click="handleLetterClick('B')">B</span>
              <span class="letter" @click="handleLetterClick('C')">C</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">D-F</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('D')">D</span>
              <span class="letter" @click="handleLetterClick('E')">E</span>
              <span class="letter" @click="handleLetterClick('F')">F</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">G-I</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('G')">G</span>
              <span class="letter" @click="handleLetterClick('H')">H</span>
              <span class="letter" @click="handleLetterClick('I')">I</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">J-L</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('J')">J</span>
              <span class="letter" @click="handleLetterClick('K')">K</span>
              <span class="letter" @click="handleLetterClick('L')">L</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">M-O</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('M')">M</span>
              <span class="letter" @click="handleLetterClick('N')">N</span>
              <span class="letter" @click="handleLetterClick('O')">O</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">P-R</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('P')">P</span>
              <span class="letter" @click="handleLetterClick('Q')">Q</span>
              <span class="letter" @click="handleLetterClick('R')">R</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">S-U</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('S')">S</span>
              <span class="letter" @click="handleLetterClick('T')">T</span>
              <span class="letter" @click="handleLetterClick('U')">U</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">V-X</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('V')">V</span>
              <span class="letter" @click="handleLetterClick('W')">W</span>
              <span class="letter" @click="handleLetterClick('X')">X</span>
            </div>
          </div>
          <div class="letter-group">
            <div class="letter-title">Y-Z</div>
            <div class="letters">
              <span class="letter" @click="handleLetterClick('Y')">Y</span>
              <span class="letter" @click="handleLetterClick('Z')">Z</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中药列表模式 -->
      <div v-else>
        <div class="back-section">
          <button class="back-btn" @click="handleBack">返回</button>
          <h3>{{ selectedLetter }} 开头的中药</h3>
        </div>
        <div class="item-list">
          <div v-if="filteredItems.length === 0" class="no-items">
            暂无中药
          </div>
          <div v-else class="items">
            <div class="item" v-for="item in filteredItems" :key="item.name" @click="selectItem(item)">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="container">
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
                <td><input :ref="el => setCountInputRef(el, index)" type="number" v-model.number="item.count" placeholder="0" min="0" step="1"></td>
                <td>{{ item.price && typeof item.price === 'number' ? item.price.toFixed(2) : '0.00' }}</td>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 出库数据数组
const outstoreItems = ref([])
// 数量输入框引用数组
const countInputs = ref([])

// 导航栏状态
const showNavigation = ref(true)
// 当前选中的字母
const selectedLetter = ref('')
// 过滤后的商品列表
const filteredItems = ref([])
// 所有商品数据
const allItems = ref([])

// 新增一行数据
const addItem = () => {
  outstoreItems.value.push({ name: '', count: 0, price: 0 })
}

// 删除一行数据
const deleteItem = (index) => {
  // 允许删除所有行
  if (outstoreItems.value.length > 0) {
    outstoreItems.value.splice(index, 1)
  }
}

// 计算单项小计
const calculateSubtotal = (item) => {
  const count = Number(item.count) || 0
  const price = Number(item.price) || 0
  return (count * price).toFixed(2)
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

// 获取所有商品数据
const fetchAllItems = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/store-data')
    allItems.value = response.data
    console.log('获取所有商品数据成功:', response.data)
  } catch (error) {
    console.error('获取所有商品数据失败:', error)
  }
}

// 点击字母按钮
const handleLetterClick = (letter) => {
  selectedLetter.value = letter
  showNavigation.value = false
  
  // 过滤商品数据
  filteredItems.value = allItems.value.filter(item => {
    const firstChar = item.name.charAt(0)
    // 简单的拼音首字母匹配（实际项目中可能需要更复杂的拼音转换）
    const pinyinMap = {
      '艾': 'A', '白': 'B', '川': 'C', '当': 'D', '防': 'F', '茯': 'F',
      '黄': 'H', '枸': 'G', '麦': 'M', '知': 'Z', '三': 'S', '熟': 'S', '柴': 'C',
      '桂': 'G', '人': 'R', '远': 'Y', '牛': 'N', '连': 'L', '蒲': 'P', '青': 'Q',
      '天': 'T', '五': 'W', '细': 'X'
    }
    return pinyinMap[firstChar] === letter
  })
}

// 返回导航栏
const handleBack = () => {
  showNavigation.value = true
  selectedLetter.value = ''
  filteredItems.value = []
}



// 设置数量输入框引用
const setCountInputRef = (el, index) => {
  if (el) {
    countInputs.value[index] = el
  }
}

// 选择中药
const selectItem = (item) => {
  // 新增一行并填充中药信息
  outstoreItems.value.push({ 
    name: item.name, 
    count: 0, 
    price: item.outputprice 
  })
  
  // 自动获取出库价
  fetchPriceByName(item.name, outstoreItems.value.length - 1)
  
  // 延迟聚焦到数量输入框，确保DOM已更新
  setTimeout(() => {
    const newIndex = outstoreItems.value.length - 1
    if (countInputs.value[newIndex]) {
      countInputs.value[newIndex].focus()
    }
  }, 100)
}

// 组件挂载时获取所有商品数据
onMounted(() => {
  fetchAllItems()
})
</script>

<style scoped>
/* 整体布局 */
.outstore-container {
  display: flex;
  min-height: 100vh;
  background-color: #ddf9dd;
}

/* 左侧导航栏 */
.sidebar {
  width: fit-content;
  min-width: 180px;
  max-width: 220px;
  background-color: #fff;
  border-right: 1px solid #c8e6c9;
  padding: 20px;
  overflow-y: auto;
}

.sidebar h3 {
  color: #2e7d32;
  margin-top: 0;
  margin-bottom: 20px;
}

.letter-groups {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.letter-group {
  border-bottom: 1px solid #e8f5e8;
  padding-bottom: 10px;
}

.letter-title {
  font-size: 14px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 8px;
}

.letters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.letter {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: #f1ffe1;
  color: #2e7d32;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.letter:hover {
  background-color: #81c784;
  color: white;
}

/* 返回按钮样式 */
.back-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  height: 40px;
}

.back-section h3 {
  margin: 0;
  display: flex;
  align-items: center;
  height: 100%;
}

.back-btn {
  padding: 5px 10px;
  background-color: #81c784;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #4caf50;
}

/* 商品列表样式 */
.item-list {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.no-items {
  text-align: center;
  color: #666;
  padding: 20px 0;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  padding: 10px;
  background-color: #f1ffe1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8f5e8;
}

.item:hover {
  background-color: #81c784;
  color: white;
  cursor: pointer;
}

/* 右侧内容区 */
.container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
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
  width: 80%;
  max-width: 800px;
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