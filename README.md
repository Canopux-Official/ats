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

#Base URL
BASE_URL=http://localhost:3000



# ATS Flask - Environment Configuration
GEMINI_API_KEY=your_gemini_api_key


## 🛠️ Useful Commands

To run the backend code:

```bash
npm run start:dev

To clear the database:

```bash
npm run clear-db
```
