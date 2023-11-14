import express from 'express'
import { executeQuery } from '../models/base.js'
const router = express.Router()

// GET /:sid 路由
router.get('/:sid', async (req, res, next) => {
  const sid = req.params.sid // 從路由參數中獲取sid值
  try {
    const sql = `SELECT * FROM artist WHERE id = ${sid}` // 使用sid進行過濾
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
  console.log('aa')
})
// 測試
//http://localhost:3005/api/singer/6

//hhh
router.get('/:sid/albums', async (req, res, next) => {
  const sid = req.params.sid
  try {
    const sql = `
    SELECT * FROM album WHERE artist_id = ${sid}
    `
    const { rows } = await executeQuery(sql)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})
// 測試
// http://localhost:3005/api/singer/74/albums

export default router
