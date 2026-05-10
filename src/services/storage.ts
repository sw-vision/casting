import * as FileSystem from 'expo-file-system/legacy';
import { Paths } from 'expo-file-system';
import { Database, Post, User } from '../types';

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
      description: 'Looking for a charismatic male actor aged 25-30 for a national electronics brand TV commercial.',
      location: 'Mumbai',
      budget: '₹50,000',
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
      budget: '₹15,000 / day',
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
    },
    {
      id: 'a2',
      name: 'Apex Media',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AM',
      role: 'agency',
      bio: 'Boutique talent management and production house.',
      email: 'agency@test.com',
      password: 'password123',
    }
  ],
  talents: [
    {
      id: 't1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?u=t1',
      role: 'talent',
      subscribedAgencies: ['a1'],
      email: 'talent@test.com',
      password: 'password123',
    },
    {
      id: 't2',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?u=t2',
      role: 'talent',
      subscribedAgencies: ['a1', 'a2'],
    },
    {
      id: 't3',
      name: 'Mike Wilson',
      avatar: 'https://i.pravatar.cc/150?u=t3',
      role: 'talent',
      subscribedAgencies: ['a2'],
    },
    {
      id: 't4',
      name: 'Sarah Parker',
      avatar: 'https://i.pravatar.cc/150?u=t4',
      role: 'talent',
      subscribedAgencies: ['a1'],
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
      
      // Migration: Ensure test accounts exist in existing DB with correct credentials
      if (db.talents) {
        const talentIndex = db.talents.findIndex((u: User) => u.email?.toLowerCase() === 'talent@test.com' || u.id === 't1');
        if (talentIndex >= 0) {
          db.talents[talentIndex] = { ...db.talents[talentIndex], ...DEFAULT_DB.talents[0] };
        } else {
          db.talents.push(DEFAULT_DB.talents[0]);
        }
      }

      if (db.agencies) {
        const agencyIndex = db.agencies.findIndex((u: User) => u.email?.toLowerCase() === 'agency@test.com' || u.id === 'a2');
        if (agencyIndex >= 0) {
          db.agencies[agencyIndex] = { ...db.agencies[agencyIndex], ...DEFAULT_DB.agencies[1] };
        } else {
          db.agencies.push(DEFAULT_DB.agencies[1]);
        }
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
  }
};
