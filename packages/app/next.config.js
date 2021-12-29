module.exports = {
  swcMinify: true,
  env: {
    API_HOST: process.env.API_HOST || 'https://' + process.env.VERCEL_URL,
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'https://comic-surfer-api.fly.dev',
      },
    ]
  },
}
