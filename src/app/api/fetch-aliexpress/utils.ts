import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';

export async function saveProductTemplateToDB(
  html: string,
  productInfo: any,
  language: string,
  source_url: string,
  user_id: string,
  organization_id: string,
) {
  const supabase = createSupabaseUserServerActionClient();

  const { error } = await supabase.from('html_templates').insert([
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
    },
  ]);

  if (error) {
    console.error('Error saving HTML to database:', error);
  } else {
    console.log('HTML saved to database successfully.');
  }
}

export function cleanHTML(html: string): string {
  return html.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
}
