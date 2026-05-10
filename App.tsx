import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus as PlusIcon, LayoutGrid as LayoutGridIcon, User as UserIcon, Building2 as Building2Icon, LogOut as LogOutIcon } from 'lucide-react-native';
const Plus = PlusIcon as any;
const LayoutGrid = LayoutGridIcon as any;
const User = UserIcon as any;
const Building2 = Building2Icon as any;
const LogOut = LogOutIcon as any;
import { StorageService } from './src/services/storage';
import { Feed } from './src/components/Feed';
import { CreatePostModal } from './src/components/CreatePostModal';
import { ProfileScreen } from './src/components/ProfileScreen';
import { AgencyScreen } from './src/components/AgencyScreen';
import { LoginScreen } from './src/components/LoginScreen';
import { Post, Requirement, User as UserType } from './src/types';

export default function App() {
  const [feedItems, setFeedItems] = useState<(Post | Requirement)[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState<'feed' | 'agency' | 'profile'>('feed');
  const [userProfile, setUserProfile] = useState<UserType | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    const loadedPosts = await StorageService.getPosts();
    const loadedRequirements = await StorageService.getRequirements();
    const profile = await StorageService.getProfile();
    
    // Merge and sort by timestamp
    const merged: (Post | Requirement)[] = [...loadedPosts, ...loadedRequirements].sort((a, b) => b.timestamp - a.timestamp);
    
    setFeedItems(merged);
    setUserProfile(profile);
    setIsLoggedIn(!!profile);
    setRefreshing(false);
  };

  const handleCreatePost = async (newPostData: Omit<Post, 'id' | 'timestamp' | 'userId' | 'userName' | 'userAvatar'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      userId: userProfile?.id || 'guest',
      userName: userProfile?.name || 'Rising Talent',
      userAvatar: userProfile?.avatar,
    };

    const updatedDb = await StorageService.addPost(newPost);
    
    // Also save to shared photos in profile
    if (userProfile) {
      const updatedUser: UserType = {
        ...userProfile,
        sharedPhotos: [...(userProfile.sharedPhotos || []), ...(newPostData.imageUri ? [newPostData.imageUri] : [])],
      };
      await StorageService.saveProfile(updatedUser);
      setUserProfile(updatedUser);
    }

    const loadedRequirements = await StorageService.getRequirements();
    const merged = [...updatedDb.posts, ...loadedRequirements].sort((a, b) => b.timestamp - a.timestamp);
    setFeedItems(merged);
  };

  const handleSubscribe = async (agencyId: string) => {
    if (!userProfile) return;
    await StorageService.subscribeToAgency(userProfile.id, agencyId);
    loadData();
  };

  const handleUnsubscribe = async (agencyId: string) => {
    if (!userProfile) return;
    await StorageService.unsubscribeFromAgency(userProfile.id, agencyId);
    loadData();
  };

  const handleLoginSuccess = (user: UserType) => {
    setUserProfile(user);
    setIsLoggedIn(true);
    loadData();
  };

  const handleLogout = async () => {
    await StorageService.logout();
    setIsLoggedIn(false);
    setUserProfile(undefined);
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {currentTab === 'feed' ? 'Casting Connection' : currentTab === 'agency' ? 'Agencies' : 'My Profile'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {currentTab === 'feed' ? 'Discover & Get Discovered' : currentTab === 'agency' ? 'Requirements & Subscriptions' : 'Manage your professional details'}
          </Text>
        </View>
        {currentTab === 'profile' && (
          <TouchableOpacity onPress={handleLogout}>
            <LogOut stroke="#ff4444" size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {currentTab === 'feed' ? (
          <Feed 
            feedItems={feedItems} 
            refreshing={refreshing} 
            onRefresh={loadData} 
            subscribedAgencies={userProfile?.subscribedAgencies}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />
        ) : currentTab === 'agency' ? (
          <AgencyScreen />
        ) : (
          <ProfileScreen />
        )}
      </View>

      {currentTab === 'feed' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Plus stroke="#fff" size={32} />
        </TouchableOpacity>
      )}

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setCurrentTab('feed');
            loadData();
          }}
        >
          <LayoutGrid stroke={currentTab === 'feed' ? '#6200ee' : '#666'} size={24} />
          <Text style={[styles.tabLabel, currentTab === 'feed' && styles.activeTabLabel]}>Feed</Text>
        </TouchableOpacity>

        {userProfile?.role === 'agency' && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              setCurrentTab('agency');
              loadData();
            }}
          >
            <Building2 stroke={currentTab === 'agency' ? '#6200ee' : '#666'} size={24} />
            <Text style={[styles.tabLabel, currentTab === 'agency' && styles.activeTabLabel]}>Agency</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setCurrentTab('profile');
            loadData();
          }}
        >
          <User stroke={currentTab === 'profile' ? '#6200ee' : '#666'} size={24} />
          <Text style={[styles.tabLabel, currentTab === 'profile' && styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onPost={handleCreatePost}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Raised to be above tab bar
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
