export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'talent' | 'agency';
  dob?: string;
  height?: string;
  weight?: string;
  bio?: string;
  sharedPhotos?: string[];
  subscribedAgencies?: string[]; // IDs of agencies this talent is subscribed to
  skintone?: string;
  experience?: string;
  availability?: string;
  email?: string;
  password?: string;
}

export interface Requirement {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyAvatar?: string;
  title: string;
  description: string;
  location?: string;
  budget?: string;
  gender?: 'male' | 'female' | 'child' | 'any';
  age?: string;
  duration?: string;
  wagesPerDay?: string;
  height?: string;
  weight?: string;
  skintone?: string;
  experience?: string;
  availability?: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUri?: string;
  videoUri?: string;
  experience: string;
  timestamp: number;
}

export interface Database {
  posts: Post[];
  requirements: Requirement[];
  agencies: User[];
  talents: User[];
  userProfile?: User;
}
