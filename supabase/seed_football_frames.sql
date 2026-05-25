-- Seed data for Football Frames + real car photos.
-- Run AFTER 20260525000000_football_frames_category.sql is applied.

-- Update car image rows with the new photography. Adjust slugs if they differ
-- in the actual DB. Run a `select slug from products where category='diecast';`
-- first to confirm exact slugs before applying.

update products set images = array['/Assets/Cars/gtr.jpg']
  where slug in ('nissan-gtr','gtr');
update products set images = array['/Assets/Cars/porsche.jpg']
  where slug like 'porsche%';
update products set images = array['/Assets/Cars/pagani.jpg']
  where slug like 'pagani%';
update products set images = array['/Assets/Cars/lamborghini.jpg']
  where slug like 'lamborghini%';
update products set images = array['/Assets/Cars/bugatti.jpg']
  where slug like 'bugatti%';

-- Seed two football frame products. Price = 0 is a sentinel for "quote on
-- request"; the UI never renders 0 for football category (renders the
-- FOOTBALL_FRAME_COPY.priceLine label instead).

insert into products (slug, name, brand, description, images, price, status, category, specs, years)
values
  (
    'custom-football-frame-classic',
    'Custom Football Frame — Classic',
    'Frame Club',
    'A bespoke football shadow box built around your team and your player. Hand-quoted, hand-assembled in Lahore.',
    array['/Assets/Cars/FootballFrames/footbal frmaes.jpg'],
    0,
    'available',
    'football',
    '[]'::jsonb,
    ''
  ),
  (
    'custom-football-frame-modern',
    'Custom Football Frame — Modern',
    'Frame Club',
    'A modern football display with custom typography, jersey numbers, and your reference imagery.',
    array['/Assets/Cars/FootballFrames/footballframe2.jpg'],
    0,
    'available',
    'football',
    '[]'::jsonb,
    ''
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  images = excluded.images,
  category = excluded.category;
