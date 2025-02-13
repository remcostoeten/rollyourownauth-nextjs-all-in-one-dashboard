import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import type { PageData } from "fumadocs-core/source";

interface DocEntry extends PageData {
  title: string;
  description?: string;
}

export const { docs, meta } = defineDocs({
  dir: "content/docs",
  baseUrl: "/docs",
});

export default defineConfig({
  name: "Documentation",
  description: "Project documentation and guides",
  theme: {
    accentColor: "#0ea5e9",
  },
});
