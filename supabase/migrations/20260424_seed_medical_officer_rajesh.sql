create extension if not exists pgcrypto;

insert into public.medical_officers (
  email,
  password_hash,
  first_name,
  last_name,
  license_number,
  specialization,
  phc_name,
  phc_code,
  phone,
  address,
  is_active
)
values (
  'rajeshpulluri333@gmail.com',
  crypt('Raj@.333', gen_salt('bf')),
  'Rajesh',
  'Pulluri',
  'MO-RAJESH-001',
  'General Medicine',
  'Default PHC',
  'PHC-001',
  null,
  null,
  true
)
on conflict (email) do update
set
  password_hash = excluded.password_hash,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  license_number = excluded.license_number,
  specialization = excluded.specialization,
  phc_name = excluded.phc_name,
  phc_code = excluded.phc_code,
  is_active = excluded.is_active,
  updated_at = current_timestamp;
