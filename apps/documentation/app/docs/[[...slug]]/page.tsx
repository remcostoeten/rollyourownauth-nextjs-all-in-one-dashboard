import { source } from "../../../lib/source";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Documentation for the project",
};

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  // Add console.log to inspect the page object structure
  console.log('Page object:', JSON.stringify(page, null, 2));

  return (
    <DocsPage>
      <DocsBody>
        {/* Temporarily comment out MDX rendering until we figure out the correct structure */}
        <div>Loading...</div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}
