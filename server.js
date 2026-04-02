const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs') // 引入fs模块
const mysql = require('mysql2/promise') // 引入mysql2模块

// 使用 CommonJS 的 __dirname

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'inputhistory.json')

// 创建 Express 应用
const app = express()

// 启用CORS（解决跨域问题）
app.use(cors())
// 解析JSON请求体（前端发送的是JSON格式数据）
app.use(express.json())

// 托管 dist 静态文件夹
app.use(express.static(path.join(__dirname, 'dist')))

// 初始化数据文件（如果不存在）
const initDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8')
    console.log('数据文件初始化成功')
  }
}
initDataFile()

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // 替换为你的MySQL用户名
  password: 'cym060519',  // 替换为你的MySQL密码
  database: 'chm_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// 测试数据库连接
pool.getConnection()
  .then(conn => {
    console.log('数据库连接成功')
    conn.release()
  })
  .catch(err => {
    console.error('数据库连接失败:', err)
  })

// 1. 处理POST请求（存储前端数据）
app.post('/inputsubmit', async (req, res) => {
  try {
    // 接收前端发送的newlist数据
    const receivedData = req.body
    console.log('收到前端数据:', receivedData)

    // 确保数据完整
    const { name, outputprice, count, inputprice, rate, time } = receivedData
    
    if (!name || !outputprice || !count) {
      throw new Error('缺少必要数据字段')
    }

    // 1. 存储到文件（确保数据完整）
    let existingData = []
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8')
      if (fileContent.trim()) {
        existingData = JSON.parse(fileContent)
      }
    } catch (parseError) {
      console.error('解析数据文件失败，使用空数组:', parseError)
      existingData = []
    }
    
    // 确保existingData是数组
    if (!Array.isArray(existingData)) {
      existingData = []
    }
    
    // 将新数据添加到数组中
    existingData.push(receivedData)
    // 写回文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2), 'utf8')
    console.log('数据已存储到文件')

    // 2. 存储到数据库
    try {
      // 检查是否已存在相同name的记录
      const [existingRows] = await pool.execute(
        'SELECT * FROM store_items WHERE name = ?',
        [name]
      )

      if (existingRows.length > 0) {
        // 存在重复name，更新记录（outputprice覆盖，count相加）
        const existingItem = existingRows[0]
        const newCount = parseInt(existingItem.count) + parseInt(count)
        
        await pool.execute(
          'UPDATE store_items SET outputprice = ?, count = ? WHERE name = ?',
          [outputprice, newCount, name]
        )
        
        console.log('数据已更新到数据库（name重复）')
      } else {
        // 不存在重复name，插入新记录
        await pool.execute(
          'INSERT INTO store_items (name, outputprice, count, safecount, place, tip) VALUES (?, ?, ?, 0, "", "")',
          [name, outputprice, count]
        )
        
        console.log('数据已插入到数据库')
      }
    } catch (dbError) {
      console.error('数据库存储失败:', dbError)
      // 数据库存储失败不影响文件存储，继续执行
    }

    // 返回成功响应给前端
    res.status(200).json({
      message: '数据接收并存储成功',
      data: receivedData
    })
  } catch (error) {
    console.error('存储失败:', error)
    res.status(500).json({ message: '存储失败', error: error.message })
  }
})

// 2. 处理GET请求（返回文件数据，用于instore.vue）
app.get('/api/data', (req, res) => {
  try {
    // 从文件读取数据（恢复原来的逻辑）
    let data = []
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8')
      if (fileContent.trim()) {
        data = JSON.parse(fileContent)
      }
    } catch (parseError) {
      console.error('解析数据文件失败，返回空数组:', parseError)
      data = []
    }
    
    // 确保返回的是数组
    if (!Array.isArray(data)) {
      data = []
    }
    
    console.log('从文件返回数据:', data)
    // 以数组形式返回数据
    res.status(200).json(data)
  } catch (error) {
    console.error('读取数据失败:', error)
    res.status(500).json({ message: '读取数据失败', error: error.message })
  }
})

// 3. 处理GET请求（返回数据库数据，用于store.vue）
app.get('/api/store-data', async (req, res) => {
  try {
    // 从数据库查询数据，按中文拼音首字母排序
    const [rows] = await pool.execute('SELECT name, outputprice, count, safecount, place, tip FROM store_items ORDER BY CONVERT(name USING gbk) ASC')
    console.log('从数据库返回数据:', rows)
    // 以数组形式返回数据
    res.status(200).json(rows)
  } catch (error) {
    console.error('读取数据库数据失败:', error)
    res.status(500).json({ message: '读取数据库数据失败', error: error.message })
  }
})

// 根据品名获取出库价
app.get('/api/get-price', async (req, res) => {
  try {
    const { name } = req.query
    if (!name) {
      return res.status(400).json({ message: '缺少品名参数' })
    }
    
    const [rows] = await pool.execute('SELECT outputprice FROM store_items WHERE name = ?', [name])
    if (rows.length > 0) {
      res.status(200).json({ price: rows[0].outputprice })
    } else {
      res.status(404).json({ message: '未找到该品名' })
    }
  } catch (error) {
    console.error('获取出库价失败:', error)
    res.status(500).json({ message: '获取出库价失败', error: error.message })
  }
})

// 处理出库请求
app.post('/api/outstore', async (req, res) => {
  let connection;
  try {
    const { items } = req.body
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: '缺少有效的出库数据' })
    }
    
    // 获取数据库连接
    connection = await pool.getConnection()
    
    // 开始事务
    await connection.beginTransaction()
    
    for (const item of items) {
      const { name, count } = item
      
      // 检查库存是否足够
      const [stockRows] = await connection.execute('SELECT count FROM store_items WHERE name = ?', [name])
      
      if (stockRows.length === 0) {
        await connection.rollback()
        connection.release()
        return res.status(404).json({ success: false, message: `未找到商品: ${name}` })
      }
      
      const currentStock = stockRows[0].count
      
      if (currentStock < count) {
        await connection.rollback()
        connection.release()
        return res.status(400).json({ success: false, message: `库存不足: ${name}，当前库存: ${currentStock}，出库数量: ${count}` })
      }
      
      // 更新库存
      await connection.execute('UPDATE store_items SET count = count - ? WHERE name = ?', [count, name])
    }
    
    // 提交事务
    await connection.commit()
    connection.release()
    
    res.status(200).json({ success: true, message: '出库成功' })
  } catch (error) {
    // 发生错误时回滚事务
    try {
      if (connection) {
        await connection.rollback()
        connection.release()
      }
    } catch (rollbackError) {
      console.error('回滚事务失败:', rollbackError)
    }
    
    console.error('出库失败:', error)
    res.status(500).json({ success: false, message: '出库失败', error: error.message })
  }
})

// 4. 处理PUT请求（更新数据库数据，用于store.vue的编辑功能）
app.put('/api/store-update', async (req, res) => {
  try {
    const { name, outputprice, count, safecount, place, tip } = req.body
    console.log('收到更新数据:', { name, outputprice, count, safecount, place, tip })

    if (!name) {
      throw new Error('缺少品名字段')
    }

    // 更新数据库记录
    await pool.execute(
      'UPDATE store_items SET outputprice = ?, count = ?, safecount = ?, place = ?, tip = ? WHERE name = ?',
      [outputprice, count, safecount, place || '', tip || '', name]
    )

    console.log('数据已更新到数据库')

    // 返回成功响应
    res.status(200).json({
      message: '数据更新成功',
      data: req.body
    })
  } catch (error) {
    console.error('更新失败:', error)
    res.status(500).json({ message: '更新失败', error: error.message })
  }
})

// 解决 Vue Router history 模式刷新 404
app.use((req, res, next) => {
  // 对于静态文件请求，继续处理
  if (req.path.includes('.')) {
    return next()
  }
  // 对于其他请求，返回 index.html
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// 启动端口
const port = 8080
app.listen(port, () => {
  console.log(`静态服务器运行在 http://localhost:${port}`)
})