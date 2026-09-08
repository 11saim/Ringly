-- Dashboard-facing cancel_order function. Uses auth_tenant_id() (session-based)
-- rather than a passed-in p_tenant_id, since it's called from the logged-in
-- dashboard, not the agent backend. Restocks products on cancellation —
-- same logic as agent_cancel_order but without requiring contact_id.

create or replace function cancel_order(p_order_id uuid)
returns orders
language plpgsql
security definer
as $$
declare
  v_tenant_id uuid := auth_tenant_id();
  v_order orders;
  v_item record;
begin
  select * into v_order from orders
  where id = p_order_id and tenant_id = v_tenant_id;

  if v_order is null then
    raise exception 'Order not found';
  end if;

  if v_order.status = 'cancelled' then
    return v_order;
  end if;

  for v_item in select * from order_items where order_id = p_order_id
  loop
    update products
    set stock_quantity = stock_quantity + v_item.quantity
    where id = v_item.product_id;
  end loop;

  update orders set status = 'cancelled'
  where id = p_order_id
  returning * into v_order;

  return v_order;
end;
$$;
