import { Store } from '@/db/models/store'
import express from 'express'
import { PipelineStage } from 'mongoose'
import { z } from 'zod'

const router = express.Router()

const DOC_IN_PAGE = 5

const Sort = z.enum(['RATING', 'REVIEW', 'DELIVERY'])

const SortQuery = {
  [Sort.Enum.RATING]: { rating: -1 },
  [Sort.Enum.REVIEW]: { reviewCount: -1 },
  [Sort.Enum.DELIVERY]: { deliveryPrice: 1 },
} as const

router.get('/', async (req, res) => {
  const querySchema = z.object({
    sort: Sort.optional().default('RATING'),
    page: z.coerce.number().optional().default(1),
    maxDeliveryPrice: z.coerce.number().optional(),
    minOrderPrice: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  })

  const parsedQuery = querySchema.safeParse(req.query)

  if (!parsedQuery.success) {
    res.sendStatus(400)
    return
  }

  const { sort, page, maxDeliveryPrice, minOrderPrice, limit } =
    parsedQuery.data

  const query: Record<string, string | object> = {}
  if (typeof maxDeliveryPrice === 'number')
    query.deliveryPrice = { $lte: maxDeliveryPrice }
  if (typeof minOrderPrice === 'number')
    query.minimumOrderPrice = { $lte: minOrderPrice }

  const storeLimit = limit || DOC_IN_PAGE
  try {
    const docs = await Store.find(query)
      .sort(SortQuery[sort])
      .limit(storeLimit)
      .skip((page - 1) * storeLimit)
      .exec()

    res.status(200).json(docs)
  } catch (error) {
    console.error('매장 리스트 에러 발생', error)
    res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const doc = await Store.findById(id)
    res.status(200).json(doc)
  } catch (error) {
    console.log('매장 정보 에러 발생', error)
    res.sendStatus(500)
  }
})

router.get('/search/:query', async (req, res) => {
  const { query } = req.params

  const querySchema = z.object({
    sort: Sort.optional().default('RATING'),
    maxDeliveryPrice: z.coerce.number().optional(),
    minOrderPrice: z.coerce.number().optional(),
  })

  const parsedQuery = querySchema.safeParse(req.query)

  if (!parsedQuery.success) {
    res.sendStatus(400)
    return
  }

  const { sort, maxDeliveryPrice, minOrderPrice } = parsedQuery.data

  try {
    const aggregationPipeline: PipelineStage[] = [
      {
        $search: {
          index: 'search_store',
          text: {
            query: query,
            path: {
              wildcard: '*',
            },
          },
        },
      },
    ]

    if (typeof maxDeliveryPrice === 'number')
      aggregationPipeline.push({
        $match: { deliveryPrice: { $lte: maxDeliveryPrice } },
      })

    if (typeof minOrderPrice === 'number')
      aggregationPipeline.push({
        $match: { minimumOrderPrice: { $lte: minOrderPrice } },
      })

    aggregationPipeline.push({
      $sort: SortQuery[sort],
    })

    const docs = await Store.aggregate(aggregationPipeline)

    res.status(200).json(docs)
  } catch (error) {
    console.log('매장 검색중 에러 발생', error)
    res.status(500).json(error)
  }
})

router.get('/category/:category', async (req, res) => {
  const { category } = req.params

  const querySchema = z.object({
    sort: Sort.optional().default('RATING'),
    page: z.coerce.number().optional().default(1),
    maxDeliveryPrice: z.coerce.number().optional(),
    minOrderPrice: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  })

  const parsedQuery = querySchema.safeParse(req.query)

  if (!parsedQuery.success) {
    res.sendStatus(400)
    return
  }

  const { sort, page, maxDeliveryPrice, minOrderPrice, limit } =
    parsedQuery.data

  const query: Record<string, string | object> = { category: category }

  if (typeof maxDeliveryPrice === 'number')
    query.deliveryPrice = { $lte: maxDeliveryPrice }
  if (typeof minOrderPrice === 'number')
    query.minimumOrderPrice = { $lte: minOrderPrice }

  const storeLimit = limit || DOC_IN_PAGE

  try {
    const docs = await Store.find(query)
      .sort(SortQuery[sort])
      .limit(storeLimit)
      .skip((page - 1) * storeLimit)
      .exec()
    res.status(200).json(docs)
  } catch (error) {
    console.error('카테고리별 매장 에러 발생', error)
    res.sendStatus(500)
  }
})

export default router
