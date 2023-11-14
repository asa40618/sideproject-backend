import express from 'express'
import { executeQuery } from '../models/base.js'
const router = express.Router()

// GET /:pid 路由
router.get('/:pid', async (req, res, next) => {
  const pid = req.params.pid // 從路由參數中獲取pid值
  try {
    const sql = `
    SELECT * FROM album WHERE id = ${pid}
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
// 測試
//http://localhost:3005/api/album/1

//hhh
router.get('/:pid/categories', async (req, res, next) => {
  const pid = req.params.pid
  try {
    const sql = `
    SELECT * FROM music_category WHERE album_id = ${pid}
    `
    const { rows } = await executeQuery(sql)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})
// 測試
// http://localhost:3005/api/album/1/categories

router.get('/:pid/tracklist', async (req, res, next) => {
  const pid = req.params.pid
  try {
    const sql = `
    SELECT album_track.* FROM album_track WHERE album_track.discogs_id IN ( SELECT discogs_id FROM album WHERE id = ${pid} )
    `
    const { rows } = await executeQuery(sql)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})

// SELECT album_track.* FROM album JOIN album_track ON album.discogs_id = album_track.discogs_id WHERE album.id = 1;
// 測試
// http://localhost:3005/api/album/1/tracklist

//預設
router.get('/', async (req, res, next) => {
  try {
    // const sql = `SELECT * FROM album `
    const sql = `SELECT album.*, album_language.language
    FROM album
    LEFT JOIN album_language ON album.language_id = album_language.id;`
    // const sql = `SELECT * FROM album WHERE id >=  1 AND  id <= 12`
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
//http://localhost:3005/api/album/

//hhh
router.get('/page/:page', async (req, res, next) => {
  try {
    const itemsPerPage = 12 // 每頁顯示的項目數
    const page = req.params.page || 1 // 如果未指定 page，默認為第 1 頁
    const startItem = (page - 1) * itemsPerPage // 計算起始項目

    const sql = `
      SELECT *
      FROM album
      WHERE valid = 1
      ORDER BY album.id ASC
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
//測試
// http://localhost:3005/api/album/page/2

router.get('/cate/:categoryId', async (req, res, next) => {
  const categoryId = req.params.categoryId

  try {
    const sql = `
      SELECT album.*
      FROM album
      INNER JOIN music_category ON album.id = music_category.album_id
      WHERE music_category.category_id = ${categoryId};
    `
    const { rows } = await executeQuery(sql, categoryId)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})
//測試
//http://localhost:3005/api/album/cate/7

router.get('/cate/:categoryId/page/:page', async (req, res, next) => {
  const categoryId = req.params.categoryId
  const page = req.params.page || 1 // 如果未指定 page，默認為第 1 頁

  try {
    const itemsPerPage = 12 // 每頁顯示的項目數
    const startItem = (page - 1) * itemsPerPage // 計算起始項目

    const sql = `
      SELECT album.*
      FROM album
      INNER JOIN music_category ON album.id = music_category.album_id
      WHERE music_category.category_id = ${categoryId}
      LIMIT ${startItem}, ${itemsPerPage}
    `

    const { rows } = await executeQuery(sql, [
      categoryId,
      startItem,
      itemsPerPage,
    ])
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})
//測試
// http://localhost:3005/api/album/cate/7/page/1
// http://localhost:3005/api/album/cate/7/page/2

//jjj
// router.post('/search', async (req, res, next) => {
//   try {
//     const min = req.body.min || 0
//     const max = req.body.max || 999999
//     const start = req.body.start || '1900-01-01'
//     const end = req.body.end || '2099-12-31'

//     const sql = `
//       SELECT * FROM album WHERE price > ${min} AND price < ${max} AND released_date > '${start}' AND released_date < '${end}'
//     `
//     const values = [min, max, start, end]

//     const { rows } = await executeQuery(sql, values)
//     console.log(rows)
//     res.json(rows)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Database query error' })
//   }
// })
router.post('/search', async (req, res, next) => {
  try {
    const min = req.body.min
    const max = req.body.max
    const start = req.body.start
    const end = req.body.end
    const categoryId = req.body.categoryId || null
    // const sql = `WITH RankedAlbums AS (
    //   SELECT album.*,
    //          music_category.category_id,
    //          ROW_NUMBER() OVER (PARTITION BY album.id ORDER BY music_category.category_id ASC) as rn
    //   FROM album
    //   INNER JOIN music_category ON album.id = music_category.album_id
    //   WHERE (price > ${min} AND price < ${max})
    //     AND (released_date > '${start}' AND released_date < '${end}')
    //     ${categoryId ? `AND music_category.category_id = ${categoryId}` : ''}
    // )
    // SELECT * FROM RankedAlbums WHERE rn = 1;
    // `

    const sql = `WITH RankedAlbums AS (
      SELECT album.*,
             music_category.category_id,
             ROW_NUMBER() OVER (PARTITION BY album.id ORDER BY music_category.category_id ASC) as rn
      FROM album
      INNER JOIN music_category ON album.id = music_category.album_id
      WHERE (price > ${min} AND price < ${max})
        AND (released_date > '${start}' AND released_date < '${end}')
        ${categoryId ? `AND music_category.category_id = ${categoryId}` : ''}
    )
    SELECT RankedAlbums.*,album_language.language FROM RankedAlbums 
    LEFT JOIN album_language ON RankedAlbums.language_id = album_language.id
    
    WHERE rn = 1;`
    const values = [min, max, start, end, categoryId]

    const { rows } = await executeQuery(sql, values)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})

//cate
router.post('/catego', async (req, res, next) => {
  try {
    const cate = req.body.cate
    // const sql = `
    //   SELECT album.*
    //   FROM album
    //   INNER JOIN music_category ON album.id = music_category.album_id
    //   WHERE music_category.category_id = ${cate};
    // `
    const sql = `SELECT album.*,album_language.language
FROM album
INNER JOIN music_category ON album.id = music_category.album_id
LEFT JOIN album_language ON album.language_id = album_language.id
WHERE music_category.category_id = ${cate};`
    const { rows } = await executeQuery(sql, cate)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})
//測試
//http://localhost:3005/api/album/cate/7

//iii
router.get('/qs/:min/:max/:start/:end/:page', async (req, res, next) => {
  try {
    const min = req.params.min
    const max = req.params.max
    const start = req.params.start
    const end = req.params.end
    const page = req.params.page || 1 // 如果未指定 page，默認為第 1 頁
    const itemsPerPage = 12 // 每頁顯示的項目數
    const startItem = (page - 1) * itemsPerPage // 計算起始項目

    const sql = `
    SELECT * FROM album WHERE price > ${min} AND price < ${max} AND released_date > '${start}' AND released_date < '${end}' LIMIT ${startItem}, ${itemsPerPage}
    `
    const values = [min, max, start, end]

    const { rows } = await executeQuery(sql, values)
    console.log(rows)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Database query error' })
  }
})
// http://localhost:3005/api/album/search?minPrice=509&maxPrice=555&dateStart=2005-12-31&dateEnd=2023-10-01
// http://localhost:3005/api/album/qs?min=509&max=555&start=2005-12-31&end=2023-10-01
// http://localhost:3005/api/album/qs/477/523/1998-01-01/2012-12-21/2

export default router
