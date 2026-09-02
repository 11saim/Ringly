-- Removing the staff feature entirely — service_staff join table,
-- staff table, and the staff_id column on bookings.
--
-- Order matters: bookings.staff_id has a foreign key pointing at
-- staff(id), so that column must be dropped BEFORE the staff table
-- itself, or Postgres refuses to drop a table something still
-- references.
 
alter table bookings drop column if exists staff_id;
drop table if exists service_staff;
drop table if exists staff;