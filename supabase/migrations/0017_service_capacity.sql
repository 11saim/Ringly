-- Each service can now specify how many bookings are allowed to
-- overlap at the same time (e.g. 3 chairs doing haircuts at once).
-- Defaults to 1, matching the previous hardcoded behavior, so nothing
-- changes for existing services until a business explicitly raises it.

alter table services add column if not exists capacity int not null default 1;