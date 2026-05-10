import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, DollarSign, Calendar, Building2, User } from 'lucide-react-native';
import { Requirement } from '../types';

interface Props {
  requirement: Requirement;
  isSubscribed: boolean;
  onSubscribe: (agencyId: string) => void;
  onUnsubscribe: (agencyId: string) => void;
}

export const RequirementCard: React.FC<Props> = ({
  requirement,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.agencyInfo}>
          <View style={styles.avatarContainer}>
            {requirement.agencyAvatar ? (
              <Image source={{ uri: requirement.agencyAvatar }} style={styles.avatar} />
            ) : (
              <Building2 size={24} stroke="#666" />
            )}
          </View>
          <View>
            <Text style={styles.agencyName}>{requirement.agencyName}</Text>
            <View style={styles.timeContainer}>
              <Calendar size={12} stroke="#aaa" />
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
            <MapPin size={14} stroke="#6200ee" />
            <Text style={styles.detailText}>{requirement.location}</Text>
          </View>
        )}
        {requirement.budget && (
          <View style={styles.detailItem}>
            <DollarSign size={14} stroke="#6200ee" />
            <Text style={styles.detailText}>{requirement.budget}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
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
    backgroundColor: '#222',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timestamp: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
  subscribeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6200ee',
  },
  subscribedButton: {
    backgroundColor: '#6200ee',
  },
  subscribeText: {
    color: '#6200ee',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subscribedText: {
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#ccc',
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
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 5,
  },
  detailText: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
});
