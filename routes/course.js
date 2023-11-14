import express from 'express'
import { executeQuery } from '../models/base.js'
const router = express.Router()

// GET /:pid 路由
router.get('/:pid', async (req, res, next) => {
  const pid = req.params.pid // 從路由參數中獲取pid值
  try {
    const sql = `SELECT course.*, teachers.name AS teachersName FROM course JOIN teachers ON course.teacher_id = teachers.id WHERE course_id = ${pid}` // 使用pid進行過濾
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(...rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
  console.log('aa')
})

router.get('/courseChapter/:pid', async (req, res, next) => {
  const pid = req.params.pid // 從路由參數中獲取pid值
  try {
    const sql = `SELECT * FROM course_chapter WHERE course_chapter.course_id=${pid}` // 使用pid進行過濾
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
  console.log('aa')
})

//預設
router.get('/', async (req, res, next) => {
  try {
    const sql = `SELECT course.*, teachers.name AS teacher_name FROM course JOIN teachers ON course.teacher_id = teachers.id`
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
//http://localhost:3005/api/course/

//hhh
router.get('/page/:page', async (req, res, next) => {
  try {
    const itemsPerPage = 4 // 每頁顯示的項目數
    const page = req.params.page || 1 // 如果未指定 page，默認為第 1 頁
    const startItem = (page - 1) * itemsPerPage // 計算起始項目

    const sql = `
      SELECT *
      FROM course
      WHERE valid = 1
      ORDER BY course.id ASC
      LIMIT ${startItem}, ${itemsPerPage}
    `

    const queryValues = [startItem, itemsPerPage]

    const { rows } = await executeQuery(sql, queryValues)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})

export default router
//123
//http://localhost:3005/api/course/5
// DB_DATABASE=melodyoasis
// DB_USERNAME=admin06
// DB_PASSWORD=admin06
