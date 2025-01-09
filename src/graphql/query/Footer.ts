import { gql } from "@apollo/client";

export const FooterQuery = (variables: any) => {
  return {
    query: gql`
      query PageQuery($path: String!) {
        content {
          pageByPath(path: $path) {
            ...FooterPlacement
          }
        }
      }

      fragment FooterPlacement on CMChannelImpl {
        grid {
          rows {
            placements {
              viewtype
              items {
                type
                ... on CMExternalLinkImpl {
                  url
                  pictures {
                    ... on CMPicture {
                      data {
                        uri
                      }
                    }
                  }
                }
                ... on CMChannelImpl {
                  teaserTargets {
                    target {
                      title
                      navigationPath {
                        segment
                      }
                    }
                  }
                }
                ... on CMTeaserImpl {
                  teaserTitle
                  teaserTargets {
                    target {
                      title
                      navigationPath {
                        segment
                      }
                    }
                  }
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
