module.exports = {
  apps: [
    {
      name: "dagone-backend",
      script: "pnpm",
      args: "--filter @lj/backend start",
      interpreter: "none",
      cwd: __dirname,
    },
    {
      name: "dagone-frontend",
      script: "pnpm",
      args: "--filter @lj/frontend start -- -p 3010 -H 127.0.0.1",
      interpreter: "none",
      cwd: __dirname,
    },
  ],
};
