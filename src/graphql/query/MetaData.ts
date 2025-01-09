import { gql } from "@apollo/client";

export const MetaDataQuery = (variables: any) => {
  return {
    query: gql`
      query PageQuery($path: String!) {
        content {
          pageByPath(path: $path) {
            title
            htmlDescription
            settings(
              paths: "MetaImg"
            )
          }
        }
      }
    `,
    variables,
  };
};
