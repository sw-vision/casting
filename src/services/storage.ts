import * as FileSystem from 'expo-file-system/legacy';
import { Paths } from 'expo-file-system';
import { Database, Post, User, Requirement } from '../types';

const DB_PATH = Paths.document.uri + '/db.json';

const DEFAULT_DB: Database = {
  posts: [
    {
      id: 'p1',
      userId: 't1',
      userName: 'John Doe',
      userAvatar: 'https://i.pravatar.cc/150?u=t1',
      experience: 'Just finished shooting a commercial for a tech brand! Amazing experience.',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'p2',
      userId: 't2',
      userName: 'Jane Smith',
      userAvatar: 'https://i.pravatar.cc/150?u=t2',
      experience: 'Back on stage for the weekend theater production. Theater is soul!',
      timestamp: Date.now() - 172800000,
    }
  ],
  requirements: [
    {
      id: 'r1',
      agencyId: 'a1',
      agencyName: 'Star Casting',
      agencyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC',
      title: 'Lead Male Actor for TVC',
      description: 'Looking for a charismatic male actor for a national electronics brand TV commercial.',
      location: 'Mumbai',
      budget: '₹50,000',
      gender: 'male',
      age: '25-30',
      height: '175cm+',
      weight: '70-75kg',
      skintone: 'Fair',
      experience: '2+ years theater/TV',
      availability: 'Immediate',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'r2',
      agencyId: 'a2',
      agencyName: 'Apex Media',
      agencyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AM',
      title: 'Supporting Actress - Web Series',
      description: 'Casting for a supporting role in an upcoming urban drama web series. Expressive eyes are a plus.',
      location: 'Bangalore',
      budget: '₹15,000',
      gender: 'female',
      age: '20-25',
      height: '160-165cm',
      weight: '50-55kg',
      skintone: 'Medium / Dusky',
      experience: 'Fresher welcome',
      availability: 'Weekends',
      timestamp: Date.now() - 7200000,
    }
  ],
  agencies: [
    {
      id: 'a1',
      name: 'Star Casting',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC',
      role: 'agency',
      bio: 'Leading casting agency in Mumbai with 10+ years of experience.',
      email: 'star',
      password: 'star',
    },
    {
      id: 'a2',
      name: 'Apex Media',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AM',
      role: 'agency',
      bio: 'Boutique talent management and production house.',
      email: 'apex',
      password: 'apex',
    }
  ],
  talents: [
    {
      id: 't1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?u=t1',
      role: 'talent',
      subscribedAgencies: ['a1'],
      email: 'john',
      password: 'john',
      gender: 'male',
      dob: '15/05/1998',
      height: '180',
      weight: '75',
      skintone: 'Fair',
      experience: '5 years theater',
      availability: 'Full-time',
      bio: 'Professional actor with a passion for method acting.',
    },
    {
      id: 't2',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?u=t2',
      role: 'talent',
      subscribedAgencies: ['a1', 'a2'],
      email: 'jane',
      password: 'jane',
      gender: 'female',
      dob: '22/11/2002',
      height: '165',
      weight: '55',
      skintone: 'Medium',
      experience: 'Commercials',
      availability: 'Weekends',
      bio: 'Commercial model and actress.',
    },
    {
      id: 't3',
      name: 'Mike Wilson',
      avatar: 'https://i.pravatar.cc/150?u=t3',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'mike',
      password: 'mike',
      gender: 'male',
      dob: '10/01/1991',
      height: '185',
      weight: '82',
      skintone: 'Fair',
      experience: 'Professional',
      availability: 'Immediate',
      bio: 'Experienced character actor for films.',
    },
    {
      id: 't4',
      name: 'Sarah Parker',
      avatar: 'https://i.pravatar.cc/150?u=t4',
      role: 'talent',
      subscribedAgencies: ['a1'],
      email: 'sarah',
      password: 'sarah',
      gender: 'female',
      dob: '05/03/2005',
      height: '170',
      weight: '58',
      skintone: 'Dusky',
      experience: 'Beginner',
      availability: 'Part-time',
      bio: 'Aspiring actress and student.',
    },
    {
      id: 't5',
      name: 'Bobby Junior',
      avatar: 'https://i.pravatar.cc/150?u=t5',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'bobby',
      password: 'bobby',
      gender: 'child',
      dob: '12/08/2018',
      height: '125',
      weight: '28',
      skintone: 'Fair',
      experience: 'School plays',
      availability: 'After school',
      bio: 'Energetic child actor for commercials.',
    },
    {
      id: 't6',
      name: 'Emily Davis',
      avatar: 'https://i.pravatar.cc/150?u=t6',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'emily',
      password: 'emily',
      gender: 'female',
      dob: '18/06/2010',
      height: '160',
      weight: '50',
      skintone: 'Medium',
      experience: 'Teen model',
      availability: 'Weekends',
      bio: 'Graceful teen model with a vibrant personality.',
    },
    {
      id: 't7',
      name: 'Robert Brown',
      avatar: 'https://i.pravatar.cc/150?u=t7',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'robert',
      password: 'robert',
      gender: 'male',
      dob: '30/09/1964',
      height: '175',
      weight: '78',
      skintone: 'Fair',
      experience: 'Veteran',
      availability: 'Flexible',
      bio: 'Veteran actor specializing in grandfatherly roles.',
    },
    {
      id: 't8',
      name: 'Lily Chen',
      avatar: 'https://i.pravatar.cc/150?u=t8',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'lily',
      password: 'lily',
      gender: 'child',
      dob: '14/02/2020',
      height: '110',
      weight: '20',
      skintone: 'Fair',
      experience: 'Beginner',
      availability: 'Weekends',
      bio: 'Adorable child actress with a great smile.',
    },
    {
      id: 't9',
      name: 'Marcus Stone',
      avatar: 'https://i.pravatar.cc/150?u=t9',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'marcus',
      password: 'marcus',
      gender: 'male',
      dob: '25/07/1997',
      height: '190',
      weight: '90',
      skintone: 'Dark',
      experience: 'Action/Stunts',
      availability: 'Full-time',
      bio: 'Physically fit actor experienced in action sequences.',
    },
    {
      id: 't10',
      name: 'Sophia Rossi',
      avatar: 'https://i.pravatar.cc/150?u=t10',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'sophia',
      password: 'sophia',
      gender: 'female',
      dob: '12/12/1981',
      height: '168',
      weight: '62',
      skintone: 'Medium',
      experience: 'TV Series',
      availability: 'Flexible',
      bio: 'Versatile actress with experience in family dramas.',
    },
    {
      id: 't11',
      name: 'Leo Zhang',
      avatar: 'https://i.pravatar.cc/150?u=t11',
      role: 'talent',
      subscribedAgencies: ['a2'],
      email: 'leo',
      password: 'leo',
      gender: 'child',
      dob: '08/04/2016',
      height: '140',
      weight: '35',
      skintone: 'Fair',
      experience: 'Commercials',
      availability: 'After school',
      bio: 'Confident young actor for child-centric brands.',
    }
  ],
};

export const StorageService = {
  async init(): Promise<Database> {
    try {
      const info = await FileSystem.getInfoAsync(DB_PATH);
      if (!info.exists) {
        await this.save(DEFAULT_DB);
        return DEFAULT_DB;
      }
      const content = await FileSystem.readAsStringAsync(DB_PATH);
      const db = JSON.parse(content);
      // Migrations and Seeding for existing DBs
      if (!db.posts || db.posts.length === 0) db.posts = DEFAULT_DB.posts;
      if (!db.requirements || db.requirements.length === 0) db.requirements = DEFAULT_DB.requirements;
      if (!db.agencies || db.agencies.length === 0) db.agencies = DEFAULT_DB.agencies;
      if (!db.talents || db.talents.length === 0) db.talents = DEFAULT_DB.talents;
      
      // Migration: Ensure all sample talents exist and have updated credentials
      if (db.talents) {
        DEFAULT_DB.talents.forEach(sampleTalent => {
          const talentIndex = db.talents.findIndex((u: User) => u.id === sampleTalent.id);
          if (talentIndex === -1) {
            db.talents.push(sampleTalent);
          } else {
            // Force update credentials and missing fields
            db.talents[talentIndex].email = sampleTalent.email;
            db.talents[talentIndex].password = sampleTalent.password;
            if (!db.talents[talentIndex].dob) db.talents[talentIndex].dob = sampleTalent.dob;
          }
        });
      }

      // Migration: Ensure all sample agencies exist and have updated credentials
      if (db.agencies) {
        DEFAULT_DB.agencies.forEach(sampleAgency => {
          const agencyIndex = db.agencies.findIndex((u: User) => u.id === sampleAgency.id);
          if (agencyIndex === -1) {
            db.agencies.push(sampleAgency);
          } else {
            // Force update credentials
            db.agencies[agencyIndex].email = sampleAgency.email;
            db.agencies[agencyIndex].password = sampleAgency.password;
          }
        });
      }
      
      // Save back if we seeded anything
      await this.save(db);
      return db;
    } catch (error) {
      console.error('Failed to init storage:', error);
      return DEFAULT_DB;
    }
  },

  async save(db: Database): Promise<void> {
    try {
      await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (error) {
      console.error('Failed to save storage:', error);
    }
  },

  async addPost(post: Post): Promise<Database> {
    const db = await this.init();
    db.posts.unshift(post); // Newest first
    await this.save(db);
    return db;
  },

  async getPosts(): Promise<Post[]> {
    const db = await this.init();
    return db.posts;
  },

  async getRequirements(): Promise<Requirement[]> {
    const db = await this.init();
    return db.requirements || [];
  },

  async addRequirement(req: Requirement): Promise<Database> {
    const db = await this.init();
    if (!db.requirements) db.requirements = [];
    db.requirements.unshift(req);
    await this.save(db);
    return db;
  },

  async getAgencies(): Promise<User[]> {
    const db = await this.init();
    return db.agencies || [];
  },

  async getTalents(): Promise<User[]> {
    const db = await this.init();
    return db.talents || [];
  },

  async getProfile(): Promise<User | undefined> {
    const db = await this.init();
    return db.userProfile;
  },

  async saveProfile(user: User): Promise<void> {
    const db = await this.init();
    db.userProfile = user;
    
    // If user is an agency, make sure they are in the agencies list
    if (user.role === 'agency') {
      if (!db.agencies) db.agencies = [];
      const index = db.agencies.findIndex(a => a.id === user.id);
      if (index >= 0) {
        db.agencies[index] = user;
      } else {
        db.agencies.push(user);
      }
    } else if (user.role === 'talent') {
      if (!db.talents) db.talents = [];
      const index = db.talents.findIndex(t => t.id === user.id);
      if (index >= 0) {
        db.talents[index] = user;
      } else {
        db.talents.push(user);
      }
    }
    
    await this.save(db);
  },

  async subscribeToAgency(talentId: string, agencyId: string): Promise<void> {
    const db = await this.init();
    if (db.userProfile && db.userProfile.id === talentId) {
      if (!db.userProfile.subscribedAgencies) db.userProfile.subscribedAgencies = [];
      if (!db.userProfile.subscribedAgencies.includes(agencyId)) {
        db.userProfile.subscribedAgencies.push(agencyId);
        await this.save(db);
      }
    }
  },

  async unsubscribeFromAgency(talentId: string, agencyId: string): Promise<void> {
    const db = await this.init();
    if (db.userProfile && db.userProfile.id === talentId && db.userProfile.subscribedAgencies) {
      db.userProfile.subscribedAgencies = db.userProfile.subscribedAgencies.filter(id => id !== agencyId);
      await this.save(db);
    }
  },

  async login(email: string, password: string): Promise<User | null> {
    const db = await this.init();
    const allUsers = [...(db.talents || []), ...(db.agencies || [])];
    const user = allUsers.find(u => 
      u.email?.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (user) {
      db.userProfile = user;
      await this.save(db);
      return user;
    }
    return null;
  },

  async logout(): Promise<void> {
    const db = await this.init();
    db.userProfile = undefined;
    await this.save(db);
  },

  async saveMedia(uri: string): Promise<string> {
    if (!uri.startsWith('file://')) return uri; // Already a remote URL
    const filename = uri.split('/').pop();
    const newPath = `${Paths.document.uri}/${Date.now()}_${filename}`;
    await FileSystem.copyAsync({
      from: uri,
      to: newPath
    });
    return newPath;
  }
};
