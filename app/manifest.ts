import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION } from "./lib/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OAKit — Office Agent Kit",
    short_name: "OAKit",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#07110c",
    theme_color: "#0b6747",
    icons: [
      {
        src: "/oakit-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
