create table "public"."ad_creatives" (
    "id" bigint generated always as identity not null,
    "html_template_id" uuid not null,
    "platform" text not null,
    "ad_description" text not null,
    "ad_sub_heading" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."user_profiles" add column "credits" bigint default '2'::bigint;

CREATE UNIQUE INDEX ad_creatives_pkey ON public.ad_creatives USING btree (id);

alter table "public"."ad_creatives" add constraint "ad_creatives_pkey" PRIMARY KEY using index "ad_creatives_pkey";

alter table "public"."ad_creatives" add constraint "ad_creatives_html_template_id_fkey" FOREIGN KEY (html_template_id) REFERENCES html_templates(id) ON DELETE CASCADE not valid;

alter table "public"."ad_creatives" validate constraint "ad_creatives_html_template_id_fkey";

grant delete on table "public"."ad_creatives" to "anon";

grant insert on table "public"."ad_creatives" to "anon";

grant references on table "public"."ad_creatives" to "anon";

grant select on table "public"."ad_creatives" to "anon";

grant trigger on table "public"."ad_creatives" to "anon";

grant truncate on table "public"."ad_creatives" to "anon";

grant update on table "public"."ad_creatives" to "anon";

grant delete on table "public"."ad_creatives" to "authenticated";

grant insert on table "public"."ad_creatives" to "authenticated";

grant references on table "public"."ad_creatives" to "authenticated";

grant select on table "public"."ad_creatives" to "authenticated";

grant trigger on table "public"."ad_creatives" to "authenticated";

grant truncate on table "public"."ad_creatives" to "authenticated";

grant update on table "public"."ad_creatives" to "authenticated";

grant delete on table "public"."ad_creatives" to "service_role";

grant insert on table "public"."ad_creatives" to "service_role";

grant references on table "public"."ad_creatives" to "service_role";

grant select on table "public"."ad_creatives" to "service_role";

grant trigger on table "public"."ad_creatives" to "service_role";

grant truncate on table "public"."ad_creatives" to "service_role";

grant update on table "public"."ad_creatives" to "service_role";


