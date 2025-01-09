"use server";

import { cmsRepo } from "@/graphql/CMSRepo";
import { getAkamayUrl } from "./utilities";

/**
 * Add serverside actions here
 * example: form actions, etc.
 */
export default async function getMetaData(lang: string, path: string) {
  const cmsResp = await cmsRepo.getMetaData(`${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`, path || "");
  const data = cmsResp?.data?.content?.pageByPath;

  // Fetch meta data image by id
  const metaImageID = data?.settings?.MetaImg?.[0]?.replace(
    /Content\[coremedia:\/\/\/cap\/content\/|]/g,
    ""
  );

  let akamaiImageURL;
  if (metaImageID) {
    const metaImageResp = await cmsRepo.getFileLink(metaImageID);

    akamaiImageURL = metaImageResp?.data?.content?.content?.data?.uri
      ? getAkamayUrl(metaImageResp?.data?.content?.content?.data?.uri)
      : "";
  }

  return {
    title: data?.title,
    description: data?.htmlDescription,
    metaDataImage: akamaiImageURL || "",
  };
}
