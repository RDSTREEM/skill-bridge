import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { theme } = require("./tailwind.config");

const nextConfig: NextConfig = {
  theme: {
    extend: {
      ...theme.extend,
    },
  },
};

export default nextConfig;

