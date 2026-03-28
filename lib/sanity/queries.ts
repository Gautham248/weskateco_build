export const getBlogPostsQuery = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title_en,
    title_hi,
    slug,
    author,
    publishedAt,
    seoTitle,
    seoDescription,
    "category": category->{ name_en, name_hi, slug },
    tags,
    "mainImageUrl": mainImage.asset->url
  }
`;

export const getBlogPostBySlugQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title_en,
    title_hi,
    slug,
    author,
    publishedAt,
    body_en,
    body_hi,
    seoTitle,
    seoDescription,
    "category": category->{ name_en, name_hi, slug },
    tags,
    "mainImageUrl": mainImage.asset->url
  }
`;

export const getBlogCategoriesQuery = `
  *[_type == "blogCategory"] | order(name_en asc) {
    _id,
    name_en,
    name_hi,
    slug,
    description_en,
    description_hi
  }
`;

export const getAcademyProgrammesQuery = `
  *[_type == "academyProgramme"] | order(city asc) {
    _id,
    title_en,
    title_hi,
    slug,
    description_en,
    description_hi,
    skillLevels,
    ageGroups,
    sessionFormat,
    city,
    bookingEnabled,
    "instructor": instructor->{ name, bio_en, bio_hi, "photoUrl": photo.asset->url },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

export const getSkateparksQuery = `
  *[_type == "skatepark"] | order(name asc) {
    _id,
    name,
    slug,
    location,
    status,
    completionPercentage,
    description_en,
    description_hi,
    scope_en,
    scope_hi,
    communityImpact_en,
    communityImpact_hi,
    "featuredImageUrl": featuredImage.asset->url,
    photos[] {
      caption,
      stage,
      "imageUrl": image.asset->url
    }
  }
`;

export const getArtistCollabsQuery = `
  *[_type == "artistCollab"] | order(_createdAt desc) {
    _id,
    artistName,
    slug,
    bio_en,
    bio_hi,
    "artistPhotoUrl": artistPhoto.asset->url,
    artworkImages[] { "url": asset->url },
    shopifyProductHandles,
    countdownDate,
    isLive
  }
`;

export const getArtistCollabBySlugQuery = `
  *[_type == "artistCollab" && slug.current == $slug][0] {
    _id,
    artistName,
    slug,
    bio_en,
    bio_hi,
    "artistPhotoUrl": artistPhoto.asset->url,
    creativeProcess_en,
    creativeProcess_hi,
    artworkImages[] { "url": asset->url },
    shopifyProductHandles,
    countdownDate,
    isLive
  }
`;

export const getAuthorisedBrandsQuery = `
  *[_type == "authorisedBrand"] | order(sortOrder asc) {
    _id,
    name,
    slug,
    "logoUrl": logo.asset->url,
    description_en,
    description_hi,
    shopifyCollectionHandle,
    websiteUrl
  }
`;

export const getAmbassadorsQuery = `
  *[_type == "ambassador"] | order(tier desc, name asc) {
    _id,
    name,
    slug,
    location,
    ridingStyle,
    tier,
    "photoUrl": photo.asset->url,
    bio_en,
    bio_hi,
    socialHandle,
    featuredContent
  }
`;

export const getApprovedUgcQuery = `
  *[_type == "ugcSubmission" && status in ["approved", "featured"]] | order(featuredDate desc, _createdAt desc) {
    _id,
    customerName,
    instagramHandle,
    imageUrl,
    "uploadedImageUrl": image.asset->url,
    productReferences,
    status,
    featuredDate
  }
`;

export const getCommunityStoriesQuery = `
  *[_type == "communityStory"] | order(publishedAt desc) {
    _id,
    riderName,
    slug,
    "portraitUrl": portrait.asset->url,
    background_en,
    background_hi,
    relatedProductHandles,
    publishedAt
  }
`;

export const getCommunityStoryBySlugQuery = `
  *[_type == "communityStory" && slug.current == $slug][0] {
    _id,
    riderName,
    slug,
    "portraitUrl": portrait.asset->url,
    background_en,
    background_hi,
    story_en,
    story_hi,
    relatedProductHandles,
    "relatedAcademy": relatedAcademy->{ title_en, title_hi, slug, city },
    publishedAt
  }
`;

export const getSiteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    announcementBar_en,
    announcementBar_hi,
    announcementBarEnabled,
    contactEmail,
    contactPhone,
    socialLinks,
    footerText_en,
    footerText_hi
  }
`;

export const getNavigationQuery = `
  *[_type == "navigation" && identifier == $identifier][0] {
    identifier,
    items[] {
      label_en,
      label_hi,
      href,
      children[] {
        label_en,
        label_hi,
        href
      }
    }
  }
`;
