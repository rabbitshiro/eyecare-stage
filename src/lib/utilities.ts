import { ICta } from "@/models/ICta";
import { ICrops } from "../models/ICrops";
import { defaultLocale } from "@/middleware";

export const getAkamayUrl = (src: string) => {
  let url = "";

  if (src && src.length) {
    const basePath = process.env.NEXT_PUBLIC_AKAMAY_PATH;
    if (!basePath) return src;

    if (src.indexOf("data:") < 0) {
      if (src.indexOf(":/") >= 0) {
        const path = new URL(src);
        url = (basePath + "/" + path.pathname)
          .split("///")
          .join("/")
          .split("//")
          .join("/")
          .split(":/")
          .join("://");
      } else {
        url = (basePath + "/" + src)
          .split("///")
          .join("/")
          .split("//")
          .join("/")
          .split(":/")
          .join("://");
      }
    } else {
      url = src;
    }
  }

  return url;
};

interface IGetAdapterViewtype<T> {
  selected?: T;
  unselected?: T[];
}

export const getAdapterViewtype = (
  arr: { viewtype: string }[],
  viewtype: string
): IGetAdapterViewtype<any> => {
  return {
    selected: arr.find((item) => item.viewtype === viewtype),
    unselected: arr.filter((item) => item.viewtype !== viewtype),
  };
};

export const getAdapterImage = (obj: []) => {
  return obj?.map((img: { data?: { uri: string } }) => img?.data?.uri);
};

export const localeSegmentRemoval = (segment: string = "") => {
  // Move to APP CONFIG
  const segmentLocale = segment?.substring(0, 5).replace(/em-/, "");
  if (segmentLocale === defaultLocale)
    return segment?.replace(`${process.env.NEXT_PUBLIC_CM_SEGMENT}${defaultLocale}`, "");

  if(process.env.NEXT_PUBLIC_CM_SEGMENT) {
    return segment?.replace(process.env.NEXT_PUBLIC_CM_SEGMENT, "/");
  } else {
    return segment;
  }
};

export const getAnalyticsId = (
  placement?: string,
  level1?: string,
  level2?: string,
  level3?: string
) => {
  if (placement === "Navigation") {
    placement = "MainNav";
  }
  return [
    "X_X",
    placement?.split(" ").join(""),
    level1?.split(" ").join(""),
    level2?.split(" ").join(""),
    level3?.split(" ").join(""),
  ]
    .filter((s) => !!s)
    .join("_");
};

export interface IAdapterCTAObj {
  callToActionHash?: string;
  callToActionText?: string;
  target?: {
    id?: string;
    type?: string;
    url?: string;
    teaserText?: string;
    title?: string;
    navigationPath?: {
      segment?: string;
    }[];
  };
}

export const getAdapterCTA = (obj: IAdapterCTAObj[]): ICta[] => {
  return obj?.map((link: IAdapterCTAObj): ICta => {
    const hash = link?.callToActionHash;
    const isExternal = link?.target?.type === "CMExternalLink";

    // File download
    const isFileDownload = link?.target?.type === "CMDownload";
    if (isFileDownload) {
      return {
        label: link?.callToActionText || "",
        url: `/cap/content/${link?.target?.id}/`,
        isExternal: !!isFileDownload,
        isFileDownload: isFileDownload,
      };
    }

    // Normal Url
    const formattedPath =
      link?.target?.navigationPath
        ?.map((path: any) => localeSegmentRemoval(path?.segment))
        ?.join("/") ||
      link?.target?.url ||
      "";

    return {
      label:
        link?.callToActionText ||
        link?.target?.teaserText ||
        link?.target?.title ||
        "",
      url: isExternal
        ? `${link?.target?.url || ""}`
        : `${formattedPath}${hash ? `#${hash}` : ""}` || "#",
      isExternal: isExternal,
    };
  });
};

export interface IVideoRawData {
  data?: {
    uri?: string;
    dataUrl?: string;
  };
}
export const getAdapterVideoUrl = (data: IVideoRawData[]): string[] => {
  return data?.map((image: any) => image?.data?.uri || image?.dataUrl) || [];
};

export const getCoreMediaUrl = (str: string) => {
  const prefix = "coremedia://";
  const internalLink = str.includes(prefix);
  let pathname = localeSegmentRemoval(
    str.replace(prefix + "/", "").replace(prefix, "")
  );
  // if not footnote, add trailing slash for SEO
  if (pathname.charAt(0) !== "#" && pathname.slice(-1) !== "/") {
    pathname += internalLink ? "/" : "";
  }
  return internalLink ? window.location.origin + "/" + pathname : pathname;
};

export interface IGetAdapterCroppings {
  crops: ICrops;
  uriTemplate: string;
}

interface IRawCrops {
  name?: string;
  minWidth?: string | number;
}
export interface ICroppingsRawData {
  crops: IRawCrops[];
  uriTemplate?: string;
}

export const getAdapterCroppings = (
  pictures: ICroppingsRawData[]
): IGetAdapterCroppings[] => {
  return pictures?.map((story: ICroppingsRawData) => {
    const cropObj: ICrops = {};

    (story?.crops || []).forEach((crop: IRawCrops) => {
      const index: string = crop?.name || "";
      if (index) {
        cropObj[index] = crop?.minWidth || "";
      }
    });

    return {
      crops: cropObj,
      uriTemplate: story?.uriTemplate || "",
    };
  });
};

export const getVideoType = (
  videoUrl: string
): "youtube" | "vimeo" | "mp4" | "unknown" => {
  if (
    /^(https?:\/\/)?(www\.)?youtube\.com/.test(videoUrl) ||
    /^(https?:\/\/)?(www\.)?youtu\.be/.test(videoUrl)
  ) {
    return "youtube";
  } else if (
    /^(https?:\/\/)?(www\.)?vimeo\.com/.test(videoUrl) ||
    /^(https?:\/\/)?(www\.)?player\.vimeo\.com/.test(videoUrl)
  ) {
    return "vimeo";
  } else if (videoUrl?.endsWith(".mp4")) {
    return "mp4";
  } else {
    return "unknown";
  }
};

export interface IGetURLMainLogoRawData {
  viewtype: string;
  data: {
    uri: string;
  };
}
export const getURLMainLogo = (items: IGetURLMainLogoRawData[]) => {
  let URLMainLogo;
  (items || []).forEach((element: IGetURLMainLogoRawData) => {
    if (element.viewtype === "OsLogo") {
      URLMainLogo = element.data.uri;
      return;
    }
  });
  return URLMainLogo;
};

export const removeCMTextHyphen = (str: string) => {
  return str === "-" || str === "<div>-</div>" || str === "<div><p>-</p></div>" ? "" : str;
};
