import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { ProfileSection } from './ProfileSection';
import { User, User as UserType } from '../types';

interface Props {
  visible: boolean;
  user: UserType | undefined;
  agencies: UserType[];
  onClose: () => void;
}

export const ProfileModal: React.FC<Props> = ({ visible, user, agencies, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Talent Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <X stroke="#111827" size={24} />
            </TouchableOpacity>
          </View>

          <ProfileSection 
            user={user} 
            agencies={agencies} 
            readOnly={true}
          />
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
    height: '90%',
    padding: 0,
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
