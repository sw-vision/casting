import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { User, MapPin, User as UserIcon } from 'lucide-react-native';
import { User as UserType } from '../types';

interface Props {
  user: UserType;
  onPress?: () => void;
}

export const UserCard: React.FC<Props> = ({ user, onPress }) => {
  const calculateAge = (dobString?: string) => {
    if (!dobString || dobString.length !== 10) return null;
    const parts = dobString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.dob);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <UserIcon size={30} stroke="#9CA3AF" />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>
          {user.role === 'agency' ? 'Agency' : `Talent${age !== null ? ` • ${age} yrs` : ''}`}
        </Text>
        {user.bio && (
          <Text style={styles.bio} numberOfLines={1}>
            {user.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  info: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  bio: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
});
