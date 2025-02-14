export * from './mock-user';

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  app: {
    name: 'Roll Your Own Auth',
    description: 'A comprehensive authentication and dashboard solution',
  },
}; 