export interface MockUser {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

export const mockUser: MockUser = {
  id: '1',
  email: 'john.doe@example.com',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
}; 