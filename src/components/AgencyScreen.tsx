import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Plus, Building2 } from 'lucide-react-native';
import { StorageService } from '../services/storage';
import { Requirement, User, User as UserType } from '../types';
import { RequirementCard } from './RequirementCard';
import { CreateRequirementModal } from './CreateRequirementModal';

import { UserCard } from './UserCard';

export const AgencyScreen = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [agencies, setAgencies] = useState<User[]>([]);
  const [talents, setTalents] = useState<User[]>([]);
  const [user, setUser] = useState<UserType | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    const [loadedReqs, loadedAgencies, loadedTalents, profile] = await Promise.all([
      StorageService.getRequirements(),
      StorageService.getAgencies(),
      StorageService.getTalents(),
      StorageService.getProfile(),
    ]);
    setRequirements(loadedReqs);
    setAgencies(loadedAgencies);
    setTalents(loadedTalents);
    setUser(profile);
    setRefreshing(false);
  };

  const handlePostRequirement = async (reqData: Omit<Requirement, 'id' | 'timestamp' | 'agencyId' | 'agencyName' | 'agencyAvatar'>) => {
    if (!user) return;
    const newReq: Requirement = {
      ...reqData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      agencyId: user.id,
      agencyName: user.name || 'Agency',
      agencyAvatar: user.avatar,
    };

    await StorageService.addRequirement(newReq);
    loadData();
  };

  const handleSubscribe = async (agencyId: string) => {
    if (!user) return;
    await StorageService.subscribeToAgency(user.id, agencyId);
    loadData();
  };

  const handleUnsubscribe = async (agencyId: string) => {
    if (!user) return;
    await StorageService.unsubscribeFromAgency(user.id, agencyId);
    loadData();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {user?.role === 'talent' ? (
        <>
          <Text style={styles.sectionTitle}>Featured Agencies</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agenciesList}>
            {agencies.length === 0 ? (
              <View style={styles.emptyAgencies}>
                <Text style={styles.emptyText}>No agencies found</Text>
              </View>
            ) : (
              agencies.map((agency) => {
                const subscriberCount = talents.filter(t => t.subscribedAgencies?.includes(agency.id)).length;
                return (
                  <View key={agency.id} style={styles.agencyCard}>
                    <View style={styles.agencyAvatar}>
                      <Building2 size={24} stroke="#6200ee" />
                    </View>
                    <Text style={styles.agencyCardName} numberOfLines={1}>{agency.name}</Text>
                    <Text style={styles.subscriberCount}>{subscriberCount} Subscribers</Text>
                    <TouchableOpacity
                      style={[
                        styles.miniSubscribeButton,
                        user?.subscribedAgencies?.includes(agency.id) && styles.miniSubscribedButton
                      ]}
                      onPress={() => user?.subscribedAgencies?.includes(agency.id) ? handleUnsubscribe(agency.id) : handleSubscribe(agency.id)}
                    >
                      <Text style={styles.miniSubscribeText}>
                        {user?.subscribedAgencies?.includes(agency.id) ? '✓' : '+'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        </>
      ) : null}
      <Text style={styles.sectionTitle}>
        {user?.role === 'agency' ? 'My Requirements' : 'My Subscriptions'}
      </Text>
    </View>
  );

  const displayData: (User | Requirement)[] = user?.role === 'agency' 
    ? requirements.filter(r => r.agencyId === user.id)
    : agencies.filter(a => user?.subscribedAgencies?.includes(a.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={displayData}
        renderItem={({ item }) => {
          if ('title' in item) {
            return (
              <RequirementCard
                requirement={item}
                isSubscribed={true}
                onSubscribe={() => {}}
                onUnsubscribe={() => {}}
              />
            );
          }
          return <UserCard user={item} />;
        }}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => (
          user?.role === 'agency' ? (
            <View style={styles.footer}>
              <Text style={styles.sectionTitle}>My Subscribers</Text>
              {talents.filter(t => t.subscribedAgencies?.includes(user.id)).map(talent => (
                <UserCard key={talent.id} user={talent} />
              ))}
            </View>
          ) : null
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#6200ee" />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {user?.role === 'agency' ? 'No requirements posted yet.' : 'No subscriptions yet.'}
            </Text>
          </View>
        }
      />

      {user?.role === 'agency' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Plus stroke="#fff" size={32} />
        </TouchableOpacity>
      )}

      <CreateRequirementModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onPost={handlePostRequirement}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  agenciesList: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  agencyCard: {
    width: 100,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  agencyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyCardName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  subscriberCount: {
    color: '#666',
    fontSize: 10,
    marginBottom: 8,
  },
  miniSubscribeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniSubscribedButton: {
    backgroundColor: '#6200ee',
  },
  miniSubscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyAgencies: {
    padding: 20,
    backgroundColor: '#111',
    borderRadius: 12,
    width: 200,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});
