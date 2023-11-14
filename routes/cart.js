import express from 'express'
import { executeQuery } from '../models/base.js'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('test')
})
router.get('/coupon', async (req, res, next) => {
  try {
    const sql = `
      SELECT * FROM ch WHERE countType=1
      `
    // 使用pid進行過濾
    const { rows } = await executeQuery(sql)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
  console.log('aa')
})

router.post('/sendOrder', async (req, res, next) => {
  const orderData = req.body
  console.log(orderData)
  // try {
  //   const sql = `
  //   SELECT * FROM ch
  //   `
  //   // 使用pid進行過濾
  //   const { rows } = await executeQuery(sql)
  //   console.log(rows)
  //   res.json(rows)
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).json({ error: 'Database query error' })
  // }
  // console.log('aa')
})

export default router
