module.exports = {
  swcMinify: true,
  env: {
    API_HOST: process.env.VERCEL_URL || process.env.API_HOST || '',
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
