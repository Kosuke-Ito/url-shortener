import { Hono } from 'hono'
import { renderer } from './renderer'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

type Bindings = {
  KV: KVNamespace
}

const app = new Hono<{
  Bindings: Bindings
}>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div>
      <h2>Create shorten URL!</h2>
      <form action="/create" method="post">
        <input
          type="text"
          name="url"
          autocomplete="off"
          style={{
            width: '80%',
          }}
        />
        &nbsp;
        <button type="submit">Create</button>
      </form>
    </div>
  )
})

const schema = z.object({
  url: z.string().url(),
})
const validator = zValidator('form', schema)

app.post('/create', validator, async (c) => {
  const { url } = c.req.valid('form')
  console.log(url)
  return c.json({ message: 'URL created' })
})

export default app
