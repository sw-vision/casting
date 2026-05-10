import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StorageService } from '../services/storage';
import { ProfileSection } from './ProfileSection';
import { User } from '../types';

export const ProfileScreen = () => {
  const [user, setUser] = useState<User | undefined>();
  const [agencies, setAgencies] = useState<User[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const [profile, loadedAgencies] = await Promise.all([
      StorageService.getProfile(),
      StorageService.getAgencies(),
    ]);
    setUser(profile);
    setAgencies(loadedAgencies);
  };

  const handleSave = async (updatedUser: User) => {
    await StorageService.saveProfile(updatedUser);
    setUser(updatedUser);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <View style={styles.container}>
      <ProfileSection user={user} agencies={agencies} onSave={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
