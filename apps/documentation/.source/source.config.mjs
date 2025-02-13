// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var config = defineDocs({
  dir: "content/docs"
});
var { docs, meta } = config;
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs,
  meta
};
