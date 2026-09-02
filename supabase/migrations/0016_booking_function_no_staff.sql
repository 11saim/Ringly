-- Replaces create_booking and agent_create_booking now that staff_id
-- no longer exists. Conflict check now looks for overlapping bookings
-- on the SAME SERVICE for this tenant (assuming the business handles
-- one booking per service at a time — the natural default without
-- staff-level scheduling).

-- Drop the old signatures first — changing the parameter list means
-- `create or replace` would otherwise create a second overloaded
-- version instead of truly replacing the old one.
drop function if exists create_booking(uuid, uuid, uuid, timestamptz, int);
drop function if exists agent_create_booking(uuid, uuid, uuid, uuid, timestamptz, int);

create or replace function create_booking(
  p_contact_id uuid,
  p_service_id uuid,
  p_scheduled_at timestamptz,
  p_duration_minutes int
)
returns bookings
language plpgsql
security definer
as $$
declare
  v_tenant_id uuid := auth_tenant_id();
  v_conflict_count int;
  v_booking bookings;
begin
  perform 1
  from bookings
  where service_id = p_service_id
    and status = 'upcoming'
    and scheduled_at < (p_scheduled_at + (p_duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_scheduled_at
  for update;

  get diagnostics v_conflict_count = row_count;

  if v_conflict_count > 0 then
    raise exception 'This time slot is already booked';
  end if;

  insert into bookings (tenant_id, contact_id, service_id, scheduled_at, duration_minutes, status, created_via)
  values (v_tenant_id, p_contact_id, p_service_id, p_scheduled_at, p_duration_minutes, 'upcoming', 'agent')
  returning * into v_booking;

  return v_booking;
end;
$$;

create or replace function agent_create_booking(
  p_tenant_id uuid,
  p_contact_id uuid,
  p_service_id uuid,
  p_scheduled_at timestamptz,
  p_duration_minutes int
)
returns bookings
language plpgsql
security definer
as $$
declare
  v_conflict_count int;
  v_booking bookings;
begin
  perform 1
  from bookings
  where service_id = p_service_id
    and status = 'upcoming'
    and scheduled_at < (p_scheduled_at + (p_duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_scheduled_at
  for update;

  get diagnostics v_conflict_count = row_count;

  if v_conflict_count > 0 then
    raise exception 'This time slot is already booked';
  end if;

  insert into bookings (tenant_id, contact_id, service_id, scheduled_at, duration_minutes, status, created_via)
  values (p_tenant_id, p_contact_id, p_service_id, p_scheduled_at, p_duration_minutes, 'upcoming', 'agent')
  returning * into v_booking;

  return v_booking;
end;
$$;