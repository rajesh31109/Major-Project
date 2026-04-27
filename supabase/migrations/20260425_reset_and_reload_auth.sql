create extension if not exists pgcrypto;

drop function if exists public.register_student_with_unique_id(
  uuid, text, text, text, text, text, text, date, text, text, text, text, text, text, text, text
);
drop function if exists public.medical_officer_login(text, text);
drop function if exists public.admin_login(text, text);
drop function if exists public.generate_unique_student_id();

create or replace function public.generate_unique_student_id()
returns text
language plpgsql
as $$
declare
  current_year text := to_char(current_date, 'YYYY');
  next_number integer;
begin
  select coalesce(
    max(
      case
        when unique_student_id ~ ('^STU-' || current_year || '-[0-9]+$')
          then split_part(unique_student_id, '-', 3)::integer
        else null
      end
    ),
    0
  ) + 1
  into next_number
  from public.students;

  return 'STU-' || current_year || '-' || lpad(next_number::text, 6, '0');
end;
$$;

create or replace function public.register_student_with_unique_id(
  p_registered_by uuid,
  p_first_name text,
  p_last_name text,
  p_email text default null,
  p_phone text default null,
  p_roll_number text default null,
  p_department text default null,
  p_date_of_birth date default null,
  p_address text default null,
  p_phc_name text default null,
  p_phc_code text default null,
  p_school_code text default null,
  p_district_code text default null,
  p_state_code text default null,
  p_parent_name text default null,
  p_parent_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_student public.students;
  generated_student_id text;
begin
  generated_student_id := public.generate_unique_student_id();

  insert into public.students (
    unique_student_id,
    first_name,
    last_name,
    email,
    phone,
    roll_number,
    department,
    date_of_birth,
    address,
    phc_name,
    phc_code,
    school_code,
    district_code,
    state_code,
    parent_name,
    parent_phone,
    registered_by
  )
  values (
    generated_student_id,
    p_first_name,
    p_last_name,
    nullif(trim(p_email), ''),
    nullif(trim(p_phone), ''),
    nullif(trim(p_roll_number), ''),
    nullif(trim(p_department), ''),
    p_date_of_birth,
    nullif(trim(p_address), ''),
    nullif(trim(p_phc_name), ''),
    nullif(trim(p_phc_code), ''),
    nullif(trim(p_school_code), ''),
    nullif(trim(p_district_code), ''),
    nullif(trim(p_state_code), ''),
    nullif(trim(p_parent_name), ''),
    nullif(trim(p_parent_phone), ''),
    p_registered_by
  )
  returning * into new_student;

  return jsonb_build_object(
    'success', true,
    'student', row_to_json(new_student)
  );
exception
  when unique_violation then
    return jsonb_build_object(
      'success', false,
      'message', 'A student with the same roll number or unique student ID already exists.'
    );
end;
$$;

create or replace function public.medical_officer_login(
  p_email text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_officer public.medical_officers;
  raw_token text;
begin
  select *
  into selected_officer
  from public.medical_officers
  where lower(email) = lower(trim(p_email))
    and is_active = true
  limit 1;

  if selected_officer.id is null then
    return jsonb_build_object('success', false, 'message', 'Medical officer not found.');
  end if;

  if selected_officer.password_hash::text <> crypt(p_password, selected_officer.password_hash::text) then
    return jsonb_build_object('success', false, 'message', 'Invalid password.');
  end if;

  raw_token := encode(gen_random_bytes(32), 'hex');

  insert into public.session_tokens (
    user_id,
    user_role,
    token_hash,
    expires_at
  )
  values (
    selected_officer.id,
    'medical-officer',
    encode(digest(raw_token, 'sha256'), 'hex'),
    now() + interval '7 days'
  );

  return jsonb_build_object(
    'success', true,
    'session_token', raw_token,
    'user', jsonb_build_object(
      'id', selected_officer.id,
      'email', selected_officer.email,
      'first_name', selected_officer.first_name,
      'last_name', selected_officer.last_name,
      'phc_name', selected_officer.phc_name
    )
  );
end;
$$;

create or replace function public.admin_login(
  p_email text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_admin public.admins;
  raw_token text;
begin
  select *
  into selected_admin
  from public.admins
  where lower(email) = lower(trim(p_email))
  limit 1;

  if selected_admin.id is null then
    return jsonb_build_object('success', false, 'message', 'Admin not found.');
  end if;

  if selected_admin.password_hash::text <> crypt(p_password, selected_admin.password_hash::text) then
    return jsonb_build_object('success', false, 'message', 'Invalid password.');
  end if;

  raw_token := encode(gen_random_bytes(32), 'hex');

  insert into public.session_tokens (
    user_id,
    user_role,
    token_hash,
    expires_at
  )
  values (
    selected_admin.id,
    'admin',
    encode(digest(raw_token, 'sha256'), 'hex'),
    now() + interval '7 days'
  );

  return jsonb_build_object(
    'success', true,
    'session_token', raw_token,
    'user', jsonb_build_object(
      'id', selected_admin.id,
      'email', selected_admin.email,
      'first_name', selected_admin.first_name,
      'last_name', selected_admin.last_name
    )
  );
end;
$$;

grant usage on schema public to anon, authenticated;
grant execute on function public.generate_unique_student_id() to anon, authenticated;
grant execute on function public.register_student_with_unique_id(
  uuid, text, text, text, text, text, text, date, text, text, text, text, text, text, text, text
) to anon, authenticated;
grant execute on function public.medical_officer_login(text, text) to anon, authenticated;
grant execute on function public.admin_login(text, text) to anon, authenticated;

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

notify pgrst, 'reload schema';

select public.medical_officer_login('rajeshpulluri333@gmail.com', 'Raj@.333') as medical_officer_login_test;
