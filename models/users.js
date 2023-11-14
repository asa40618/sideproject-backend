// 資料庫查詢處理函式
import {
  find,
  count,
  findOneById,
  insertOne,
  insertMany,
  remove,
  updateById,
  cleanTable,
  findOne,
} from './base.js'

// 定義資料庫表格名稱
const table = 'member'

// 所需的資料處理函式
const getUsers = async () => {
  const { rows } = await find(table)
  return rows
}
const getUserById = async (id) => await findOneById(table, id)
const getCount = async (where) => await count(table, where)
const createUser = async (user) => {
  // console.log(user)
  // 現在時間
  // 创建一个表示当前日期和时间的 Date 对象
  const currentDateTime = new Date()

  // 提取年、月、日、小时、分钟和秒
  const year = currentDateTime.getFullYear()
  const month = currentDateTime.getMonth() + 1 // 月份从 0 开始，所以要加 1
  const day = currentDateTime.getDate()
  const hours = currentDateTime.getHours()
  const minutes = currentDateTime.getMinutes()
  const seconds = currentDateTime.getSeconds()

  // 根据需要格式化日期时间字符串
  const formattedDateTime = `${year}-${month < 10 ? '0' : ''}${month}-${
    day < 10 ? '0' : ''
  }${day} ${hours}:${minutes}:${seconds}`

  // 输出当前日期时间
  // console.log('当前日期时间:', formattedDateTime)
  user.created_at = formattedDateTime
  return await insertOne(table, user)
}
const createBulkUsers = async (users) => await insertMany(table, users)
const deleteUserById = async (id) => await remove(table, { id })

// 針對PUT更新user資料
const updateUserById = async (user, id) => await updateById(table, user, id)
const updateUser = async (user) => await updateById(table, user, user.id)
const hasKey = (obj, keyToCheck) =>
   Object.prototype.hasOwnProperty.call(obj, keyToCheck)

// 登入使用
const verifyUser = async ({ account, password }) =>
  Boolean(await count(table, { account, password }))

const getUser = async ({ account, password }) =>
  await findOne(table, { account, password })

// 其它用途
const cleanAll = async () => await cleanTable(table)

export {
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
}
