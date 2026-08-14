# Admin User Setup Instructions

## Issue Found
The admin panel is not accessible because there are **no admin users** in the database. The database check found 0 admin users in the `user_roles` table.

## Solution: Set Up Admin Access

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project (ihxtghsmlzzbqrnxzmcb)

2. **Create a user in Authentication**
   - Go to Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter email: `teddyfx909@gmail.com` (or your preferred admin email)
   - Enter a secure password
   - Click "Create user"

3. **Assign admin role**
   - Go to SQL Editor in Supabase Dashboard
   - Run this SQL query (replace `YOUR_USER_ID` with the user ID from step 2):

```sql
-- Get the user ID from Authentication → Users page
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'super_admin');
```

### Option 2: Using SQL Script

If you have the user ID, run this directly in the Supabase SQL Editor:

```sql
-- Replace with actual user UUID
INSERT INTO user_roles (user_id, role, created_at)
VALUES ('YOUR_USER_ID_HERE', 'super_admin', NOW());
```

### Option 3: Create a new admin user via SQL

```sql
-- This creates both the auth user and assigns admin role
-- Note: You'll need to use Supabase Auth API for user creation, 
-- then assign the role separately

-- After creating user in Auth, run:
INSERT INTO user_roles (user_id, role, created_at)
VALUES ('USER_ID_FROM_AUTH', 'super_admin', NOW());
```

## After Setup

1. **Test admin access**
   - Visit https://www.findhive.store/admin/login
   - Login with the admin email and password
   - You should be redirected to the admin dashboard

2. **Admin features available**
   - Products management (add, edit, delete products)
   - Orders management
   - Categories management
   - Inventory tracking
   - Customer management
   - Reviews management
   - Promotions

## Product Display Status

✅ **Products are working correctly**
- 5 products exist in database
- All products have "published" status
- Categories are properly configured
- Products should be displaying on the homepage

If products are not visible on the frontend, it may be a caching issue or the frontend needs to be redeployed.

## Multiple Admin Users

To add more admins (like warrenharry01@gmail.com), repeat the process for each email:

```sql
-- For each additional admin user
INSERT INTO user_roles (user_id, role, created_at)
VALUES ('ANOTHER_USER_ID', 'admin', NOW());
```

Use `super_admin` for full access or `admin` for standard admin access.
