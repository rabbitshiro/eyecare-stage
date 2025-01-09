import { gql } from "@apollo/client";

const TeaserTitle1 = gql`
  fragment TeaserTitle1 on CMTeaserImpl {
    id
    type
    name
    title
    teaserTitle
    teaserText
    pictures {
      id
      name
      title
      data {
        uri
        contentType
      }
    }
    teaserTargets {
      callToActionText
      callToActionEnabled
      target {
        id
        name
        type
        title
        segment
        navigationPath {
          name
          segment
        }
        ...TeaserLevel2
      }
    }
  }
`;

const TeaserLevel2 = gql`
  fragment TeaserLevel2 on CMTeaserImpl {
    id
    type
    name
    title
    teaserTitle
    teaserText
    pictures {
      id
      name
      title
      data {
        uri
        contentType
      }
    }
    teaserTargets {
      callToActionText
      callToActionEnabled
      target {
        id
        name
        type
        title
      }
    }
  }
`;

export const FILEDOWNLOAD = gql`
  fragment FileDownload on CMDownload {
    type
    filename
    title
    teaserText
    detailText
    id
    data {
      contentType
      uri
      size
    }
    validFrom
  }
`;

const IMAGE = gql`
  fragment image on CMImageMap {
    teaserTitle
    teaserText
    teaserTargets {
      target {
        id
        name
      }
    }
    pictures {
      ...Picture
    }
  }
`;

const TAG = gql`
  fragment Tag on CMTaxonomyImpl {
    id
    name
    externalReference
    value
    parent {
      id
      name
      value
    }
  }
`;

export const HTML = gql`
  fragment html on CMHTMLImpl {
    teaserTitle
    teaserText
    detailTextAsTree
    detailTextReferencedContent {
      name
    }
    localizedVariants {
      name
    }
    htmlTitle
    html
  }
`;

export const PICTURE = gql`
  fragment Picture on CMPictureImpl {
    id
    title
    type
    viewtype
    uriTemplate
    detailText
    crops {
      aspectRatio {
        height
        width
      }
      name
      sizes {
        height
        width
      }
      minWidth
    }
    data {
      uri
      size
      contentType
    }
    subjectTaxonomy {
      ...Tag
    }
  }
`;

export const PLACEHOLDER = gql`
  fragment Placeholder on CMPlaceholderImpl {
    segment
    viewtype
    name
    languageId
    type
    title
    detailTextAsTree
    settings(paths: ["Topics", "List", "consent"])
    pictures {
      ...Picture
    }
  }
`;

export const PERSON = gql`
  fragment CMPerson on CMPerson {
    eMail
    detailTextAsTree
    jobTitle
    languageId
  }
`;

export const ARTICLE = gql`
  fragment Article on CMArticleImpl {
    teaserTitle
    title
    detailText
    teaserText
    extDisplayedDate
    validTo
    teaserTargets {
      callToActionText
    }
    settings(paths: ["bgcolor"]),
    pictures {
      ...Picture
    }
    videos {
      data {
        uri
      }
      dataUrl
    }
    subjectTaxonomy {
      ...Tag
    }
    related {
      id
      name
      type
      viewtype
      ...FileDownload
      ...TeaserTitle1
      teaserTargets {
        target {
          ... on CMExternalLink {
            url
          }
        }
        callToActionText
        callToActionHash
      }
    }
  }
`;

export const PAGEMIN = gql`
  fragment Pagemin on CMChannelImpl {
    id
    title
    name
    type
    segment
    teaserTitle
    navigationPath {
      segment
    }
  }
`;

export const EXTLINK = gql`
  fragment ExtLink on CMExternalLinkImpl {
    id
    name
    type
    url
    teaserTitle
    teaserText
    pictures {
      ...Picture
    }
  }
`;

const LXTEASER = gql`
  fragment LXTeaser on LXTeaserImpl {
    type
    teaserPreTitle
    teaserTitle
    teaserTitle1
    teaserTitle2
    teaserTitle3
    teaserTitle4
    teaserLabelText
    teaserLabelStyle
    teaserLabelPosition
    teaserLabelVisible
    teaserText
    teaserText1
    teaserText2
    teaserIcon
    keywords
    teaserBackground
    settings(
      paths: [
        "RegionSelectionBox"
        "PreferredLanguageBox"
        "fieldValidation"
        "EmailValidation"
        "submit"
      ]
    )
    teaserLXCallToActionSettings {
      style
      callToActionText
      target {
        id
        segment
        navigationPath {
          id
          segment
        }
      }
    }
    video {
      data {
        uri
      }
      dataUrl
    }
    teaserOverlayVideo {
      id
      name
      data {
        uri
      }
      related {
        id
        name
        title
        video {
          creationDate
          dataUrl
          data {
            uri
          }
        }
      }
    }
    pictures {
      ...Picture
    }
    teaserBackgroundImage {
      id
      data {
        uri
      }
    }
    teaserLogoImage {
      id
      data {
        uri
      }
    }
    teaserLogoTechnicalImage {
      id
      data {
        uri
      }
    }
    teaserTargets {
      target {
        id
        title
        viewtype
        ...ExtLink
        ...Article
        ...Pagemin
        ...Placeholder
      }
      callToActionText
      callToActionHash
      callToActionEnabled
    }
    teaserOverlay1Settings
    subjectTaxonomy {
      ...Tag
    }
  }
`;

export const TEASER = gql`
  fragment Teaser on CMTeaserImpl {
    id
    type
    name
    title
    teaserTitle
    teaserText
    viewtype
    settings(paths: ["dataDesc"])
    subjectTaxonomy {
      ...Tag
    }
    pictures {
      ...Picture
      detailText
      teaserText
      viewtype
    }
    video {
      teaserTitle
      teaserText
      data {
        uri
      }
      dataUrl
    }
    videos {
      teaserTitle
      teaserText
      data {
        uri
      }
      dataUrl
      related {
        videos {
          title
          data {
            uri
          }
          dataUrl
        }
      }
    }
    teaserOverlaySettings {
      enabled
      style
    }
    teaserTargets {
      callToActionEnabled
      callToActionText
      callToActionHash
      target {
        id
        name
        type
        title
        navigationPath {
          name
          segment
        }
        ...LXTeaser
        ...Pagemin
        ...ExtLink
        ...FileDownload
      }
    }
  }
`;

export const INNERCOLLECTIONLVL4 = gql`
  fragment innerCollectionLevel4 on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    items {
      ...Teaser
      ...LXTeaser
      ...Pagemin
      ...ExtLink
    }
  }
`;

export const INNERCOLLECTIONLVL3 = gql`
  fragment innerCollectionLevel3 on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    items {
      ...Teaser
      ...LXTeaser
      ...Pagemin
      ...ExtLink
      ...innerCollectionLevel4
    }
  }
`;

export const INNERCOLLECTIONLVL2 = gql`
  fragment innerCollectionLevel2 on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    items {
      ...Teaser
      ...LXTeaser
      ...Pagemin
      ...ExtLink
      ...innerCollectionLevel3
    }
  }
`;

export const INNERCOLLECTION = gql`
  fragment innerCollection on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    picture {
      data {
        uri
      }
    }
    videos {
      data {
        uri
      }
      dataUrl
    }
    items {
      ...Teaser
      ...LXTeaser
      ...Pagemin
      ...ExtLink
      ...innerCollectionLevel2
      ...FileDownload
    }
  }
`;

export const COLLECTION = gql`
  fragment Collection on CMCollectionImpl {
    id
    name
    title
    viewtype
    collectionTitle
    collectionSubTitle
    pictures {
      data {
        uri
      }
    }
    videos {
      data {
        uri
      }
      dataUrl
    }
    subjectTaxonomy {
      ...Tag
    }
    teaserTargets {
      callToActionEnabled
      callToActionText
      callToActionHash
      target {
        id
        name
        type
        title
        navigationPath {
          name
          segment
        }
      }
    }
    items {
      ...LXTeaser
      ...Teaser
      ...Pagemin
      ...ExtLink
      ...innerCollection
      ...Placeholder
      ...CMPerson
      ...Article
      ...FileDownload
      ...Tag
      ...Picture
    }
  }
`;

const DYNAMIC_CONTENT = gql`
  fragment DynamicContent on LXDynamicContent {
    dynamicRules {
      target {
        teaserText
        navigationPath {
          name
          segment
        }
      }
    }
  }
`;

export const PAGE = gql`
  fragment PAGE on CMChannelImpl {
    id
    title
    htmlDescription
    segment
    navigationPath {
      segment
    }
    subjectTaxonomy {
      ...Tag
    }
    name
    htmlTitle
    grid {
      rows {
        placements {
          name
          viewtype
          placementAnimation
          backgroundColor
          marginVertical
          items {
            id
            name
            type
            title
            viewtype
            ...Picture
            ...Collection
            ...LXTeaser
            ...Tag
            ...Placeholder
            ...Teaser
            ...Pagemin
            ...Article
            ...html
            ...image
            ...FileDownload
            ...ExtLink
            ...DynamicContent
          }
        }
      }
    }
  }
  ${TeaserTitle1}
  ${TeaserLevel2}
  ${FILEDOWNLOAD}
  ${PICTURE}
  ${COLLECTION}
  ${LXTEASER}
  ${TAG}
  ${PLACEHOLDER}
  ${TEASER}
  ${PAGEMIN}
  ${ARTICLE}
  ${HTML}
  ${EXTLINK}
  ${INNERCOLLECTION}
  ${INNERCOLLECTIONLVL2}
  ${INNERCOLLECTIONLVL3}
  ${INNERCOLLECTIONLVL4}
  ${PERSON}
  ${IMAGE}
  ${DYNAMIC_CONTENT}
`;
