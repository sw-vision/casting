import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Post } from '../types';
import { Calendar as CalendarIcon, User as UserIcon } from 'lucide-react-native';
const Calendar = CalendarIcon as any;
const User = UserIcon as any;

const { width } = Dimensions.get('window');

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {post.userAvatar ? (
            <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          ) : (
            <User size={20} stroke="#6B7280" />
          )}
        </View>
        <View>
          <Text style={styles.userName}>{post.userName}</Text>
          <View style={styles.timeContainer}>
            <Calendar size={12} stroke="#9CA3AF" />
            <Text style={styles.timestamp}>
              {new Date(post.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} resizeMode="cover" />
      ) : post.videoUri ? (
        <Video source={{ uri: post.videoUri }} style={styles.image} useNativeControls resizeMode={ResizeMode.COVER} />
      ) : null}

      <View style={styles.content}>
        <Text style={styles.experience}>{post.experience}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timestamp: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 4,
  },
  image: {
    width: '100%',
    height: width * 0.8,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 15,
  },
  experience: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
  },
});
