const { z } = require('zod');

exports.login = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email().max(180),
    password: z.string().min(8).max(100),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});