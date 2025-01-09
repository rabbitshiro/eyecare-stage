import { gql } from "@apollo/client";

export const NavigationQuery = (variables: any) => {
  return {
    query: gql`
      query PageQuery($path: String!) {
        content {
          pageByPath(path: $path) {
            ...NavigationPlacement
          }
        }
      }

      fragment NavigationPlacement on CMChannelImpl {
        grid {
          rows {
            placements {
              viewtype
              items {
                type
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
