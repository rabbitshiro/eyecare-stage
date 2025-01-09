import { stripIgnoredCharacters } from "graphql";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { IRepo } from "@/models/IRepo.interface";
import { PageQuery } from "./query/Page";
import { PathsQuery } from "./query/Paths";
import { PathsIdQuery } from "./query/PathsID";
import { RelatedPaths } from "./query/RelatedPaths";
import { ContentByIdQuery } from "./query/ContentID";
import { FileLinkQuery } from "./query/Filelink";
import { ArticleQuery } from "./query/Article";
import { SettingsQuery } from "./query/Settings";
import { MetaDataQuery } from "./query/MetaData";
import { NavigationQuery } from "./query/Navigation";
import { FooterQuery } from "./query/Footer";

export class GraphQLRepo implements IRepo {
  currentPage = "";

  currentContext(params?: string) {
    return new ApolloClient({
      ssrMode: false,
      link: new HttpLink({
        uri: process.env.GRAPHQL_URL + (params || ""),
        credentials: "same-origin",
        useGETForQueries: true,
        print: (ast, originalPrint) =>
          stripIgnoredCharacters(originalPrint(ast)),
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      },
    });
  }

  getLayoutData(language: string, path: string): Promise<any> {
    return this.currentContext("?area=" + language).query(
      PageQuery({ path: [language, path].join("/") })
    );
  }

  getPathsData(id: string): Promise<any> {
    return this.currentContext().query(PathsQuery({ id: id }));
  }

  getRelatedPaths(path: string): Promise<any> {
    return this.currentContext().query(RelatedPaths({ path: path }));
  }

  getPathsId(): Promise<any> {
    return this.currentContext().query(PathsIdQuery());
  }

  getContentById(id: string) {
    return this.currentContext().query(ContentByIdQuery({ id: id }));
  }

  getFileLink(id: string) {
    return this.currentContext().query(FileLinkQuery({ id: id }));
  }

  getArticleId(
    sortFields:
      | "EXTERNALLY_DISPLAYED_DATE_DESC"
      | "EXTERNALLY_DISPLAYED_DATE_ASC"
      | "TITLE_ASC"
      | "TITLE_DESC"
      | "TEASER_TITLE_ASC"
      | "TEASER_TITLE_DESC",
    tags: string,
    offset: number,
    limit: number
  ) {
    return this.currentContext().query(
      ArticleQuery({
        siteId: "", // Add master site id
        sortFields,
        tags,
        offset,
        limit,
      })
    );
  }

  getSettings(path: string, names: string[]) {
    return this.currentContext().query(SettingsQuery({ path, names }));
  }

  getMetaData(language: string, path: string) {
    return this.currentContext().query(
      MetaDataQuery({ path: language + "/" + path })
    );
  }

  getNavigation(lang: string) {
    return this.currentContext().query(
      NavigationQuery({ path: `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}/navigation` })
    );
  }

  getFooter(lang: string) {
    return this.currentContext().query(
      FooterQuery({ path: `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}/footer` })
    );
  }
}
