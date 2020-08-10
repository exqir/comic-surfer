import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Incoming request from', req.headers.origin)
  res.json({ from: req.headers })
}
