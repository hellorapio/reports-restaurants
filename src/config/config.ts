export default () => ({
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'production',
  jwt: {
    sec: process.env.JWT_ACCESS || '',
    ref: process.env.JWT_REFRESH || '',
    accessExp: '30d',
    refreshExp: '90d',
    adminExp: '6h',
  },
  db: {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 1433,
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || '',
    name: process.env.DB_NAME || '',
  },
});
