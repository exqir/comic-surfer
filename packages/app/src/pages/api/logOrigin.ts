import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Incoming request', req.headers)
  res.json({ from: req.headers })
}
