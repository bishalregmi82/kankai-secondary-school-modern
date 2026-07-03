module.exports = {
  apps: [
    {
      name: "kankai-cms-api",
      script: "dist/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      },
      max_memory_restart: "512M"
    }
  ]
};
