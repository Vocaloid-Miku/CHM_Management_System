<template>
  <div class="store-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <h3>字母导航</h3>
      <div class="letter-groups">
        <div class="letter-group">
          <div class="letter-title">A-C</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('A')">A</span>
            <span class="letter" @click="scrollToLetter('B')">B</span>
            <span class="letter" @click="scrollToLetter('C')">C</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">D-F</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('D')">D</span>
            <span class="letter" @click="scrollToLetter('E')">E</span>
            <span class="letter" @click="scrollToLetter('F')">F</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">G-I</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('G')">G</span>
            <span class="letter" @click="scrollToLetter('H')">H</span>
            <span class="letter" @click="scrollToLetter('I')">I</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">J-L</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('J')">J</span>
            <span class="letter" @click="scrollToLetter('K')">K</span>
            <span class="letter" @click="scrollToLetter('L')">L</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">M-O</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('M')">M</span>
            <span class="letter" @click="scrollToLetter('N')">N</span>
            <span class="letter" @click="scrollToLetter('O')">O</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">P-R</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('P')">P</span>
            <span class="letter" @click="scrollToLetter('Q')">Q</span>
            <span class="letter" @click="scrollToLetter('R')">R</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">S-U</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('S')">S</span>
            <span class="letter" @click="scrollToLetter('T')">T</span>
            <span class="letter" @click="scrollToLetter('U')">U</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">V-X</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('V')">V</span>
            <span class="letter" @click="scrollToLetter('W')">W</span>
            <span class="letter" @click="scrollToLetter('X')">X</span>
          </div>
        </div>
        <div class="letter-group">
          <div class="letter-title">Y-Z</div>
          <div class="letters">
            <span class="letter" @click="scrollToLetter('Y')">Y</span>
            <span class="letter" @click="scrollToLetter('Z')">Z</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="container" ref="containerRef">
      <div class="table-container">
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>品名</th>
                <th>出库价</th>
                <th>库存(克)</th>
                <th>安全库存</th>
                <th>存储地点</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in storeItems" :key="index" :id="`item-${getFirstLetter(item.name)}`">
                <!-- 编辑模式 -->
                <template v-if="editingIndex === index">
                  <td>{{ item.name }}</td>
                  <td><input type="number" v-model="editForm.outputprice" step="0.0001" min="0"></td>
                  <td><input type="number" v-model="editForm.count" min="0" :style="{ color: editForm.count < editForm.safecount ? 'red' : 'inherit' }"></td>
                  <td><input type="number" v-model="editForm.safecount" min="0"></td>
                  <td><input type="text" v-model="editForm.place"></td>
                  <td><input type="text" v-model="editForm.tip"></td>
                  <td>
                    <button class="edit-btn" @click="saveEdit(index)">保存</button>
                    <button class="cancel-btn" @click="cancelEdit">取消</button>
                  </td>
                </template>
                <!-- 查看模式 -->
                <template v-else>
                  <td>{{ item.name }}</td>
                  <td>{{ item.outputprice }}</td>
                  <td :style="{ color: item.count < item.safecount ? 'red' : 'inherit' }">{{ item.count }}</td>
                  <td>{{ item.safecount }}</td>
                  <td>{{ item.place || '-' }}</td>
                  <td>{{ item.tip || '-' }}</td>
                  <td>
                    <button class="edit-btn" @click="startEdit(index, item)">编辑</button>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 存储从数据库获取的数据
const storeItems = ref([])
// 当前编辑的索引
const editingIndex = ref(-1)
// 编辑表单数据
const editForm = ref({})
// 容器引用
const containerRef = ref(null)

// 从后端获取数据库数据
const fetchStoreData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/store-data')
    storeItems.value = response.data
    console.log('获取数据库数据成功:', response.data)
  } catch (error) {
    console.error('获取数据库数据失败:', error)
  }
}

// 开始编辑
const startEdit = (index, item) => {
  editingIndex.value = index
  // 复制当前项的数据到编辑表单
  editForm.value = { ...item }
}

// 取消编辑
const cancelEdit = () => {
  editingIndex.value = -1
  editForm.value = {}
}

// 保存编辑
const saveEdit = async (index) => {
  try {
    const response = await axios.put('http://localhost:8080/api/store-update', {
      name: storeItems.value[index].name,
      ...editForm.value
    })
    console.log('更新数据成功:', response.data)
    // 重新获取数据
    fetchStoreData()
    // 退出编辑模式
    editingIndex.value = -1
    editForm.value = {}
  } catch (error) {
    console.error('更新数据失败:', error)
  }
}

// 获取中文首字母
const getFirstLetter = (name) => {
  if (!name) return ''
  const firstChar = name.charAt(0)
  // 简单的中文首字母获取
  const pinyinMap = {
    '艾': 'A', '白': 'B', '川': 'C', '当': 'D', '防': 'F', '茯': 'F',
    '黄': 'H', '枸': 'G', '麦': 'M', '知': 'Z', '三': 'S', '熟': 'S', '柴': 'C'
  }
  return pinyinMap[firstChar] || firstChar.toUpperCase()
}

// 滚动到指定字母
const scrollToLetter = (letter) => {
  const element = document.getElementById(`item-${letter}`)
  if (element && containerRef.value) {
    containerRef.value.scrollTop = element.offsetTop - 100
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchStoreData()
})
</script>

<style scoped>
/* 整体布局 */
.store-container {
  display: flex;
  height: 100vh;
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
  
  /* 调整字母容器大小 */
  .letters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
  }
  
  /* 调整字母大小 */
  .letter {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background-color: #f1f8e9;
    color: #2e7d32;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
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

/* 右侧内容区 */
.container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #c8e6c9;
  overflow: hidden;
}

/* 表格样式 */
.table {
  padding: 20px;
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
  position: sticky;
  top: 0;
  z-index: 1;
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

/* 编辑按钮样式 */
.edit-btn {
  padding: 5px 10px;
  background-color: #81c784;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-btn:hover {
  background-color: #4caf50;
}

.cancel-btn {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

/* 编辑输入框样式 */
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
  .store-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #c8e6c9;
  }
  
  .letters {
    justify-content: center;
  }
  
  .container {
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