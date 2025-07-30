import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://boss-jennet-34531.upstash.io',
  token: 'AYbjAAIjcDFlYmQ2YWQ3ZDljYjE0OWYzODVkMjUwYTIwMjI2YmM4OXAxMA',
})

export default redis 