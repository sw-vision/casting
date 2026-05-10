import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Mail, Lock, LogIn, Building2, User } from 'lucide-react-native';
import { StorageService } from '../services/storage';
import { User as UserType } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const user = await StorageService.login(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. \n\nTry: talent@test.com or agency@test.com');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.blurContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Casting</Text>
          <Text style={[styles.title, styles.highlight]}>Connection</Text>
          <Text style={styles.subtitle}>Empowering talent & agencies</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.loginButtonText}>Logging in...</Text>
            ) : (
              <>
                <LogIn size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Login</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>Demo Accounts:</Text>
            <View style={styles.hintRow}>
              <User size={14} color="#6B7280" />
              <Text style={styles.hintText}>talent@test.com / password123</Text>
            </View>
            <View style={styles.hintRow}>
              <Building2 size={14} color="#6B7280" />
              <Text style={styles.hintText}>agency@test.com / password123</Text>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  blurContainer: {
    width: width * 0.85,
    padding: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 1,
  },
  highlight: {
    color: '#4F46E5',
    marginTop: -5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 55,
    color: '#111827',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  hintContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hintTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hintText: {
    color: '#4B5563',
    fontSize: 12,
    marginLeft: 8,
  },
});
