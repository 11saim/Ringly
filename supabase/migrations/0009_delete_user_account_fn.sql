-- SECURITY DEFINER function to delete a user and cascade their tenant.
-- Runs as the function owner (postgres) so it bypasses RLS and
-- any grant restrictions on service_role.

create or replace function public.delete_user_account(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. Delete the tenant row (cascades to all child tables via FK).
  delete from public.tenants where id = target_user_id;

  -- 2. Delete the auth user via the auth schema.
  delete from auth.users where id = target_user_id;
end;
$$;

-- Allow authenticated (and service_role) to execute it.
grant execute on function public.delete_user_account(uuid) to authenticated;
grant execute on function public.delete_user_account(uuid) to service_role;
