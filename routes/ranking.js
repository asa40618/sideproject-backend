import express from 'express'
import { executeQuery } from '../models/base.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const sql = `SELECT album.id, album.title, album.artist, album.cover_image, (SELECT COUNT(*) FROM album_collect WHERE album_collect.album_id = album.id ) AS total_collect FROM album ORDER BY total_collect DESC LIMIT 10;`

  try {
    const { rows } = await executeQuery(sql)
    const randomAudioSource = ['TORATORAW', 'MarshallMathers', 'BeastieBoys']
    let usedSources = []

    const rankingData = rows.map((row, index) => {
      let selectedSource

      if (index < 3) {
        // 前三首確保不重複
        do {
          selectedSource =
            randomAudioSource[
              Math.floor(Math.random() * randomAudioSource.length)
            ]
        } while (usedSources.includes(selectedSource))
        usedSources.push(selectedSource)
      } else {
        // 其他隨機，不包含第三首
        const availableSources = randomAudioSource.filter(
          (source) => source !== usedSources[2]
        )
        selectedSource =
          availableSources[Math.floor(Math.random() * availableSources.length)]
      }

      return {
        id: row.id,
        title: row.title,
        artist: row.artist,
        images: row.cover_image,
        collectAccount: row.total_collect,
        audioSource: selectedSource,
      }
    })

    await res.json(rankingData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '資料庫讀取失敗' })
  }
})

router.get('/pop', async (req, res) => {
  const sql = `SELECT album.id, album.title, album.artist, album.cover_image, 
  (SELECT COUNT(*) 
   FROM album_collect 
   WHERE album_collect.album_id = album.id
  ) AS total_collect
FROM album
WHERE album.id IN (SELECT album_id FROM music_category WHERE category_id = 6)
ORDER BY total_collect DESC
LIMIT 10;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    const rankingData = rows.map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist, // 這裡使用 'row.singer'，因為 SQL 查詢中使用的是 'artist.singer'
      images: row.cover_image,
      collectAccount: row.total_collect,
      audioSource:
        'https://www.youtube.com/embed/VaAacrLk4gE?si=W1Wkle8J9tu600ko',
    }))

    res.json(rankingData) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: 'y 資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})

router.get('/rock', async (req, res) => {
  const sql = `SELECT album.id, album.title, album.artist, album.cover_image, 
  (SELECT COUNT(*) 
   FROM album_collect 
   WHERE album_collect.album_id = album.id
  ) AS total_collect
FROM album
WHERE album.id IN (SELECT album_id FROM music_category WHERE category_id = 7)
ORDER BY total_collect DESC
LIMIT 10;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    const rankingData = rows.map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist, // 這裡使用 'row.singer'，因為 SQL 查詢中使用的是 'artist.singer'
      images: row.cover_image,
      collectAccount: row.total_collect,
      audioSource:
        'https://www.youtube.com/embed/VaAacrLk4gE?si=W1Wkle8J9tu600ko',
    }))

    res.json(rankingData) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: 'y 資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})

router.get('/hiphop', async (req, res) => {
  const sql = `SELECT album.id, album.title, album.artist, album.cover_image, 
  (SELECT COUNT(*) 
   FROM album_collect 
   WHERE album_collect.album_id = album.id
  ) AS total_collect
FROM album
WHERE album.id IN (SELECT album_id FROM music_category WHERE category_id = 4)
ORDER BY total_collect DESC
LIMIT 10;`

  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    const rankingData = rows.map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist, // 這裡使用 'row.singer'，因為 SQL 查詢中使用的是 'artist.singer'
      images: row.cover_image,
      collectAccount: row.total_collect,
      audioSource:
        'https://www.youtube.com/embed/VaAacrLk4gE?si=W1Wkle8J9tu600ko',
    }))

    res.json(rankingData) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: 'y 資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})

router.get('/soul', async (req, res) => {
  const sql = `SELECT album.id, album.title, album.artist, album.cover_image, 
  (SELECT COUNT(*) 
   FROM album_collect 
   WHERE album_collect.album_id = album.id
  ) AS total_collect
FROM album
WHERE album.id IN (SELECT album_id FROM music_category WHERE category_id = 3)
ORDER BY total_collect DESC
LIMIT 10;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    const rankingData = rows.map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist, // 這裡使用 'row.singer'，因為 SQL 查詢中使用的是 'artist.singer'
      images: row.cover_image,
      collectAccount: row.total_collect,
      audioSource:
        'https://www.youtube.com/embed/VaAacrLk4gE?si=W1Wkle8J9tu600ko',
    }))

    res.json(rankingData) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: 'y 資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})

router.get('/country', async (req, res) => {
  const sql = `SELECT album.id, album.title, album.artist, album.cover_image, 
  (SELECT COUNT(*) 
   FROM album_collect 
   WHERE album_collect.album_id = album.id
  ) AS total_collect
FROM album
WHERE album.id IN (SELECT album_id FROM music_category WHERE category_id = 2)
ORDER BY total_collect DESC
LIMIT 10;`
  try {
    const { rows } = await executeQuery(sql)
    console.log(rows)
    const rankingData = rows.map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist, // 這裡使用 'row.singer'，因為 SQL 查詢中使用的是 'artist.singer'
      images: row.cover_image,
      collectAccount: row.total_collect,
      audioSource:
        'https://www.youtube.com/embed/VaAacrLk4gE?si=W1Wkle8J9tu600ko',
    }))

    res.json(rankingData) // 將結果以JSON格式回傳
  } catch (error) {
    console.error(error) // 调试用途
    res.status(500).json({ error: 'y 資料庫讀取失敗' }) // 發生錯誤時，返回500狀態碼和錯誤信息
  }
})
export default router
