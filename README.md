Quick start:
1. copy .env.example to .env and set values
2. npm install
3. npx sequelize-cli db:migrate
4. npx sequelize-cli db:seed:all
5. npm run dev


Endpoints:
POST /api/auth/register { name, email, password }
POST /api/auth/login { email, password }
POST /api/auth/refresh { refreshToken }
POST /api/auth/logout { refreshToken }
GET /api/auth/profile (Authorization: Bearer <token>)