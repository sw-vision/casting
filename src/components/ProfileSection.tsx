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
import { RequirementCard } from './RequirementCard';
import { User as UserType, Requirement } from '../types';
import { StorageService } from '../services/storage';
import { Briefcase } from 'lucide-react-native';
interface Props {
  user: UserType | undefined;
  agencies: UserType[];
  onSave?: (user: UserType) => void;
  readOnly?: boolean;
}

export const ProfileSection: React.FC<Props> = ({ user, agencies, onSave, readOnly }) => {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [skintone, setSkintone] = useState(user?.skintone || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [availability, setAvailability] = useState(user?.availability || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState<'talent' | 'agency'>(user?.role || 'talent');
  const [proposals, setProposals] = useState<Requirement[]>([]);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setDob(user.dob || '');
      setHeight(user.height || '');
      setWeight(user.weight || '');
      setSkintone(user.skintone || '');
      setExperience(user.experience || '');
      setAvailability(user.availability || '');
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
      const savedUri = await StorageService.saveMedia(result.assets[0].uri);
      setAvatar(savedUri);
    }
  };

  const handleSave = () => {
    onSave({
      ...user, // Retain existing properties like email, password, and sharedPhotos
      id: user?.id || Math.random().toString(36).substr(2, 9),
      name,
      avatar,
      role,
      dob,
      height,
      weight,
      skintone,
      experience,
      availability,
      bio,
      subscribedAgencies: user?.subscribedAgencies || [],
    });
  };

  const calculateAge = (dobString: string) => {
    if (!dobString || dobString.length !== 10) return null;
    const parts = dobString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getTime() > today.getTime()) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const calculateMatchScore = (u: UserType, req: Requirement) => {
    let score = 0;
    const userAge = calculateAge(u.dob || '');
    
    // Gender (30%)
    if (req.gender === 'any' || req.gender === u.gender) score += 30;
    
    // Age (20%)
    if (req.age && userAge !== null) {
      const parts = req.age.split('-').map(p => parseInt(p.trim()));
      if (parts.length === 2) {
        if (userAge >= parts[0] && userAge <= parts[1]) score += 20;
      } else if (!isNaN(parts[0])) {
        if (Math.abs(userAge - parts[0]) <= 5) score += 20;
      } else {
        score += 20;
      }
    } else {
      score += 20;
    }

    // Height (15%)
    if (req.height && u.height) {
      const reqH = parseInt(req.height);
      const userH = parseInt(u.height);
      if (!isNaN(reqH) && !isNaN(userH)) {
        if (Math.abs(reqH - userH) <= 10) score += 15;
      } else {
        score += 15;
      }
    } else {
      score += 15;
    }

    // Skin Tone (10%)
    if (req.skintone && u.skintone) {
      if (req.skintone.toLowerCase().includes(u.skintone.toLowerCase()) || 
          u.skintone.toLowerCase().includes(req.skintone.toLowerCase())) {
        score += 10;
      }
    } else {
      score += 10;
    }

    // Experience (15%)
    if (req.experience && u.experience) {
      const reqExp = req.experience.toLowerCase();
      const userExp = u.experience.toLowerCase();
      if (userExp.includes(reqExp) || reqExp.includes(userExp)) score += 15;
      else score += 5;
    } else {
      score += 15;
    }

    // Availability (10%)
    if (req.availability && u.availability) {
      if (u.availability.toLowerCase().includes(req.availability.toLowerCase())) score += 10;
    } else {
      score += 10;
    }

    return score;
  };

  const loadProposals = async () => {
    if (!user || user.role !== 'talent') return;
    const allReqs = await StorageService.getRequirements();
    const matches = allReqs.filter(req => {
      // Must be subscribed to the agency to see their proposals
      if (!user.subscribedAgencies?.includes(req.agencyId)) return false;
      
      const score = calculateMatchScore(user, req);
      return score >= 70;
    });
    setProposals(matches);
  };

  React.useEffect(() => {
    if (!readOnly && user?.role === 'talent') {
      loadProposals();
    }
  }, [user, readOnly]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={readOnly ? undefined : pickImage}
          activeOpacity={readOnly ? 1 : 0.7}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <User size={60} stroke="#666" />
          )}
          {!readOnly && (
            <View style={styles.cameraIcon}>
              <Camera size={20} stroke="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.title}>{name || (readOnly ? 'User Profile' : 'My Profile')}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, readOnly && styles.readOnlyInput]}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          placeholderTextColor="#9CA3AF"
          editable={!readOnly}
        />
        <View style={styles.row}>
          <View style={[styles.inputGroup, { marginRight: 10 }]}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={dob}
              onChangeText={setDob}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              editable={!readOnly}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <View style={[styles.input, styles.readOnlyInput, { justifyContent: 'center' }]}>
              <Text style={{ fontSize: 18, color: '#111827', fontWeight: '500' }}>
                {calculateAge(dob) !== null ? `${calculateAge(dob)} years` : '--'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { marginRight: 10 }]}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={height}
              onChangeText={setHeight}
              placeholder="e.g. 180"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              editable={!readOnly}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g. 75"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              editable={!readOnly}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { marginRight: 10 }]}>
            <Text style={styles.label}>Skin Tone</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={skintone}
              onChangeText={setSkintone}
              placeholder="e.g. Fair, Medium, Dark"
              placeholderTextColor="#9CA3AF"
              editable={!readOnly}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Availability</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={availability}
              onChangeText={setAvailability}
              placeholder="e.g. Full-time, Weekends"
              placeholderTextColor="#9CA3AF"
              editable={!readOnly}
            />
          </View>
        </View>

        <Text style={styles.label}>Work Experience</Text>
        <TextInput
          style={[styles.input, readOnly && styles.readOnlyInput]}
          value={experience}
          onChangeText={setExperience}
          placeholder="e.g. 5 years theater, 2 commercials"
          placeholderTextColor="#9CA3AF"
          editable={!readOnly}
        />

        <Text style={styles.label}>Bio / Experience Summary</Text>
        <TextInput
          style={[styles.input, styles.bioInput, readOnly && styles.readOnlyInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Experience summary..."
          placeholderTextColor="#9CA3AF"
          multiline
          editable={!readOnly}
        />

        {!readOnly && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} stroke="#fff" />
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        )}

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

        {!readOnly && user?.role === 'talent' && (
          <View style={styles.proposalsSection}>
            <View style={styles.sectionHeader}>
              <Briefcase size={20} stroke="#4F46E5" />
              <Text style={styles.sectionTitle}>Casting Proposals</Text>
            </View>
            <Text style={styles.proposalInfo}>
              Based on your profile compatibility (70%+ match) with subscribed agencies.
            </Text>
            {proposals.length > 0 ? (
              proposals.map(req => (
                <RequirementCard 
                  key={req.id} 
                  requirement={req} 
                  isSubscribed={true}
                  onSubscribe={() => {}}
                  onUnsubscribe={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyProposals}>
                <Text style={styles.emptyText}>No matching casting proposals found yet.</Text>
                <Text style={styles.emptySubText}>Keep your profile updated to get more matches!</Text>
              </View>
            )}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4F46E5',
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
    backgroundColor: '#4F46E5',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    color: '#111827',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  gallerySection: {
    marginTop: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#111827',
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
    backgroundColor: '#F3F4F6',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeRoleButton: {
    backgroundColor: '#4F46E5',
  },
  roleButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  activeRoleButtonText: {
    color: '#ffffff',
  },
  subscriptionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  readOnlyInput: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    paddingHorizontal: 0,
    fontSize: 18,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 10,
  },
  proposalsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  proposalInfo: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  emptyProposals: {
    padding: 30,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptySubText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});
