module.exports = {
  swcMinify: true,
  env: {
    API_HOST:
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      process.env.NEXT_PUBLIC_API_HOST ||
      '',
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
