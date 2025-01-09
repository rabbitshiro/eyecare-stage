import { gql } from "@apollo/client";

export const RelatedPaths = (variables: any) => {
  return {
    query: gql`
      query LocalizedVariants($path: String!) {
        content {
          pageByPath(path: $path) {
            title
            type
            localizedVariants {
              ... on CMChannel {
                repositoryPath
                navigationPath {
                  id
                  segment
                }
              }
            }
          }
        }
      }
    `,
    variables,
  };
};
