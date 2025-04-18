# ATS Backend - Environment Configuration

This project uses environment variables to manage configuration.  
Make sure to create a `.env` file inside the `ats-backend/` directory with the following content:

---

## 📄 `.env` File Format

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

# Example:
# DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/ats_db

# JWT secret key used for signing tokens
JWT_SECRET=your_jwt_secret_key_here
