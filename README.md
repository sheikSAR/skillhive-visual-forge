
# SkillHive - MySQL Edition

This project uses a MySQL database running locally instead of Supabase.

## Setup Instructions

1. Make sure you have MySQL installed and running on your local machine

2. Create a MySQL database:

```sql
CREATE DATABASE see;
```

3. Import the schema:

```bash
mysql -u root -p see < server/schema.sql
```

4. Start the backend server:

```bash
cd server
npm install
npm run dev
```

5. Start the frontend:

```bash
npm install
npm run dev
```

## Database Configuration

The MySQL database configuration is in `server/index.js`:

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '9688656667',
  database: 'see'
});
```

Update these values if necessary to match your local MySQL setup.

## Admin Login

Default admin credentials:
- Email: adminkareskillhive@klu.ac.in
- Password: admin123
