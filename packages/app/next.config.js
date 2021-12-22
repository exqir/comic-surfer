module.exports = {
  swcMinify: true,
  env: {
    VERCEL_GITHUB_COMMIT_SHA: process.env.VERCEL_GITHUB_COMMIT_SHA,
  },
}
