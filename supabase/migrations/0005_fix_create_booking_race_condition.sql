create or replace function create_booking(
  p_contact_id uuid,
  p_service_id uuid,
  p_staff_id uuid,
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
  -- lock any conflicting rows first, without aggregating them
  perform 1
  from bookings
  where staff_id = p_staff_id
    and status = 'upcoming'
    and scheduled_at < (p_scheduled_at + (p_duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_scheduled_at
  for update;

  -- now check how many rows that touched
  get diagnostics v_conflict_count = row_count;

  if v_conflict_count > 0 then
    raise exception 'This staff member is already booked at that time';
  end if;

  insert into bookings (tenant_id, contact_id, service_id, staff_id, scheduled_at, duration_minutes, status, created_via)
  values (v_tenant_id, p_contact_id, p_service_id, p_staff_id, p_scheduled_at, p_duration_minutes, 'upcoming', 'agent')
  returning * into v_booking;

  return v_booking;
end;
$$;