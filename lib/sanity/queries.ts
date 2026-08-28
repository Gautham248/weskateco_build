import { sanityClient } from "./client";

export interface HeroSettingsData {
  mediaUrl?: string;
  mediaType?: "image" | "video" | "gif";
  overlayEnabled?: boolean;
  ctaButtons?: Array<{
    label_en?: string;
    label_hi?: string;
    href?: string;
  }>;
}

export interface SiteSettingsData {
  companyName?: string;
  siteName?: string;
  announcementBar?: {
    enabled: boolean;
    text_en: string;
    text_hi: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
  footerText_en?: string;
  footerText_hi?: string;
  heroSettings?: HeroSettingsData;
  categoryGrid?: Array<{
    title_en: string;
    title_hi: string;
    href: string;
    imageUrl?: string;
  }>;
}

export interface NewlyReleasedSlideData {
  title?: string;
  subtitle?: string;
  shopifyProductHandle?: string;
  fullImageUrl?: string;
  wheelsImageUrl?: string;
  price?: string;
  oldPrice?: string;
}

export interface ShopNowProductData {
  shopifyProductHandle?: string;
  discountBadge?: string;
  emiBadge?: string;
  imageUrls?: string[];
}

export interface AuthorisedBrandData {
  _id: string;
  name: string;
  handle: string;
  logoUrl?: string;
  description_en?: string;
  description_hi?: string;
  shopifyCollectionHandle?: string;
  sortOrder?: number;
}

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

export const getHomeNewlyReleasedQuery = `
  *[_type == "homeNewlyReleased"][0] {
    slides[] {
      title,
      subtitle,
      shopifyProductHandle,
      fullImageUrl,
      wheelsImageUrl,
      price,
      oldPrice
    }
  }
`;

export const getHomeShopNowQuery = `
  *[_type == "homeShopNow"][0] {
    products[] {
      shopifyProductHandle,
      discountBadge,
      emiBadge,
      imageUrls
    }
  }
`;

export const getHeroSettingsQuery = `
  *[_type == "siteSettings"][0].heroSettings {
    mediaUrl,
    mediaType,
    overlayEnabled,
    ctaButtons[] {
      label_en,
      label_hi,
      href
    }
  }
`;

export const getCategoryGridQuery = `
  *[_type == "siteSettings"][0].categoryGrid[] {
    title_en,
    title_hi,
    href,
    imageUrl
  }
`;

export async function getSiteSettings() {
  try {
    return await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
  } catch {
    return null;
  }
}

export async function getAuthorisedBrands() {
  try {
    return await sanityClient.fetch(
      `*[_type == "authorisedBrand"] | order(sortOrder asc) {
        _id, name, handle, logoUrl, description_en, description_hi, shopifyCollectionHandle, sortOrder
      }`
    );
  } catch {
    return [];
  }
}

export async function getHomeNewlyReleased() {
  try {
    const res = await sanityClient.fetch(`*[_type == "homeNewlyReleased"][0].slides`);
    return res ?? [];
  } catch {
    return [];
  }
}

export async function getHomeShopNow() {
  try {
    const res = await sanityClient.fetch(`*[_type == "homeShopNow"][0].products`);
    return res ?? [];
  } catch {
    return [];
  }
}

export async function getNavigation() {
  try {
    return await sanityClient.fetch(`*[_type == "navigation" && identifier == "header"][0]`);
  } catch {
    return null;
  }
}

export interface AcademyProgrammeData {
  _id: string;
  title_en?: string;
  title_hi?: string;
  city?: string;
  bookingEnabled?: boolean;
  skillLevels?: string[];
  description_en?: string;
  description_hi?: string;
}

export interface SkateparkData {
  _id: string;
  name?: string;
  city?: string;
  constructionStatus?: string;
  completionPercentage?: number;
  description_en?: string;
  description_hi?: string;
}

export async function getAcademyProgrammes(): Promise<AcademyProgrammeData[]> {
  try {
    const res = await sanityClient.fetch(`*[_type == "academyProgramme"] | order(_createdAt desc)`);
    return res ?? [];
  } catch {
    return [];
  }
}

export async function getSkateparks(): Promise<SkateparkData[]> {
  try {
    const res = await sanityClient.fetch(`*[_type == "skatepark"] | order(_createdAt desc)`);
    return res ?? [];
  } catch {
    return [];
  }
}



