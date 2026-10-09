const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');

// Checks that the visitor is logged in and puts their details in req.user
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(ApiError.unauthorized('Please log in'));

  req.user = authService.verifyToken(token);
  next();
};

// Checks that the logged-in user is an admin
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') return next(ApiError.forbidden('Admins only'));
  next();
};

// Use this one on admin routes: it runs both checks in order
const requireAdmin = [requireAuth, checkAdminRole];

module.exports = { requireAuth, requireAdmin };