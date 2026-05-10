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
            <User size={20} stroke="#fff" />
          )}
        </View>
        <View>
          <Text style={styles.userName}>{post.userName}</Text>
          <View style={styles.timeContainer}>
            <Calendar size={12} stroke="#aaa" />
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
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    backgroundColor: '#333',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timestamp: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
  image: {
    width: '100%',
    height: width * 0.8,
    backgroundColor: '#222',
  },
  content: {
    padding: 15,
  },
  experience: {
    color: '#eee',
    fontSize: 14,
    lineHeight: 20,
  },
});
