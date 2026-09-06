-- Replaces create_booking and agent_create_booking to check capacity
-- instead of assuming every service can only handle one booking at a
-- time. Uses the same PERFORM + GET DIAGNOSTICS pattern as before
-- (FOR UPDATE can't combine with an aggregate like COUNT), just
-- compares the locked-row count against the service's capacity
-- instead of checking for any overlap at all.

drop function if exists create_booking(uuid, uuid, timestamptz, int);
drop function if exists agent_create_booking(uuid, uuid, uuid, timestamptz, int);

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
  v_overlap_count int;
  v_capacity int;
  v_booking bookings;
begin
  select capacity into v_capacity from services where id = p_service_id;
  if v_capacity is null then
    raise exception 'Service not found';
  end if;

  perform 1
  from bookings
  where service_id = p_service_id
    and status = 'upcoming'
    and scheduled_at < (p_scheduled_at + (p_duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_scheduled_at
  for update;

  get diagnostics v_overlap_count = row_count;

  if v_overlap_count >= v_capacity then
    raise exception 'This time slot is fully booked';
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
  v_overlap_count int;
  v_capacity int;
  v_booking bookings;
begin
  select capacity into v_capacity from services where id = p_service_id;
  if v_capacity is null then
    raise exception 'Service not found';
  end if;

  perform 1
  from bookings
  where service_id = p_service_id
    and status = 'upcoming'
    and scheduled_at < (p_scheduled_at + (p_duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_scheduled_at
  for update;

  get diagnostics v_overlap_count = row_count;

  if v_overlap_count >= v_capacity then
    raise exception 'This time slot is fully booked';
  end if;

  insert into bookings (tenant_id, contact_id, service_id, scheduled_at, duration_minutes, status, created_via)
  values (p_tenant_id, p_contact_id, p_service_id, p_scheduled_at, p_duration_minutes, 'upcoming', 'agent')
  returning * into v_booking;

  return v_booking;
end;
$$;