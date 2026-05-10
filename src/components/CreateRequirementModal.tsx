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

  const handlePost = () => {
    if (!title || !description) return;
    onPost({
      title,
      description,
      location,
      budget,
    });
    setTitle('');
    setDescription('');
    setLocation('');
    setBudget('');
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
              <X stroke="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post Requirement</Text>
            <TouchableOpacity onPress={handlePost} disabled={!title || !description}>
              <Send stroke={(!title || !description) ? '#333' : '#6200ee'} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lead Actor for Short Film"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the role, age range, specific skills needed..."
              placeholderTextColor="#666"
              multiline
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Mumbai, Remote"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Budget / Remuneration</Text>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
              placeholder="e.g. ₹5,000 / day"
              placeholderTextColor="#666"
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
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
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
});
