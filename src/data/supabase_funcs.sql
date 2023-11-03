create function public.handle_new_user()
returns trigger as $$
begin
  INSERT into public."Employees" (id, "Email", "Name", "EmployeeNumber", "Role")
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'Name',
    new.raw_user_meta_data->>'EmployeeNumber',
    (new.raw_user_meta_data->>'Role')::integer
  );
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
