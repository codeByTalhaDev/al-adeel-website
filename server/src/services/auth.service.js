const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const TOKEN_EXPIRES_IN = '7d';

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.login = async ({ email, password }) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });

  const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));

  // Same message for a wrong email and a wrong password, so nobody can guess which emails exist
  if (!user || !user.isActive || !passwordMatches) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return { token: signToken(user), user: publicUser(user) };
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Session expired, please log in again');
  }
};

exports.getCurrentUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user || !user.isActive) throw ApiError.unauthorized();
  return publicUser(user);
};