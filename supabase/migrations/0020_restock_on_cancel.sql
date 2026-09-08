-- Replaces agent_cancel_order to actually restock products when an
-- order is cancelled. Without this, every cancellation permanently
-- shrinks stock_quantity with no way to get it back — a real
-- inventory-corruption bug for any product-based tenant.

drop function if exists agent_cancel_order(uuid, uuid, uuid);

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
  v_item record;
begin
  select * into v_order from orders
  where id = p_order_id and tenant_id = p_tenant_id and contact_id = p_contact_id;

  if v_order is null then
    raise exception 'Order not found';
  end if;

  -- Guard against double-cancelling (and double-restocking) an order
  -- that's already cancelled.
  if v_order.status = 'cancelled' then
    return v_order;
  end if;

  -- Restock every item on this order before marking it cancelled.
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