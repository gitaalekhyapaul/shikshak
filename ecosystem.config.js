module.exports = {
  apps: [
    {
      name: "HackThisFall-2020",
      script: "./build/app.js",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "HackThisFall-2020 Flask",
      interpreter: "/usr/bin/python3.8",
      script: "./ML/app.py",
    },
  ],
};
