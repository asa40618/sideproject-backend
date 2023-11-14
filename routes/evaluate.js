import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductsWithQS,
  getProductById,
  countWithQS,
} from '../models/products.js'
// 專用處理sql字串的工具，主要format與escape，防止sql injection
import sqlString from 'sqlstring'
import { executeQuery, insertOne } from '../models/base.js'
// mysql promise pool
import pool from '../config/db.js'

// 檢查空物件
import { isEmpty } from '../utils/tool.js'

// 控制是否要呈現除錯訊息
import 'dotenv/config.js'
const debug = process.env.NODE_ENV === 'development'

// 判斷專輯是否買過
router.get('/orderCheck/album/:pid', async (req, res) => {
  const sql = `SELECT order_form.product_id, order_form.Source_id, order_form.member_id FROM order_form WHERE product_id = ${req.params.pid} AND Source_id=1;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `訂單讀取失敗: ${error.message}` })
  }
})
// 判斷專輯是否留過言
router.get('/commentCheck/album/:pid', async (req, res) => {
  // console.log(req.params.pid)
  const sql = `SELECT album_evaluate.id, album_evaluate.member_id, album_evaluate.album_id 
  FROM album_evaluate 
  WHERE album_id = ${req.params.pid}`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `留言讀取失敗: ${error.message}` })
  }
})

// 判斷課程是否買過
router.get('/orderCheck/course/:pid', async (req, res) => {
  const sql = `SELECT order_form.product_id, order_form.Source_id, order_form.member_id FROM order_form WHERE product_id = ${req.params.pid} AND Source_id=3;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `訂單讀取失敗: ${error.message}` })
  }
})
// 判斷課程是否留過言
router.get('/commentCheck/course/:pid', async (req, res) => {
  // console.log(req.params.pid)
  const sql = `SELECT course_evaluate.id, course_evaluate.member_id, course_evaluate.course_id 
  FROM course_evaluate 
  WHERE course_id = ${req.params.pid}`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `留言讀取失敗: ${error.message}` })
  }
})

// 專輯評價資料
router.get('/album/:pid', async (req, res) => {
  const sql = `SELECT album_evaluate.id, album_evaluate.album_id, album_evaluate.stars, album_evaluate.comment, album_evaluate.comment_time, member.name, member.photo 
  FROM album_evaluate 
  INNER JOIN member ON album_evaluate.member_id = member.id 
  WHERE album_id = ${req.params.pid}
  ORDER BY album_evaluate.comment_time DESC;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows) // 调试用途
    res.json(rows) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: 'y 資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})

// 更新專輯評價
router.post('/album/:pid', async (req, res) => {
  try {
    const now = new Date()
    // 指定日期時間格式
    const datetimeString = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`

    const { rows } = await insertOne('album_evaluate', {
      id: '',
      member_id: req.body.member_id,
      album_id: req.params.pid,
      stars: req.body.stars,
      comment: req.body.comment,
      comment_time: datetimeString, // 使用剛才格式化的日期時間字符串
    })
    console.log(rows)
    res.json('成功新增評價')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '新增資料失敗' })
  }
})

// 課程評價資料
router.get('/course/:pid', async (req, res) => {
  const sql = `SELECT course_evaluate.id,course_evaluate.course_id,course_evaluate.stars,course_evaluate.comment,course_evaluate.comment_time,member.name FROM course_evaluate INNER JOIN member ON course_evaluate.member_id = member.id where course_id =${req.params.pid} ORDER BY course_evaluate.comment_time DESC;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows) // 调试用途
    res.json(rows) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: '資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})

// 更新專輯評價
router.post('/course/:pid', async (req, res) => {
  try {
    const now = new Date()
    // 指定日期時間格式
    const datetimeString = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`

    const { rows } = await insertOne('course_evaluate', {
      id: '',
      member_id: req.body.member_id,
      course_id: req.params.pid,
      stars: req.body.stars,
      comment: req.body.comment,
      comment_time: datetimeString, // 使用剛才格式化的日期時間字符串
    })
    console.log(rows)
    res.json('成功新增評價')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '新增資料失敗' })
  }
})

// 獲得單筆資料
router.get('/:pid', async (req, res, next) => {
  console.log(req.params)

  // 讀入範例資料
  const product = await getProductById(req.params.pid)

  if (product) {
    return res.json({ ...product })
  } else {
    return res.json({})
  }
})

export default router
