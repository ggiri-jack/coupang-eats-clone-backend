import { User } from '@/db/models/user'
import express from 'express'

const router = express.Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const doc = await User.findById(id)
    res.status(200).json(doc)
  } catch (error) {
    console.error('유저 정보 에러 발생', error)
    res.sendStatus(500)
  }
})

export default router
