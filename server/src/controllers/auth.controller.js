const service = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

const COOKIE_NAME = 'token';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, same as the token
};

exports.login = asyncHandler(async (req, res) => {
  const { token, user } = await service.login(req.validated.body);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  ok(res, { user }, 'Logged in');
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  ok(res, null, 'Logged out');
});

exports.me = asyncHandler(async (req, res) => {
  ok(res, await service.getCurrentUser(req.user.id));
});