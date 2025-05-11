-- This is an empty migration.
UPDATE "User"
SET email = concat(nick, '@example.com')
WHERE email is null;