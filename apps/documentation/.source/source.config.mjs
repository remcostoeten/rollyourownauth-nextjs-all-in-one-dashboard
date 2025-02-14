// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var { docs, meta } = defineDocs({
  dir: "content/docs",
  baseUrl: "/docs"
});
var source_config_default = defineConfig({
  name: "Documentation",
  description: "Project documentation and guides",
  theme: {
    accentColor: "#0ea5e9"
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
