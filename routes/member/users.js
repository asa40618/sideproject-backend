import express from 'express'
const router = express.Router()
import fs from 'fs'

import { executeQuery } from '../../models/base.js'
// 檢查空物件
import { isEmpty } from '../../utils/tool.js'

// 認証用middleware(中介軟體)
// import auth from '../middlewares/auth.js'

// 上傳檔案用使用multer(另一方案是使用express-fileupload)
import multer from 'multer'
const upload = multer({ dest: 'public/' })

import {
  cleanAll,
  createBulkUsers,
  createUser,
  deleteUserById,
  getCount,
  getUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserById,
  verifyUser,
  hasKey,
} from '../../models/users.js'

// GET - 得到所有會員資料
router.get('/', async function (req, res, next) {
  const users = await getUsers()
  return res.json({ message: 'success', code: '200', users })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:userId', async function (req, res, next) {
  const user = await getUserById(req.params.userId)
  return res.json({ message: 'success', code: '200', user })
})

// POST - 上傳檔案用，使用express-fileupload
router.post('/upload', async function (req, res, next) {
  // req.files 所有上傳來的檔案
  // req.body 其它的文字欄位資料…
  // console.log(req.files, req.body)

  if (req.files) {
    const { photo } = req.files
    console.log(photo) // 上傳來的檔案(欄位名稱為avatar)

    if (fs.existsSync('uploads/member')) {
      await photo.mv(`uploads/member/${photo.name}`),
        (error) => {
          if (error) {
            return res.json({ message: 'fail', code: '400', storeError: error })
          }
        }
    } else {
      fs.mkdirSync('uploads')
      fs.mkdirSync('uploads/member')
      await photo.mv(`uploads/member/${photo.name}`),
        (error) => {
          if (error) {
            return res.json({ message: 'fail', code: '400', storeError: error })
          }
        }
    }
    return res.json({ message: 'success', photo: photo.name, code: '200' })
  } else {
    console.log('沒有上傳檔案')
    return res.json({ message: 'fail', code: '409' })
  }
})

// POST - 上傳檔案用，使用multer
// 注意: 使用nulter會和express-fileupload衝突，所以要先註解掉express-fileupload的使用再作測試
// 在app.js中的app.use(fileUpload())
router.post(
  '/upload2',
  upload.single('avatar'), // 上傳來的檔案(這是單個檔案，欄位名稱為avatar)
  async function (req, res, next) {
    // req.file 即上傳來的檔案(avatar這個檔案)
    // req.body 其它的文字欄位資料…
    console.log(req.file, req.body)

    if (req.file) {
      console.log(req.file)
      return res.json({ message: 'success', code: '200' })
    } else {
      console.log('沒有上傳檔案')
      return res.json({ message: 'fail', code: '409' })
    }
  }
)

// POST - 新增會員資料
router.post('/', async function (req, res, next) {
  // 從react傳來的資料(json格式)，id由資料庫自動產生
  // 資料範例
  // {
  //     "name":"金妮",
  //     "email":"ginny@test.com",
  //     "account":"ginny",
  //     "password":"12345"
  //     "rePassword":"12345"
  // }

  // user是從瀏覽器來的資料
  const user = req.body

  // 檢查從瀏覽器來的資料，如果為空物件則失敗  postman會錯誤
  if (isEmpty(user)) {
    return res.json({
      message: 'fail',
      code: '400',
    })
  }

  // 這裡可以再檢查從react來的資料，哪些資料為必要(name, username...)
  console.log(user)
  const { name, email, account, password, rePassword } = user

  const errors = {}
  // // 格式判斷
  // // 正規表達式
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  const accountRegex = /^[a-zA-Z0-9_-]{3,16}$/
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/

  if (!emailRegex.test(email)) {
    errors.email = '信箱格式不正確'
  }
  if (!accountRegex.test(account)) {
    errors.account = '請輸入3~16個字符的字母、數字、_、-'
  }
  if (!accountRegex.test(name)) {
    errors.name = '請輸入3~16個字符的字母、數字、_、-'
  }

  if (passwordRegex.test(password)) {
    errors.password = '請輸入最少5個字符的字母、數字'
  }
  if (passwordRegex.test(rePassword)) {
    errors.rePassword = '請輸入最少5個字符的字母、數字'
  }

  //判斷密碼是否一致

  if (password != rePassword) {
    errors.password = '密碼與確認密碼不一致'
    errors.rePassword = '密碼與確認密碼不一致'
  }
  // 判斷是否為空
  if (account == '') {
    errors.account = '請輸入帳號名稱'
  }
  if (name == '') {
    errors.name = '請輸入會員名稱'
  }
  if (password == '') {
    errors.password = '請輸入密碼'
  }
  if (rePassword == '') {
    errors.rePassword = '請輸入確認密碼'
  }
  if (email == '') {
    errors.email = '請輸入信箱'
  }

  // // 先查詢資料庫是否有同account的資料
  const count = await getCount({
    account: user.account,
  })
  // // 先查詢資料庫是否有同email的資料
  const count2 = await getCount({
    email: user.email,
  })
  // // 檢查使用者是否存在
  if (count) {
    errors.account = '帳號已存在'
  }
  if (count2) {
    errors.email = '信箱已有人使用'
  }
  // console.log(errors)
  if (Object.keys(errors).length > 0) {
    // 如果 errors 对象不为空，将它包含在响应中
    return res.json({ message: 'fail', errors, code: 400 })
  }
  delete user.rePassword
  // // 新增至資料庫
  const result = await createUser(user)

  // // 不存在insertId -> 新增失敗
  if (!result.insertId) {
    errors.systemMessage = '註冊失敗'
    return res.json({ message: 'fail', errors, code: '400' })
  }

  // // 成功加入資料庫的回應
  return res.json({
    message: 'success',
    errors,
    code: '200',
    user: { ...user, id: result.insertId },
  })
})

// PUT - 更新會員資料
router.put('/:userId', async function (req, res, next) {
  const userId = req.params.userId
  const user = req.body.userEditData
  const userOld = req.body.userData

  // console.log(userId, user)

  // 檢查是否有從網址上得到userId
  // 檢查從瀏覽器來的資料，如果為空物件則失敗
  if (!userId || isEmpty(user)) {
    return res.json({ message: 'error', code: '400' })
  }

  // 這裡可以再檢查從react來的資料，哪些資料為必要(name, username...)
  // 先刪除不能跟改的資料
  delete user.id
  delete user.account
  delete user.email

  const errors = {}
  // console.log(user)
  if (user.gender == '') {
    user.gender = 'male'
  }
  // 判斷有沒有改密碼
  if (
    (user.rePassword == '' && userOld.password == user.password) ||
    (user.rePassword == userOld.password && user.password == userOld.password)
  ) {
    delete user.password
    delete user.rePassword
  }
  // // 格式判斷
  // // 正規表達式
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/
  const phoneRegex = /^(09\d{8})$/

  if (!phoneRegex.test(user.phone)) {
    errors.phone = '電話格式不正確'
  }
  // 判斷是否為空

  if (user.name == '') {
    errors.name = '請輸入會員名稱'
  }
  if (user.phone == '') {
    errors.phone = '請輸入電話'
  }
  if (user.address == '') {
    errors.address = '請輸入地址'
  }
  if (user.birthday == '') {
    errors.birthday = '請選擇生日日期'
  }
  const havePassword = hasKey(user, 'password')

  if (havePassword) {
    if (passwordRegex.test(user.password)) {
      errors.password = '請輸入最少5個字符的字母、數字2'
    }
    if (passwordRegex.test(user.rePassword)) {
      errors.rePassword = '請輸入最少5個字符的字母、數字1'
    }
    // 判斷有沒有密碼與確認密碼是否一致
    if (user.password != user.rePassword) {
      errors.password = '密碼與確認密碼不一致'
      errors.rePassword = '密碼與確認密碼不一致'
    }
    if (user.password == '') {
      errors.password = '請輸入密碼'
    }
    if (user.rePassword == '') {
      errors.rePassword = '請輸入確認密碼'
    }
  }

  // console.log(errors)
  // console.log(user)
  if (Object.keys(errors).length > 0) {
    // 如果 errors 对象不为空，将它包含在响应中
    return res.json({ message: 'fail', errors, code: 400 })
  }
  delete user.rePassword
  // 對資料庫執行update
  const result = await updateUserById(user, userId)
  // console.log(result)

  // 沒有更新到任何資料
  if (!result.affectedRows) {
    return res.json({ message: 'fail', code: '400' })
  }

  // 最後成功更新
  return res.json({ message: 'success', code: '200' })
})
router.get('/collect/album/:id', async function (req, res, next) {
  const id = req.params.id
  console.log(id)
  const sql = `SELECT ac.id AS id, ac.member_id, ac.album_id AS album_id,
  a.title, a.artist, a.label, a.format, a.country, a.language_id,
  a.released_date, a.year, a.cover_image, a.discogs_id, a.description, a.price, a.stock_num,
  a.created_at, a.valid
FROM album_collect AS ac
INNER JOIN album AS a ON ac.album_id = a.id
WHERE ac.member_id =${id};`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  const books = rows.map((v) => ({
    ...v,
  }))

  res.json(books)
})

router.get('/collect/event-management/:id', async function (req, res, next) {
  const id = req.params.id
  console.log(id)
  const sql = `SELECT ec.id AS id, ec.member_id, ec.event_id, em.id AS event_management_id, em.images, em.names, em.dates,
  em.location_id, em.price, em.statuss, em.launch_date, em.descriptions, em.longitude, em.latitude,
  em.location_name, em.address, em.region_id, em.region
FROM event_collect AS ec
INNER JOIN event_management AS em ON ec.event_id = em.id
WHERE ec.member_id = ${id};
`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  const books = rows.map((v) => ({
    ...v,
  }))

  res.json(books)
})
router.get('/collect/course/:id', async function (req, res, next) {
  const id = req.params.id
  console.log(id)
  const sql = `SELECT cc.id AS id, cc.member_id, cc.course_id, c.course_id AS course_course_id, c.img, c.name, c.directions,
  c.price, c.up_date, c.shelf_time, c.valid, c.teacher_id
FROM course_collect AS cc
INNER JOIN course AS c ON cc.course_id = c.course_id
WHERE cc.member_id = ${id};
;
`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  const books = rows.map((v) => ({
    ...v,
  }))

  res.json(books)
})
// 訂單
router.get('/order/:id', async function (req, res, next) {
  const id = req.params.id
  console.log(id)
  // 以各大類做分類取值
  const albumSql = `
  SELECT order_form.id,order_form.order_number,order_form.Source_id,order_form.product_id,album.title AS name,album.price,order_form.payment_method,order_form.Order_date,order_form.quantity,order_form.ch_id,ch.discountCode,ch.countType,ch.discount,order_form.member_id
  FROM order_form 
  LEFT JOIN ch ON order_form.ch_id=ch.id
  LEFT JOIN album ON order_form.product_id=album.id
  WHERE order_form.Source_id=1 AND order_form.member_id=${id};
  `
  const albums = (await executeQuery(albumSql)).rows
  // console.log(albums)
  const eventSql = `
  SELECT order_form.id,order_form.order_number,order_form.Source_id,order_form.product_id,event_management.names AS name,event_management.price,order_form.payment_method,order_form.Order_date,order_form.quantity,order_form.ch_id,ch.discountCode,ch.countType,ch.discount,order_form.member_id
  FROM order_form
  LEFT JOIN ch ON order_form.ch_id=ch.id
  LEFT JOIN event_management ON order_form.product_id=event_management.id
  WHERE order_form.Source_id=2 AND order_form.member_id=${id}
      `
  const events = (await executeQuery(eventSql)).rows
  // console.log(events)
  const courseSql = `
  SELECT order_form.id,order_form.order_number,order_form.Source_id,order_form.product_id,course.name AS name,course.price,order_form.payment_method,order_form.Order_date,order_form.quantity,order_form.ch_id,ch.discountCode,ch.countType,ch.discount,order_form.member_id
  FROM order_form
  LEFT JOIN ch ON order_form.ch_id=ch.id
  LEFT JOIN course ON order_form.product_id=course.course_id
  WHERE order_form.Source_id=3 AND order_form.member_id=${id}
      `
  const courses = (await executeQuery(courseSql)).rows
  // console.log(courses)
  // 合併
  const rows = [...albums, ...events, ...courses]
  console.log(rows)

  // 以訂單編號做分類
  const classifyRows = rows.reduce((result, item) => {
    // 使用 category 作为键
    const key = item.order_number
    // 如果 result 中没有以该键为键的数组，就创建一个空数组
    if (!result[key]) {
      result[key] = []
    }
    // 将当前对象添加到相应分类的数组中
    result[key].push(item)
    return result
  }, {})
  // console.log(classifyRows)

  res.json(classifyRows)
})
// 訂單票券
router.get('/order/coupon/:id', async (req, res, next) => {
  const id = req.params.id
  const sql = `SELECT * FROM ch WHERE ch.id=${id}`

  const { rows } = await executeQuery(sql)

  console.log(rows)

  const books = rows.map((v) => ({
    ...v,
  }))

  res.json(books)
})
// 票券
router.get('/coupon/:id', async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  const sql = `SELECT
  ch.*,
  counttype.count_type AS countType,
  CASE
      WHEN coupon_use.member_id =${id} THEN '已使用'
      ELSE '未使用'
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
