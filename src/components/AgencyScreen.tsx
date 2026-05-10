import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Plus, Building2, Users, ClipboardList, CheckCircle, Clock, GraduationCap, Search, ChevronDown, ChevronUp } from 'lucide-react-native';
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
  const flatListRef = useRef<FlatList>(null);

  const [searchQuery, setSearchQuery] = useState({
    height: '',
    weight: '',
    skintone: '',
    experience: '',
    availability: '',
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<User[] | null>(null);

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

  const displayData: (User | Requirement)[] = user?.role === 'agency' 
    ? requirements.filter(r => r.agencyId === user.id)
    : agencies.filter(a => user?.subscribedAgencies?.includes(a.id));

  const renderAgencyDashboard = () => {
    if (user?.role !== 'agency') return null;

    const myRequirementsCount = requirements.filter(r => r.agencyId === user.id).length;
    const mySubscribersCount = talents.filter(t => t.subscribedAgencies?.includes(user.id)).length;

    // Mocks for fields not currently in DB
    const studentsCount = 145;
    const runningProjectsCount = 3;
    const upcomingProjectsCount = 5;
    const completedProjectsCount = 12;

    const dashboardData = [
      { id: '1', title: 'Shared Requirements', value: myRequirementsCount, icon: <ClipboardList size={20} stroke="#4F46E5" />, bg: '#EEF2FF' },
      { id: '2', title: 'Total Subscribers', value: mySubscribersCount, icon: <Users size={20} stroke="#10B981" />, bg: '#ECFDF5' },
      { id: '3', title: 'Total Students', value: studentsCount, icon: <GraduationCap size={20} stroke="#8B5CF6" />, bg: '#F5F3FF' },
      { id: '4', title: 'Running Projects', value: runningProjectsCount, icon: <Clock size={20} stroke="#F59E0B" />, bg: '#FFFBEB' },
      { id: '5', title: 'Upcoming Projects', value: upcomingProjectsCount, icon: <ClipboardList size={20} stroke="#3B82F6" />, bg: '#EFF6FF' },
      { id: '6', title: 'Completed Projects', value: completedProjectsCount, icon: <CheckCircle size={20} stroke="#14B8A6" />, bg: '#F0FDFA' },
    ];

    return (
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Dashboard Overview</Text>
        <View style={styles.dashboardGrid}>
          {dashboardData.map((item) => {
            const isClickable = item.id === '1' || item.id === '2';
            const CardComponent = isClickable ? TouchableOpacity : View;
            
            const handlePress = () => {
              if (item.id === '1') {
                if (displayData.length > 0) {
                  flatListRef.current?.scrollToIndex({ index: 0, animated: true, viewOffset: 20 });
                } else {
                  flatListRef.current?.scrollToOffset({ offset: 300, animated: true });
                }
              } else if (item.id === '2') {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            };

            return (
              <CardComponent 
                key={item.id} 
                style={styles.dashboardCard}
                onPress={isClickable ? handlePress : undefined}
                activeOpacity={isClickable ? 0.7 : 1}
              >
                <View style={[styles.dashboardIconContainer, { backgroundColor: item.bg }]}>
                  {item.icon}
                </View>
                <Text style={styles.dashboardValue}>{item.value}</Text>
                <Text style={styles.dashboardLabel}>{item.title}</Text>
              </CardComponent>
            );
          })}
        </View>
      </View>
    );
  };

  const handleSearch = () => {
    const results = talents.filter(t => {
      let match = true;
      if (searchQuery.height && t.height !== searchQuery.height) match = false;
      if (searchQuery.weight && t.weight !== searchQuery.weight) match = false;
      if (searchQuery.skintone && (!t.skintone || !t.skintone.toLowerCase().includes(searchQuery.skintone.toLowerCase()))) match = false;
      if (searchQuery.experience && 
         (!t.experience || !t.experience.toLowerCase().includes(searchQuery.experience.toLowerCase())) && 
         (!t.bio || !t.bio.toLowerCase().includes(searchQuery.experience.toLowerCase()))) match = false;
      if (searchQuery.availability && (!t.availability || !t.availability.toLowerCase().includes(searchQuery.availability.toLowerCase()))) match = false;
      return match;
    });
    setSearchResults(results);
  };

  const renderTalentSearch = () => {
    if (user?.role !== 'agency') return null;

    return (
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchHeader} 
          onPress={() => setIsSearchExpanded(!isSearchExpanded)}
        >
          <View style={styles.searchTitleRow}>
            <Search size={20} stroke="#4F46E5" />
            <Text style={styles.searchTitleText}>Search Talents</Text>
          </View>
          {isSearchExpanded ? <ChevronUp size={20} stroke="#6B7280" /> : <ChevronDown size={20} stroke="#6B7280" />}
        </TouchableOpacity>

        {isSearchExpanded && (
          <View style={styles.searchBody}>
            <View style={styles.searchRow}>
              <TextInput style={[styles.searchInput, styles.halfInput]} placeholder="Height (cm)" value={searchQuery.height} onChangeText={t => setSearchQuery({...searchQuery, height: t})} placeholderTextColor="#9CA3AF" />
              <TextInput style={[styles.searchInput, styles.halfInput]} placeholder="Weight (kg)" value={searchQuery.weight} onChangeText={t => setSearchQuery({...searchQuery, weight: t})} placeholderTextColor="#9CA3AF" />
            </View>
            <TextInput style={styles.searchInput} placeholder="Skin Tone (e.g. Fair)" value={searchQuery.skintone} onChangeText={t => setSearchQuery({...searchQuery, skintone: t})} placeholderTextColor="#9CA3AF" />
            <TextInput style={styles.searchInput} placeholder="Experience keyword" value={searchQuery.experience} onChangeText={t => setSearchQuery({...searchQuery, experience: t})} placeholderTextColor="#9CA3AF" />
            <TextInput style={styles.searchInput} placeholder="Availability (e.g. Weekends)" value={searchQuery.availability} onChangeText={t => setSearchQuery({...searchQuery, availability: t})} placeholderTextColor="#9CA3AF" />
            
            <View style={styles.searchActions}>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => { setSearchQuery({height: '', weight: '', skintone: '', experience: '', availability: ''}); setSearchResults(null); }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {searchResults && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsTitle}>Search Results ({searchResults.length})</Text>
            {searchResults.length === 0 ? (
              <Text style={styles.noResultsText}>No talents match your criteria.</Text>
            ) : (
              searchResults.map(t => <UserCard key={t.id} user={t} />)
            )}
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {renderAgencyDashboard()}
      {renderTalentSearch()}
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

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
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
          <RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#4F46E5" />
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
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#111827',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  agencyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyCardName: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  subscriberCount: {
    color: '#6B7280',
    fontSize: 10,
    marginBottom: 8,
  },
  miniSubscribeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniSubscribedButton: {
    backgroundColor: '#4F46E5',
  },
  miniSubscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyAgencies: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6B7280',
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
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  dashboardContainer: {
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dashboardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  dashboardLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  searchBody: {
    marginTop: 16,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#111827',
  },
  halfInput: {
    width: '48%',
  },
  searchActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  clearButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  searchResultsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  noResultsText: {
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});
