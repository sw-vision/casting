import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import { MapPin, DollarSign, Calendar, Building2, User, Clock, Users, Ruler, Scale, Palette, Briefcase, Share2 } from 'lucide-react-native';
import { Requirement } from '../types';

interface Props {
  requirement: Requirement;
  isSubscribed: boolean;
  onSubscribe: (agencyId: string) => void;
  onUnsubscribe: (agencyId: string) => void;
  showShare?: boolean;
}

export const RequirementCard: React.FC<Props> = ({
  requirement,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  showShare = false,
}) => {
  const handleShare = async () => {
    try {
      const genderText = requirement.gender ? requirement.gender.charAt(0).toUpperCase() + requirement.gender.slice(1) : 'Any';
      const shareText = `
🌟 *CASTING CALL: ${requirement.title}* 🌟

🏢 *Agency:* ${requirement.agencyName}
📍 *Location:* ${requirement.location || 'Multiple Locations'}
💰 *Budget:* ${requirement.budget || 'Competitive'}

👥 *Requirements:*
• Gender: ${genderText}
• Age: ${requirement.age || 'Any'}
• Height: ${requirement.height || 'Not specified'}
• Skin Tone: ${requirement.skintone || 'Any'}
• Experience: ${requirement.experience || 'Fresher/Experienced'}

📝 *Description:*
${requirement.description}

📞 *How to Apply:*
Contact *${requirement.agencyName}* via the Casting Connection app or their official portal.

#CastingCall #Audition #ActingJobs #CastingConnection
      `.trim();

      await Share.share({
        message: shareText,
        title: requirement.title,
      });
    } catch (error) {
      console.error('Error sharing requirement:', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.agencyInfo}>
          <View style={styles.avatarContainer}>
            {requirement.agencyAvatar ? (
              <Image source={{ uri: requirement.agencyAvatar }} style={styles.avatar} />
            ) : (
              <Building2 size={24} stroke="#9CA3AF" />
            )}
          </View>
          <View>
            <Text style={styles.agencyName}>{requirement.agencyName}</Text>
            <View style={styles.timeContainer}>
              <Calendar size={12} stroke="#9CA3AF" />
              <Text style={styles.timestamp}>
                {new Date(requirement.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.subscribeButton, isSubscribed && styles.subscribedButton]}
          onPress={() => isSubscribed ? onUnsubscribe(requirement.agencyId) : onSubscribe(requirement.agencyId)}
        >
          <Text style={[styles.subscribeText, isSubscribed && styles.subscribedText]}>
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{requirement.title}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {requirement.description}
      </Text>

      <View style={styles.details}>
        {requirement.location && (
          <View style={styles.detailItem}>
            <MapPin size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>{requirement.location}</Text>
          </View>
        )}
        {requirement.gender && (
          <View style={styles.detailItem}>
            <User size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Gender: {requirement.gender.charAt(0).toUpperCase() + requirement.gender.slice(1)}</Text>
          </View>
        )}
        {requirement.age && (
          <View style={styles.detailItem}>
            <Users size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Age: {requirement.age}</Text>
          </View>
        )}
        {requirement.duration && (
          <View style={styles.detailItem}>
            <Clock size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Duration: {requirement.duration}</Text>
          </View>
        )}
        {requirement.wagesPerDay && (
          <View style={styles.detailItem}>
            <DollarSign size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Wages: {requirement.wagesPerDay} / day</Text>
          </View>
        )}
        {requirement.height && (
          <View style={styles.detailItem}>
            <Ruler size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Height: {requirement.height}</Text>
          </View>
        )}
        {requirement.weight && (
          <View style={styles.detailItem}>
            <Scale size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Weight: {requirement.weight}</Text>
          </View>
        )}
        {requirement.skintone && (
          <View style={styles.detailItem}>
            <Palette size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Skin: {requirement.skintone}</Text>
          </View>
        )}
        {requirement.experience && (
          <View style={styles.detailItem}>
            <Briefcase size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Exp: {requirement.experience}</Text>
          </View>
        )}
        {requirement.availability && (
          <View style={styles.detailItem}>
            <Calendar size={14} stroke="#4F46E5" />
            <Text style={styles.detailText}>Avail: {requirement.availability}</Text>
          </View>
        )}
      </View>
      
      {showShare && (
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={16} stroke="#4F46E5" />
          <Text style={styles.shareText}>Share Casting Call</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  agencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  agencyName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timestamp: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 4,
  },
  subscribeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  subscribedButton: {
    backgroundColor: '#4F46E5',
  },
  subscribeText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subscribedText: {
    color: '#ffffff',
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 5,
  },
  detailText: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  shareText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
});
