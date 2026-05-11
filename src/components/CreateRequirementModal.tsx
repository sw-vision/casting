import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Send } from 'lucide-react-native';
import { Requirement } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPost: (requirement: Omit<Requirement, 'id' | 'timestamp' | 'agencyId' | 'agencyName' | 'agencyAvatar'>) => void;
}

export const CreateRequirementModal: React.FC<Props> = ({ visible, onClose, onPost }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'child' | 'any'>('any');
  const [age, setAge] = useState('');
  const [duration, setDuration] = useState('');
  const [wagesPerDay, setWagesPerDay] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skintone, setSkintone] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  const handlePost = () => {
    if (!title || !description) return;
    onPost({
      title,
      description,
      location,
      budget,
      gender,
      age,
      duration,
      wagesPerDay,
      height,
      weight,
      skintone,
      experience,
      availability,
    });
    setTitle('');
    setDescription('');
    setLocation('');
    setBudget('');
    setGender('any');
    setAge('');
    setDuration('');
    setWagesPerDay('');
    setHeight('');
    setWeight('');
    setSkintone('');
    setExperience('');
    setAvailability('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <X stroke="#111827" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post Requirement</Text>
            <TouchableOpacity onPress={handlePost} disabled={!title || !description}>
              <Send stroke={(!title || !description) ? '#9CA3AF' : '#4F46E5'} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lead Actor for Short Film"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the role, age range, specific skills needed..."
              placeholderTextColor="#9CA3AF"
              multiline
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Mumbai, Remote"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {(['any', 'male', 'female', 'child'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Age Range</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  placeholder="e.g. 20-25"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="e.g. 3 Days"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <Text style={styles.label}>Wages Per Day</Text>
            <TextInput
              style={styles.input}
              value={wagesPerDay}
              onChangeText={setWagesPerDay}
              placeholder="e.g. ₹5,000"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="e.g. 170"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="e.g. 65"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <Text style={styles.label}>Skin Tone</Text>
            <TextInput
              style={styles.input}
              value={skintone}
              onChangeText={setSkintone}
              placeholder="e.g. Fair, Dusky"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Experience Keyword</Text>
            <TextInput
              style={styles.input}
              value={experience}
              onChangeText={setExperience}
              placeholder="e.g. Theater, Commercials"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Availability</Text>
            <TextInput
              style={styles.input}
              value={availability}
              onChangeText={setAvailability}
              placeholder="e.g. Immediate, Weekends"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Budget / Remuneration (Total)</Text>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
              placeholder="e.g. ₹50,000"
              placeholderTextColor="#9CA3AF"
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genderButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  genderText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
