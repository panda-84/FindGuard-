import request from 'supertest';
import app from '../app.js';
import { sequelize } from '../Database/db.js';
import { Users } from '../model/userModel.js';


beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await Users.destroy({ where: {}, truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '1234567890',
          dob: '1999-01-01',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test User');
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should fail to register if email already exists', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Existing User',
        email: 'exists@example.com',
        password: 'password123',
        phone: '9876543210',
        dob: '1998-01-01',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'exists@example.com',
          password: 'password456',
          phone: '1112223333',
          dob: '2000-01-01',
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toBe('Email already exists');
    });

    it('should fail to register with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'missing@example.com',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('All fields are required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
        phone: '1231231234',
        dob: '1995-05-05',
      });
    });

    it('should login a user successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data).toHaveProperty('access_token');
    });

    it('should fail to login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Incorrect password');
    });

    it('should fail to login with a non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nosuchuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('User not found');
    });
  });
});
