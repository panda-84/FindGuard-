const { it } = require('node:test');
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const userModel = dbMock.define('users', {
  id: 1,
  name: 'Bibek',
  email: 'bibek@gmail.com',
  password: 'password123',
  phone: '12345672134',
  dob: '1990-01-01',

});

describe('User Model', () => {
  it('should create a user with valid attributes', async () => {
    const user = await userModel.create({
      name: 'Bibek',
      email: 'bibek@gmail.com',
      password: 'password123',
      phone: '1234567890',
      dob: '1990-01-01',
    });
    expect(user.name).toBe('Bibek');
    expect(user.email).toBe('bibek@gmail.com');
    expect(user.password).toBe('password123');
    expect(user.phone).toBe('1234567890');
    expect(user.dob).toBe('1990-01-01');
  });


 
});

