-- Agent-facing reschedule/cancel functions — the counterpart to
-- create_booking. Without these, "change my appointment" or "cancel
-- this" requests have no real action to perform, which is exactly
-- what caused the false-confirmation bug (the model claimed a change
-- happened with no tool available to actually do it).

create or replace function agent_reschedule_booking(
  p_tenant_id uuid,
  p_contact_id uuid,
  p_booking_id uuid,
  p_new_scheduled_at timestamptz
)
returns bookings
language plpgsql
security definer
as $$
declare
  v_booking bookings;
  v_capacity int;
  v_overlap_count int;
begin
  -- Ownership check: this booking must belong to this exact tenant
  -- and contact, or a customer could reschedule someone else's
  -- appointment just by guessing/knowing a booking id.
  select * into v_booking from bookings
  where id = p_booking_id and tenant_id = p_tenant_id and contact_id = p_contact_id;

  if v_booking is null then
    raise exception 'Booking not found';
  end if;

  select capacity into v_capacity from services where id = v_booking.service_id;

  -- Same capacity-aware conflict check as create_booking, but
  -- excluding the booking being moved itself from the count.
  perform 1
  from bookings
  where service_id = v_booking.service_id
    and status = 'upcoming'
    and id != p_booking_id
    and scheduled_at < (p_new_scheduled_at + (v_booking.duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_new_scheduled_at
  for update;

  get diagnostics v_overlap_count = row_count;

  if v_overlap_count >= v_capacity then
    raise exception 'This time slot is fully booked';
  end if;

  update bookings set scheduled_at = p_new_scheduled_at
  where id = p_booking_id
  returning * into v_booking;

  return v_booking;
end;
$$;

create or replace function agent_cancel_booking(
  p_tenant_id uuid,
  p_contact_id uuid,
  p_booking_id uuid
)
returns bookings
language plpgsql
security definer
as $$
declare
  v_booking bookings;
begin
  update bookings set status = 'cancelled'
  where id = p_booking_id and tenant_id = p_tenant_id and contact_id = p_contact_id
  returning * into v_booking;

  if v_booking is null then
    raise exception 'Booking not found';
  end if;

  return v_booking;
end;
$$;

create or replace function agent_cancel_order(
  p_tenant_id uuid,
  p_contact_id uuid,
  p_order_id uuid
)
returns orders
language plpgsql
security definer
as $$
declare
  v_order orders;
begin
  update orders set status = 'cancelled'
  where id = p_order_id and tenant_id = p_tenant_id and contact_id = p_contact_id
  returning * into v_order;

  if v_order is null then
    raise exception 'Order not found';
  end if;

  return v_order;
end;
$$;