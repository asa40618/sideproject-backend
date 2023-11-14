import express from 'express'
import { executeQuery } from '../models/base.js'
const router = express.Router()

// GET /:sid 路由
router.get('/:tid', async (req, res, next) => {
  const tid = req.params.tid // 從路由參數中獲取sid值
  try {
    const sql = `SELECT * FROM teachers WHERE id = ${tid}` // 使用sid進行過濾
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
//http://localhost:3005/api/teacher/6

router.get('/:tid/courses', async (req, res, next) => {
  const tid = req.params.tid
  try {
    const sql = `
    SELECT * FROM course WHERE course.teacher_id=${tid}
    `
    const { rows } = await executeQuery(sql)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})

// 測試
// http://localhost:3005/api/teacher/43/courses

export default router
