import { docs, meta } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader, type LoaderOutput, type LoaderConfig, type PageData } from "fumadocs-core/source";

interface FileInfo {
  path: string;
  absolutePath: string;
}

interface DocEntry extends PageData {
  title: string;
  description?: string;
  _file: FileInfo;
}

interface MetaEntry {
  title: string;
  description?: string;
  _file: FileInfo;
}

export const source: LoaderOutput<LoaderConfig> = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs as DocEntry[], meta as MetaEntry[]),
});
