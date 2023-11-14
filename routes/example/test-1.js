import express from 'express'
const router = express.Router()
import { executeQuery } from '../../models/base.js'
router.get('/', async (req, res, next) => {
  const sql = `SELECT
    ch.*,
    counttype.count_type AS countType,
    CASE
        WHEN coupon_use.id IS NULL THEN '未使用'
        ELSE '已使用'
    END AS couponUsage
  FROM ch
  LEFT JOIN counttype ON ch.countType = counttype.id
  LEFT JOIN coupon_use ON ch.id = coupon_use.ch_id;`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  const books = rows.map((v) => ({
    ...v,
  }))

  res.json(books)
})
export default router
