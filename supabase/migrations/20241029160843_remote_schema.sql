alter table "public"."html_templates" add column "image_urls" text[];

alter table "public"."html_templates" add column "is_imported_to_shopify" boolean default false;

alter table "public"."html_templates" add column "shopify_store_id" bigint;

alter table "public"."shopify_integrations" add column "myshopify_domain" text;

alter table "public"."html_templates" add constraint "html_templates_shopify_store_id_fkey" FOREIGN KEY (shopify_store_id) REFERENCES shopify_integrations(id) ON DELETE SET NULL not valid;

alter table "public"."html_templates" validate constraint "html_templates_shopify_store_id_fkey";


