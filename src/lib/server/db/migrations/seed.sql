-- seed a student and two meals scheduled for today
INSERT INTO users (id,email,role,valid_meal_plan) VALUES
 ('00000000-0000-0000-0000-000000000001','student@example.com','student',true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_options (id,name,price_cents) VALUES
 ('11111111-1111-1111-1111-111111111111','Chicken Teriyaki',900),
 ('22222222-2222-2222-2222-222222222222','Veggie Pasta',800)
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_schedule (id,serve_date,meal_option_id) VALUES
 ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', CURRENT_DATE, '11111111-1111-1111-1111-111111111111'),
 ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', CURRENT_DATE, '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;
