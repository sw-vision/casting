import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User as UserIcon, Camera as CameraIcon, Save as SaveIcon } from 'lucide-react-native';
const User = UserIcon as any;
const Camera = CameraIcon as any;
const Save = SaveIcon as any;
import { UserCard } from './UserCard';
import { User as UserType } from '../types';

interface Props {
  user: UserType | undefined;
  agencies: UserType[];
  onSave: (user: UserType) => void;
}

export const ProfileSection: React.FC<Props> = ({ user, agencies, onSave }) => {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState<'talent' | 'agency'>(user?.role || 'talent');

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setDob(user.dob || '');
      setHeight(user.height || '');
      setWeight(user.weight || '');
      setBio(user.bio || '');
      setRole(user.role || 'talent');
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    onSave({
      id: user?.id || Math.random().toString(36).substr(2, 9),
      name,
      avatar,
      role,
      dob,
      height,
      weight,
      bio,
      subscribedAgencies: user?.subscribedAgencies || [],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <User size={60} stroke="#666" />
          )}
          <View style={styles.cameraIcon}>
            <Camera size={20} stroke="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>{name || 'My Profile'}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#666"
        />
        <View style={styles.row}>
          <View style={[styles.inputGroup, { marginRight: 10 }]}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { marginRight: 10 }]}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="e.g. 180"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 75"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Bio / Experience Summary</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell agencies about your acting journey..."
          placeholderTextColor="#666"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} stroke="#fff" />
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        {user?.sharedPhotos && user.sharedPhotos.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Shared Photos</Text>
            <View style={styles.gallery}>
              {user.sharedPhotos.map((uri: string, index: number) => (
                <Image key={index} source={{ uri }} style={styles.galleryImage} />
              ))}
            </View>
          </View>
        )}

        {role === 'talent' && user?.subscribedAgencies && user.subscribedAgencies.length > 0 && (
          <View style={styles.subscriptionSection}>
            <Text style={styles.sectionTitle}>My Subscriptions</Text>
            {user.subscribedAgencies.map((agencyId: string) => {
              const agency = agencies.find(a => a.id === agencyId);
              if (!agency) return null;
              return <UserCard key={agencyId} user={agency} />;
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  avatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200ee',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    flex: 1,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  gallerySection: {
    marginTop: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  galleryImage: {
    width: '30.5%',
    aspectRatio: 1,
    margin: '1.4%',
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeRoleButton: {
    backgroundColor: '#6200ee',
  },
  roleButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  activeRoleButtonText: {
    color: '#fff',
  },
  subscriptionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
});
