module.exports = {
  apps : [{
    name   : "api-gateway",
    script : "./src/server.js",
    instances: 4, 
    exec_mode: "cluster",
    env: {
            NODE_ENV: "production"
         }
  }]
}