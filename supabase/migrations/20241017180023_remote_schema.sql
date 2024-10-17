create table "public"."html_templates" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "organization_id" uuid not null,
    "html_code" text not null,
    "source_url" text not null,
    "created_at" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX html_templates_pkey ON public.html_templates USING btree (id);

alter table "public"."html_templates" add constraint "html_templates_pkey" PRIMARY KEY using index "html_templates_pkey";

alter table "public"."html_templates" add constraint "html_templates_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."html_templates" validate constraint "html_templates_organization_id_fkey";

alter table "public"."html_templates" add constraint "html_templates_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."html_templates" validate constraint "html_templates_user_id_fkey";

grant delete on table "public"."html_templates" to "anon";

grant insert on table "public"."html_templates" to "anon";

grant references on table "public"."html_templates" to "anon";

grant select on table "public"."html_templates" to "anon";

grant trigger on table "public"."html_templates" to "anon";

grant truncate on table "public"."html_templates" to "anon";

grant update on table "public"."html_templates" to "anon";

grant delete on table "public"."html_templates" to "authenticated";

grant insert on table "public"."html_templates" to "authenticated";

grant references on table "public"."html_templates" to "authenticated";

grant select on table "public"."html_templates" to "authenticated";

grant trigger on table "public"."html_templates" to "authenticated";

grant truncate on table "public"."html_templates" to "authenticated";

grant update on table "public"."html_templates" to "authenticated";

grant delete on table "public"."html_templates" to "service_role";

grant insert on table "public"."html_templates" to "service_role";

grant references on table "public"."html_templates" to "service_role";

grant select on table "public"."html_templates" to "service_role";

grant trigger on table "public"."html_templates" to "service_role";

grant truncate on table "public"."html_templates" to "service_role";

grant update on table "public"."html_templates" to "service_role";


