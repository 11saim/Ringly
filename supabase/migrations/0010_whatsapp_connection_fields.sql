-- Path B manual WhatsApp connection needs two more fields than the
-- original schema had: the Phone Number ID (Meta's internal id, used
-- to route incoming webhooks to the right tenant and to call the send
-- API) and the access token itself.
 
alter table whatsapp_connections add column if not exists phone_number_id text;
alter table whatsapp_connections add column if not exists access_token text;