import express from 'express'
const router = express.Router()

import { executeQuery } from '../models/base.js'

import authenticate from '../middlewares/jwt.js'

// 獲得某會員id的有加入到我的最愛清單中的商品id們
// router.get('/my-favorite', authenticate, async (req, res, next) => {
//   const sql = `SELECT f.pid
//         FROM favorites AS f
//         WHERE f.uid = ${req.user.id}
//         ORDER BY f.pid ASC;`

//   const { rows } = await executeQuery(sql)
//   // 將結果中的pid取出變為一個純資料的陣列
//   const favorites = rows.map((v) => v.pid)

//   res.json({ favorites })
// })
// 會員詳細頁獲取最愛的商品
// 專輯
router.post('/my-favorite/album', authenticate, async (req, res, next) => {
  const sql = `SELECT f.album_id
  FROM album_collect AS f
  WHERE f.member_id = ${req.user.id}
  ORDER BY f.album_id ASC;`

  const { rows } = await executeQuery(sql)
  // console.log(rows)
  // 將結果中的pid取出變為一個純資料的陣列
  const favorites = rows.map((v) => v.album_id)

  res.json({ favorites })
})
// 活動
router.post('/my-favorite/event', authenticate, async (req, res, next) => {
  const sql = `SELECT f.event_id
  FROM event_collect AS f
  WHERE f.member_id = ${req.user.id}
  ORDER BY f.event_id ASC;`

  const { rows } = await executeQuery(sql)
  // 將結果中的pid取出變為一個純資料的陣列
  const favorites = rows.map((v) => v.event_id)

  res.json({ favorites })
})
// 課程
router.post('/my-favorite/course', authenticate, async (req, res, next) => {
  const sql = `SELECT f.course_id
  FROM course_collect AS f
  WHERE f.member_id = ${req.user.id}
  ORDER BY f.course_id ASC;`

  const { rows } = await executeQuery(sql)
  // 將結果中的pid取出變為一個純資料的陣列
  const favorites = rows.map((v) => v.course_id)

  res.json({ favorites })
})

router.get('/all-products-no-login', async (req, res, next) => {
  const sql = `SELECT p.*
    FROM products AS p
    ORDER BY p.id ASC`

  const { rows } = await executeQuery(sql)

  res.json({ products: rows })
})
// 商品列表用
// album商品列表用
router.post('/all-products/album', authenticate, async (req, res, next) => {
  const user = req.user
  const uid = user.id
  const sql = `SELECT p.*, IF(f.id, 'true', 'false') AS is_favorite
    FROM album AS p
    LEFT JOIN album_collect AS f ON f.album_id = p.id
    AND f.member_id = ${uid}
    ORDER BY p.id ASC`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  // cast boolean
  const products = rows.map((v) => ({
    ...v,
    is_favorite: v.is_favorite === 'true',
  }))

  console.log(products)

  res.json({ products })
})
// 活動商品列表用
router.post(
  '/all-products/event_management',
  authenticate,
  async (req, res, next) => {
    const user = req.user
    const uid = user.id
    const sql = `SELECT p.*, IF(f.id, 'true', 'false') AS is_favorite
    FROM event_management AS p
    LEFT JOIN event_collect AS f ON f.event_id = p.id
    AND f.member_id = ${uid}
    ORDER BY p.id ASC`

    const { rows } = await executeQuery(sql)

    console.log(rows)

    // cast boolean
    const products = rows.map((v) => ({
      ...v,
      is_favorite: v.is_favorite === 'true',
    }))

    console.log(products)

    res.json({ products })
  }
)
// 課程商品列表用
router.post('/all-products/course', authenticate, async (req, res, next) => {
  const user = req.user
  const uid = user.id
  const sql = `SELECT p.*, IF(f.id, 'true', 'false') AS is_favorite
    FROM course AS p
    LEFT JOIN course_collect AS f ON f.id = p.course_id
    AND f.member_id = ${uid}
    ORDER BY p.course_id ASC`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  // cast boolean
  const products = rows.map((v) => ({
    ...v,
    is_favorite: v.is_favorite === 'true',
  }))

  console.log(products)

  res.json({ products })
})
// 會員中心用
// 專輯都寫在了user裡面了
// router.get('/fav-products/album', authenticate, async (req, res, next) => {
//   const user = req.user
//   const uid = user.id

//   const sql = `SELECT p.*
// FROM album AS p
//     INNER JOIN album_collect AS f ON f.album_id = p.id
//     AND f.member_id = ${uid}
// ORDER BY p.id ASC`

//   const { rows } = await executeQuery(sql)

//   console.log(rows)

//   res.json({ products: rows })
// })

// 加入收藏
// album_collect
router.put('/album/:pid', authenticate, async (req, res, next) => {
  const pid = req.params.pid

  const user = req.user
  const uid = user.id

  const sql = `INSERT INTO album_collect (member_id, album_id) VALUES (${uid}, ${pid})`

  const { rows } = await executeQuery(sql)

  console.log(rows.affectedRows)

  if (rows.affectedRows) {
    return res.json({ message: 'success', code: '200' })
  } else {
    return res.json({ message: 'fail', code: '400' })
  }
})
// 加入收藏
// event_collect
router.put('/event/:pid', authenticate, async (req, res, next) => {
  const pid = req.params.pid

  const user = req.user
  const uid = user.id

  const sql = `INSERT INTO event_collect (member_id, event_id) VALUES (${uid}, ${pid})`

  const { rows } = await executeQuery(sql)

  console.log(rows.affectedRows)

  if (rows.affectedRows) {
    return res.json({ message: 'success', code: '200' })
  } else {
    return res.json({ message: 'fail', code: '400' })
  }
})
// 加入收藏
// course_collect
router.put('/course/:pid', authenticate, async (req, res, next) => {
  const pid = req.params.pid

  const user = req.user
  const uid = user.id

  const sql = `INSERT INTO course_collect (member_id, course_id) VALUES (${uid}, ${pid})`

  const { rows } = await executeQuery(sql)

  console.log(rows.affectedRows)

  if (rows.affectedRows) {
    return res.json({ message: 'success', code: '200' })
  } else {
    return res.json({ message: 'fail', code: '400' })
  }
})

// 取消收藏
// album_collect
router.put('/delete/album/:pid', authenticate, async (req, res, next) => {
  const pid = req.params.pid

  const user = req.user
  const uid = user.id

  const sql = `DELETE FROM album_collect WHERE album_id=${pid} AND member_id=${uid}; `

  const { rows } = await executeQuery(sql)

  console.log(rows.affectedRows)

  if (rows.affectedRows) {
    return res.json({ message: 'success', code: '200' })
  } else {
    return res.json({ message: 'fail', code: '400' })
  }
})
// 取消收藏
// event_collect
router.put('/delete/event/:pid', authenticate, async (req, res, next) => {
  const pid = req.params.pid

  const user = req.user
  const uid = user.id

  const sql = `DELETE FROM event_collect WHERE event_id=${pid} AND member_id=${uid}; `

  const { rows } = await executeQuery(sql)

  console.log(rows.affectedRows)

  if (rows.affectedRows) {
    return res.json({ message: 'success', code: '200' })
  } else {
    return res.json({ message: 'fail', code: '400' })
  }
})
// 取消收藏
// course_collect
router.put('/delete/course/:pid', authenticate, async (req, res, next) => {
  const pid = req.params.pid

  const user = req.user
  const uid = user.id

  const sql = `DELETE FROM course_collect WHERE course_id=${pid} AND member_id=${uid}; `

  const { rows } = await executeQuery(sql)

  console.log(rows.affectedRows)

  if (rows.affectedRows) {
    return res.json({ message: 'success', code: '200' })
  } else {
    return res.json({ message: 'fail', code: '400' })
  }
})

export default router
