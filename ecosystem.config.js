module.exports = {
  apps: [
    {
      name: 'graphql-backend',
      script: './dist/src/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
