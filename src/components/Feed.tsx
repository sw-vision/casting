import React from 'react';
import { FlatList, StyleSheet, View, Text, RefreshControl } from 'react-native';
import { Post, Requirement } from '../types';
import { PostCard } from './PostCard';
import { RequirementCard } from './RequirementCard';

interface Props {
  feedItems: (Post | Requirement)[];
  onRefresh: () => void;
  refreshing: boolean;
  subscribedAgencies?: string[];
  onSubscribe: (agencyId: string) => void;
  onUnsubscribe: (agencyId: string) => void;
}

export const Feed: React.FC<Props> = ({ 
  feedItems, 
  onRefresh, 
  refreshing, 
  subscribedAgencies = [],
  onSubscribe,
  onUnsubscribe
}) => {
  // Helper to determine if item is a Requirement
  const isRequirement = (item: any): item is Requirement => {
    return 'title' in item && 'agencyId' in item;
  };

  return (
    <FlatList
      data={feedItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if (isRequirement(item)) {
          return (
            <RequirementCard
              requirement={item}
              isSubscribed={subscribedAgencies.includes(item.agencyId)}
              onSubscribe={onSubscribe}
              onUnsubscribe={onUnsubscribe}
            />
          );
        }
        return <PostCard post={item} />;
      }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stories yet. Be the first to share!</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 100,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
});
