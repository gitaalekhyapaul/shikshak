module.exports = {
  apps: [
    {
      name: "Shikshak: Node.js Server",
      script: "./build/app.js",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "Shikshak: Flask Server",
      script: "chmod +x ./run.sh && ./run.sh",
    },
  ],
};
