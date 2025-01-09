import { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/middleware";
import { localeSegmentRemoval } from "@/lib/utilities";
import { SITEMAP_TO_REMOVE } from "@/lib/constants/SITEMAP_TO_REMOVE";
import { StaticPathsAdapter } from "@/coremedia-integration/adapters/staticPathsAdapter";
import { cmsRepo } from "@/graphql/CMSRepo";
import { Nullable } from "@/models/Nullable.interface";

interface ICMSPathIds {
  id: string;
  root: {
    segment: string;
  };
  modificationDate: string;
  hiddenInSitemap: boolean;
}

export interface IFilteredLocalePaths {
  path: string,
  modificationDate: string,
  isPriority: boolean,
}

interface IAdaptedRes {
  params: { slug: string; page: string[] };
  locale: string;
  modificationDate: string;
}

function getLocale(request: NextRequest) {
  const locale = request.nextUrl.pathname
    .split("/")
    .filter((route: string) => !!route)?.[0];
  const currentLocale = locales.find((item: string) => item === locale);

  return currentLocale;
};

function generateSitemap(
  locale: string | null,
  filteredLocalePaths: Nullable<IFilteredLocalePaths[]>,
  cmsLocales: string[],
  protocol: string,
  host: string
) {
  if (locale) {
    // Locale
    return `
        <urlset 
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        >
          ${filteredLocalePaths
            ?.filter((path) => !!path)
            ?.map((path) => {
              const modDate = path?.modificationDate?.replace(/Z\[GMT\]/, "");

              return `
              <url>
                <loc>${path?.path}</loc>
                <lastmod>${modDate}+00:00</lastmod>
                <priority>${path?.isPriority ? "1.0" : "0.8"}</priority>
              </url>`;
            })
            .join("")}
        </urlset>
      `;
  } else {
    // Index
    return `
      <sitemapindex xmlns:xhtml="http://www.w3.org/TR/xhtml11/xhtml11_schema.html" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${cmsLocales
          ?.map((x: string) => {
            return `<sitemap><loc>${protocol}://${host}/${
              x ? x + "/" : ""
            }sitemap.xml</loc></sitemap>`;
          })
          .join("")}
      </sitemapindex>
      `;
  }
};

// Start Content
export async function GET(request: NextRequest) {
  const locale = getLocale(request) || "ww";
  const url = new URL(request.url);
  const { protocol, host } = url;

  try {
    // CMS Request
    const adapter = new StaticPathsAdapter();

    const cmsPathIds = await cmsRepo.getPathsId();
  
    const pathIdArr = cmsPathIds?.data?.content?.sites?.map((site: ICMSPathIds) => {
      return {
        id: site.id,
        locale: localeSegmentRemoval(site.root.segment)?.replace("/", "") || defaultLocale,
        modificationDate: site?.modificationDate || "",
        hiddenInSitemap: site?.hiddenInSitemap || false,
      };
    })
    .filter((pathId: { locale: string }) => locales.includes(pathId.locale));
    const currentLocale = pathIdArr.find(
      (path: { locale: string }) => path.locale === locale
    );

    const pathsData = await cmsRepo.getPathsData(currentLocale.id);
    const adaptedRes = adapter
      .adapt(pathsData)
      .filter(
        (adapted: { hiddenInSitemap: boolean }) =>
          adapted.hiddenInSitemap === false
      );

    const filteredLocalePaths: IFilteredLocalePaths[] | null = adaptedRes?.map((path: IAdaptedRes) => {
      const isRoot = path?.params?.slug?.length <= 0;

      const page = path?.params?.page?.join("/");
      const isToRemove = SITEMAP_TO_REMOVE.includes(page);

      if(isToRemove) return null;
      return {
        path: isRoot
          ? (`${protocol}://${host}/${path.locale}/`).replace(`/${defaultLocale}`, "")
          : (`${protocol}://${host}/${path.locale}/${page}${page ? "/" : ""}`).replace(`/${defaultLocale}`, ""),
        modificationDate: path.modificationDate,
        isPriority: isRoot,
      };
    });

    // Check the current environment
    const isUAT = host?.includes("uat");

    if (isUAT) {
      // If in UAT, do not generate the sitemap, and return an empty response.
      const response = new Response(JSON.stringify("404", null, 4), {
        status: 404,
        statusText: "ok",
      });

      return response;
    }

    const sitemap = generateSitemap(
      locale || null,
      filteredLocalePaths,
      locales,
      protocol,
      host
    );

    const response = new Response(sitemap, {
      status: 200,
      statusText: "ok",
    });

    response.headers.append("content-type", "text/xml");
    return response;
  } catch (err) {
    // console.log(err);

    const response = new Response(JSON.stringify(err, null, 4), {
      status: 404,
      statusText: "ok",
    });

    return response;
  }
}
