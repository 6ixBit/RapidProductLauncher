create table "public"."shopify_integrations" (
    "id" bigint generated always as identity not null,
    "user_id" uuid not null,
    "organization_id" uuid not null,
    "shopify_store_url" text not null,
    "is_connected" boolean not null default true,
    "connected_at" timestamp with time zone not null default now(),
    "disconnected_at" timestamp with time zone,
    "admin_api_key" text
);


alter table "public"."html_templates" alter column "thumbnail_url" set default 'https://rapid-product-launcher.ai.s3.us-east-2.amazonaws.com/product_placeholder_image.png'::text;

CREATE UNIQUE INDEX shopify_integrations_pkey ON public.shopify_integrations USING btree (id);

alter table "public"."shopify_integrations" add constraint "shopify_integrations_pkey" PRIMARY KEY using index "shopify_integrations_pkey";

alter table "public"."shopify_integrations" add constraint "shopify_integrations_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."shopify_integrations" validate constraint "shopify_integrations_organization_id_fkey";

alter table "public"."shopify_integrations" add constraint "shopify_integrations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."shopify_integrations" validate constraint "shopify_integrations_user_id_fkey";

grant delete on table "public"."shopify_integrations" to "anon";

grant insert on table "public"."shopify_integrations" to "anon";

grant references on table "public"."shopify_integrations" to "anon";

grant select on table "public"."shopify_integrations" to "anon";

grant trigger on table "public"."shopify_integrations" to "anon";

grant truncate on table "public"."shopify_integrations" to "anon";

grant update on table "public"."shopify_integrations" to "anon";

grant delete on table "public"."shopify_integrations" to "authenticated";

grant insert on table "public"."shopify_integrations" to "authenticated";

grant references on table "public"."shopify_integrations" to "authenticated";

grant select on table "public"."shopify_integrations" to "authenticated";

grant trigger on table "public"."shopify_integrations" to "authenticated";

grant truncate on table "public"."shopify_integrations" to "authenticated";

grant update on table "public"."shopify_integrations" to "authenticated";

grant delete on table "public"."shopify_integrations" to "service_role";

grant insert on table "public"."shopify_integrations" to "service_role";

grant references on table "public"."shopify_integrations" to "service_role";

grant select on table "public"."shopify_integrations" to "service_role";

grant trigger on table "public"."shopify_integrations" to "service_role";

grant truncate on table "public"."shopify_integrations" to "service_role";

grant update on table "public"."shopify_integrations" to "service_role";


