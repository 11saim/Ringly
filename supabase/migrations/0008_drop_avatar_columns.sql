-- Drop avatar-related columns — logo, cover photo, and agent avatar
-- uploads were decided against; keeping only Knowledge Base document
-- storage.

alter table tenants drop column if exists logo_url;
alter table tenants drop column if exists cover_url;
alter table agent_persona drop column if exists avatar_url;