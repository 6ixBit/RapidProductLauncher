import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';

export async function saveProductTemplateToDB(
  html: string,
  productInfo: any,
  language: string,
  source_url: string,
  user_id: string,
  organization_id: string,
  target_audience: string,
  variants: string[],
  image_variants: any[],
): Promise<string | null> {
  const supabase = createSupabaseUserServerActionClient();

  const { data, error } = await supabase
    .from('html_templates')
    .insert([
      {
        user_id: user_id,
        organization_id: organization_id,
        html_code: html,
        language: language,
        source_url: source_url,
        product_title: productInfo.title,
        product_price: productInfo.price,
        product_description: productInfo.description,
        product_sub_heading: productInfo.subHeading,
        product_key_points: productInfo.keyPoints,
        product_reviews: productInfo.reviews,
        target_audience: target_audience,
        variants: variants,
        image_variants: image_variants,
      },
    ])
    .select('id');

  if (error) {
    console.error('Error saving HTML to database:', error);
    return null;
  } else {
    console.log('HTML saved to database successfully.');
    return data[0]?.id || null; // Return the ID of the inserted row
  }
}

export function cleanHTML(html: string): string {
  return html.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
}

export async function saveAdCreativesToDB(
  htmlTemplateId: string,
  adCopy: {
    facebook: Array<{ description: string; subHeading: string }>;
    instagram: Array<{ caption: string }>;
  },
) {
  const supabase = createSupabaseUserServerActionClient();
  const facebookPromises = adCopy.facebook.map((ad) =>
    supabase.from('ad_creatives').insert({
      html_template_id: htmlTemplateId,
      platform: 'facebook',
      ad_description: ad.description,
      ad_sub_heading: ad.subHeading,
    }),
  );

  const instagramPromises = adCopy.instagram.map((ad) =>
    supabase.from('ad_creatives').insert({
      html_template_id: htmlTemplateId,
      platform: 'instagram',
      ad_description: ad.caption,
      ad_sub_heading: null, // Instagram doesn't use sub-headings
    }),
  );

  // Execute all insertions in parallel
  await Promise.all([...facebookPromises, ...instagramPromises]);
}

export async function saveImagesToDb(productId: string, imageUrls: string[]) {
  try {
    if (!imageUrls.length) {
      console.warn('No images to save for product:', productId);
      return;
    }

    const supabase = createSupabaseUserServerActionClient();
    const { error } = await supabase
      .from('html_templates')
      .update({
        image_urls: imageUrls,
        thumbnail_url: imageUrls[0],
      })
      .eq('id', productId);

    if (error) {
      console.error('Error saving images to DB:', error);
      throw error;
    }

    console.log(`✅ Saved ${imageUrls.length} images for product ${productId}`);
  } catch (error) {
    console.error('Failed to save images:', error);
    throw error;
  }
}
