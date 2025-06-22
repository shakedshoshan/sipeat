-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contact (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone bigint NOT NULL,
  message text NOT NULL,
  company_name text,
  mechine_location text,
  CONSTRAINT contact_pkey PRIMARY KEY (id)
);
CREATE TABLE public.machine (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  street text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT machine_pkey PRIMARY KEY (id)
);
CREATE TABLE public.request (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  drink_name text NOT NULL,
  machine uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT request_pkey PRIMARY KEY (id),
  CONSTRAINT request_machine_fkey FOREIGN KEY (machine) REFERENCES public.machine(id)
);