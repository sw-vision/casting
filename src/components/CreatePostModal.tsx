import { useReducer } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { X as XIcon, Image as ImageIcon, Send as SendIcon } from 'lucide-react-native';
const X = XIcon as any;
const ImagePlaceholder = ImageIcon as any;
const Send = SendIcon as any;
import { Post } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPost: (post: Omit<Post, 'id' | 'timestamp' | 'userId' | 'userName' | 'userAvatar'>) => void;
}

interface FormState {
  image: string | null;
  video: string | null;
  experience: string;
}

type FormAction =
  | { type: 'SET_IMAGE'; payload: string | null }
  | { type: 'SET_VIDEO'; payload: string | null }
  | { type: 'SET_EXPERIENCE'; payload: string }
  | { type: 'RESET' };

const initialState: FormState = {
  image: null,
  video: null,
  experience: '',
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...state, image: action.payload, video: null };
    case 'SET_VIDEO':
      return { ...state, video: action.payload, image: null };
    case 'SET_EXPERIENCE':
      return { ...state, experience: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const CreatePostModal = ({ visible, onClose, onPost }: Props) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { image, video, experience } = state;

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.type === 'image') {
        dispatch({ type: 'SET_IMAGE', payload: asset.uri });
      } else if (asset.type === 'video') {
        dispatch({ type: 'SET_VIDEO', payload: asset.uri });
      }
    }
  };

  const handleSubmit = () => {
    if (experience || image || video) {
      onPost({ imageUri: image ?? undefined, videoUri: video ?? undefined, experience });
      dispatch({ type: 'RESET' });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Your Experience</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#111827" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickMedia}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : video ? (
                <Video
                  source={{ uri: video }}
                  style={styles.previewVideo}
                  resizeMode={ResizeMode.COVER}
                  useNativeControls
                />
              ) : (
                <View style={styles.placeholder}>
                  <ImagePlaceholder color="#9CA3AF" size={48} />
                  <Text style={styles.placeholderText}>Select a photo or video</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Tell your story..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={experience}
              onChangeText={(text: string) => dispatch({ type: 'SET_EXPERIENCE', payload: text })}
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.submitButton, (!experience && !image && !video) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!experience && !image && !video}
          >
            <Send color="#fff" size={20} />
            <Text style={styles.submitText}>Post to Wall</Text>
          </TouchableOpacity>
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
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '90%',
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
    marginBottom: 20,
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  imagePicker: {
    width: '100%',
    height: 250,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: 250,
  },
  previewVideo: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E7EB',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    padding: 15,
    color: '#111827',
    fontSize: 16,
    height: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
