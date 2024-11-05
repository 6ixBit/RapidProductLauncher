alter table "public"."html_templates" drop constraint "html_templates_shopify_store_id_fkey";

create table "public"."product_shopify_integrations" (
    "id" bigint generated always as identity not null,
    "product_id" uuid not null,
    "shopify_integration_id" bigint not null
);


alter table "public"."html_templates" drop column "shopify_store_id";

alter table "public"."html_templates" add column "image_variants" text[];

alter table "public"."html_templates" add column "shopify_product_id" text;

alter table "public"."html_templates" add column "shopify_product_url" text;

alter table "public"."html_templates" add column "target_audience" text;

alter table "public"."html_templates" add column "variants" text[];

CREATE UNIQUE INDEX product_shopify_integrations_pkey ON public.product_shopify_integrations USING btree (id);

alter table "public"."product_shopify_integrations" add constraint "product_shopify_integrations_pkey" PRIMARY KEY using index "product_shopify_integrations_pkey";

alter table "public"."product_shopify_integrations" add constraint "product_shopify_integrations_product_id_fkey" FOREIGN KEY (product_id) REFERENCES html_templates(id) ON DELETE CASCADE not valid;

alter table "public"."product_shopify_integrations" validate constraint "product_shopify_integrations_product_id_fkey";

alter table "public"."product_shopify_integrations" add constraint "product_shopify_integrations_shopify_integration_id_fkey" FOREIGN KEY (shopify_integration_id) REFERENCES shopify_integrations(id) ON DELETE CASCADE not valid;

alter table "public"."product_shopify_integrations" validate constraint "product_shopify_integrations_shopify_integration_id_fkey";

grant delete on table "public"."product_shopify_integrations" to "anon";

grant insert on table "public"."product_shopify_integrations" to "anon";

grant references on table "public"."product_shopify_integrations" to "anon";

grant select on table "public"."product_shopify_integrations" to "anon";

grant trigger on table "public"."product_shopify_integrations" to "anon";

grant truncate on table "public"."product_shopify_integrations" to "anon";

grant update on table "public"."product_shopify_integrations" to "anon";

grant delete on table "public"."product_shopify_integrations" to "authenticated";

grant insert on table "public"."product_shopify_integrations" to "authenticated";

grant references on table "public"."product_shopify_integrations" to "authenticated";

grant select on table "public"."product_shopify_integrations" to "authenticated";

grant trigger on table "public"."product_shopify_integrations" to "authenticated";

grant truncate on table "public"."product_shopify_integrations" to "authenticated";

grant update on table "public"."product_shopify_integrations" to "authenticated";

grant delete on table "public"."product_shopify_integrations" to "service_role";

grant insert on table "public"."product_shopify_integrations" to "service_role";

grant references on table "public"."product_shopify_integrations" to "service_role";

grant select on table "public"."product_shopify_integrations" to "service_role";

grant trigger on table "public"."product_shopify_integrations" to "service_role";

grant truncate on table "public"."product_shopify_integrations" to "service_role";

grant update on table "public"."product_shopify_integrations" to "service_role";


