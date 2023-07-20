module.exports = {
  apps : [{
    name: 'Document Tracking system',
    script: 'index.js',
    exec_mode:'cluster',
    watch:true,
    autostart:true,
    max_memory_restart: '1G',
    instances:'max',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
