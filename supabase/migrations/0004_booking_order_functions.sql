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
  -- lock any existing bookings for this staff member in this window
  -- so a simultaneous request can't sneak past the check below
  select count(*) into v_conflict_count
  from bookings
  where staff_id = p_staff_id
    and status = 'upcoming'
    and scheduled_at < (p_scheduled_at + (p_duration_minutes || ' minutes')::interval)
    and (scheduled_at + (duration_minutes || ' minutes')::interval) > p_scheduled_at
  for update;

  if v_conflict_count > 0 then
    raise exception 'This staff member is already booked at that time';
  end if;

  insert into bookings (tenant_id, contact_id, service_id, staff_id, scheduled_at, duration_minutes, status, created_via)
  values (v_tenant_id, p_contact_id, p_service_id, p_staff_id, p_scheduled_at, p_duration_minutes, 'upcoming', 'agent')
  returning * into v_booking;

  return v_booking;
end;
$$;


create or replace function create_order(
  p_contact_id uuid,
  p_items jsonb -- e.g. [{"product_id": "...", "quantity": 2}, ...]
)
returns orders
language plpgsql
security definer
as $$
declare
  v_tenant_id uuid := auth_tenant_id();
  v_order orders;
  v_item jsonb;
  v_product products;
  v_total numeric(10,2) := 0;
begin
  -- lock every product row involved before checking stock,
  -- so two simultaneous orders can't both pass the check
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products
    where id = (v_item->>'product_id')::uuid
    for update;

    if v_product.stock_quantity < (v_item->>'quantity')::int then
      raise exception 'Not enough stock for %', v_product.name;
    end if;
  end loop;

  insert into orders (tenant_id, contact_id, status, total_amount, created_via)
  values (v_tenant_id, p_contact_id, 'pending', 0, 'agent')
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products where id = (v_item->>'product_id')::uuid;

    insert into order_items (order_id, product_id, quantity, unit_price)
    values (v_order.id, v_product.id, (v_item->>'quantity')::int, v_product.price);

    update products set stock_quantity = stock_quantity - (v_item->>'quantity')::int
    where id = v_product.id;

    v_total := v_total + (v_product.price * (v_item->>'quantity')::int);
  end loop;

  update orders set total_amount = v_total where id = v_order.id;
  select * into v_order from orders where id = v_order.id;

  return v_order;
end;
$$;