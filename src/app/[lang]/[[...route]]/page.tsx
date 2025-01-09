import { jsonToLayoutAdapter } from "@/coremedia-integration/adapters/JsonToLayoutAdapter";
import { cmsRepo } from "@/graphql/CMSRepo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import getMetaData from "@/lib/server-actions";

// Components
import GridLayout from "@/components/GridLayout";

type Props = {
  params: { lang: string; route: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadata = await getMetaData(params?.lang, params?.route?.join("/"));
  
  try {
    const meta: Metadata = {
      title: metadata.title || "404 - Page Not Found",
      description: metadata.description,
      robots: { index: true, follow: true },
      icons: [{ type: "image/x-icon", rel: "icon", url: "/favicon.ico" }],
    };

    return meta;
  } catch (err) {
    return {
      title: "404",
      description: "404",
      robots: { index: false, follow: false },
    };
  }
}

export default async function PageGenerator({ params }: Props) {
  const { route, lang } = await params;

  // Fetch data from graphql
  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`;
  const cmsResp = await cmsRepo.getLayoutData(cmLanguage, (route || []).join("/"));
  const layoutData = jsonToLayoutAdapter.adapt(cmsResp);

  const url = {
    route: route,
    locale: lang,
  };
  if (!layoutData?.widgets?.length) notFound();

  return <GridLayout data={layoutData} url={url} />;
}
