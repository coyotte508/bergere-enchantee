module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'b978ba9d1181d8175b960933e353f9f2'),
  },
});
