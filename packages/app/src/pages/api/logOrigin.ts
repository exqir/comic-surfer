import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Incoming request from', req.headers.referer)
  res.json({ from: req.headers.referer })
}
