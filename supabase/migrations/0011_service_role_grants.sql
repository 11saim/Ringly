-- service_role bypasses RLS but still needs base table grants, same
-- as authenticated did in 0002. This project doesn't have Supabase's
-- automatic default grants (same reason 0002 was needed), so
-- service_role needs the same explicit treatment for server-side
-- code (the webhook, and any future admin-key operations) to work.

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

alter default privileges in schema public
  grant all on tables to service_role;
alter default privileges in schema public
  grant all on sequences to service_role;
alter default privileges in schema public
  grant execute on functions to service_role;