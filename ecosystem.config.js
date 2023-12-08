module.exports = {
  apps: [
    {
      name: 'api-prod',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '512M',
    },
  ],
}
