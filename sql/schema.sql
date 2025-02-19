CREATE TABLE IF NOT EXISTS public.categories (
  id serial primary key,
  name varchar(64) not null unique,
  created timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS public.spurningar (
  id SERIAL PRIMARY KEY,
  spurning TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES public.categories(id),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.svor (
  id SERIAL PRIMARY KEY,
  svor_text TEXT NOT NULL,
  spurning_id INTEGER NOT NULL REFERENCES public.spurningar(id),
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);
