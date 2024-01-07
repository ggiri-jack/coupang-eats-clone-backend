import { Menu } from '@/db/models/menu'
import express from 'express'

const router = express.Router()

router.get('/:menuId', async (req, res) => {
  const { menuId } = req.params

  try {
    const menu = await Menu.findOne({ _id: menuId })
    res.status(200).json(menu)
  } catch (error) {
    console.error('메뉴 가져오던중 에러 발생', error)
    res.sendStatus(500)
  }
})

router.get('/store/:storeId', async (req, res) => {
  const { storeId } = req.params

  try {
    const menus = await Menu.find({ store: storeId })
    res.status(200).json(menus)
  } catch (error) {
    console.error('get menu error', error)
    res.sendStatus(500)
  }
})

export default router
