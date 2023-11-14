import express from 'express'
import { insertMany } from '../models/base.js'
const router = express.Router()

router.post('/', async (req, res) => {
  // function generate20DigitTimestamp() { // 若前端沒有寫出隨機訂單號碼
  //   const timestampStr = Date.now().toString()
  //   // 取時間戳記的前5位數字
  //   const firstFiveDigits = timestampStr.substring(0, 5)
  //   // 生成一個5位隨機數字
  //   const randomFiveDigits = Math.floor(Math.random() * 90000) + 10000
  //   // 結合兩者以創建一個10位數字
  //   const orderNumber = firstFiveDigits + randomFiveDigits.toString()
  //   return parseInt(orderNumber, 10) // 轉回數字格式
  // }
  // const order_number = generate20DigitTimestamp() //order_number 時間戳記
  const table = 'order_form'
  // URL: http://localhost:3005/api/order/
  // "POST傳遞"
  // 單筆傳遞格式
  //   [
  //     {
  //         "product_id": 4,
  //         "payment_method": "現金",
  //         "Order_date": "2023-02-22",
  //         "quantity": 2,
  //         "Source_id": 2,
  //         "ch_id": "",
  //         "member_id": 12
  //     }
  // ]
  // 多筆傳遞格式
  //   [
  //     {
  //         "product_id": 4,
  //         "payment_method": "現金",
  //         "Order_date": "2023-02-22",
  //         "quantity": 2,
  //         "Source_id": 2,
  //         "ch_id": "1",
  //         "member_id": 6
  //     }, {
  //         "product_id": 6,
  //         "payment_method": "現金",
  //         "Order_date": "2023-02-22",
  //         "quantity": 6,
  //         "Source_id": 1,
  //         "ch_id": "1",
  //         "member_id": 6
  //     }
  // ]

  const newArray = req.body.map((item) => {
    // item.order_number = order_number // 若前端沒有寫出隨機訂單號碼
    item.ch_id === '' ? (item.ch_id = null) : item.ch_id
    return { ...item }
  })

  try {
    const { rows } = await insertMany(table, newArray, '')
    console.log(rows) // 调试用途

    res.status(200).json({
      status: 'success',
      message: '寫入成功',
    })
    // 回傳結果
    //   {
    //     "status": "success",
    //     "message": 1697233300,
    //     "message2": "訂單編號為1697233300"
    // }
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: '訂單寫入失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})
export default router
