-- delete teams
-- Migration script to drop team_members and teams tables
BEGIN;



-- Drop policies related to 'teams'
DROP POLICY IF EXISTS "Enable insert for org admins only" ON "public"."teams";
DROP POLICY IF EXISTS "Enable read access for org admins or team members" ON "public"."teams";
DROP POLICY IF EXISTS "Enable update for org admins" ON "public"."teams";
DROP POLICY IF EXISTS "Enable delete for org admins only" ON "public"."teams";

-- Since policies related to 'team_members' are indirectly through functions, ensure to review and adjust or drop functions and related policies accordingly.
-- Drop functions related to 'teams' and 'team_members' tables
DROP FUNCTION IF EXISTS public.get_team_admins_by_team_id(bigint);
DROP FUNCTION IF EXISTS public.get_team_members_team_id(bigint);
DROP FUNCTION IF EXISTS public.get_organization_id_by_team_id(bigint);

-- Assuming no foreign key constraints are depending on these tables. If there are, they need to be dropped first.
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;

COMMIT;

