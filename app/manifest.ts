import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION } from "./lib/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OAKit — Office Agent Kit",
    short_name: "OAKit",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f5faf7",
    theme_color: "#087a4c",
    icons: [
      {
        src: "/oakit-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
