type MockUser = {
  id: string;
  email: string;

  profile: {
    firstName: string;
    image: string;
    lastName: string;
    avatar: string;
    bio: string;
    location: {
      city: string;
      country: string;
    };
  };
      currency: 'EUR' | 'USD' | 'GBP' ;
  role: 'admin' | 'user'; 
  createdAt: string;
  updatedAt: string;
};

const mockUser: MockUser = {
  id: '1',
  email: 'fatmajinbuu@gmail.com',
  profile: {
    firstName: 'Fatma',
    lastName: 'Jinbuu',
    avatar: 'https://c.tenor.com/UnaKnKPB00kAAAAC/tenor.gif',
    bio: 'Software engineer and coffee enthusiast.',
    location: {
      city: 'Hercule',
      country:'DBZ',
    },
  },
  // settings: {
  //   notificationsEnabled: true,
  //   theme: 'dark',
  // },
  currency: 'EUR',
  role:  'admin',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-05T18:30:00.000Z',
};

export { mockUser , type MockUser};