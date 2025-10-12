import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, IconButton, Chip, Button } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../services/workouts';
import { useNavigation } from '../../contexts/NavigationContext';

export default function BrowsePublicProfilesScreen() {
  const { navigate } = useNavigation();

  // Fetch public profiles
  const { data: publicProfiles, isLoading } = useQuery({
    queryKey: ['publicProfiles'],
    queryFn: () => profileService.getPublicProfiles(),
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigate('dashboard')}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Browse Public Profiles
          </Text>
        </View>
      </View>

      {/* Description */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            Check out other users' workout progress and get inspired!
          </Text>
        </Card.Content>
      </Card>

      {/* Public Profiles List */}
      {publicProfiles && publicProfiles.length > 0 ? (
        publicProfiles.map((profile) => (
          <Card key={profile.id} style={styles.section}>
            <Card.Content>
              <View style={styles.profileHeader}>
                <View>
                  <Text variant="titleLarge" style={styles.profileName}>
                    {profile.public_username || profile.display_name || 'Anonymous User'}
                  </Text>
                  <Text variant="bodySmall" style={styles.profileSubtext}>
                    {profile.email}
                  </Text>
                </View>
                <Chip icon="earth" compact>Public</Chip>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.statValue}>
                    {profile.total_sessions || 0}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Workouts
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.statValue}>
                    {(profile.total_volume || 0).toLocaleString()} lb
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Total Volume
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text variant="bodySmall" style={styles.statValue}>
                    {formatDate(profile.last_workout_date)}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Last Workout
                  </Text>
                </View>
              </View>

              {/* View Button */}
              <Button
                mode="contained"
                onPress={() => navigate('dashboard', { userId: profile.id })}
                style={styles.viewButton}
              >
                View Workouts
              </Button>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No public profiles available yet. Be the first to share your progress!
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingLeft: 4,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  description: {
    textAlign: 'center',
    color: '#666',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileName: {
    fontWeight: 'bold',
  },
  profileSubtext: {
    color: '#666',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  viewButton: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24,
  },
  bottomPadding: {
    height: 32,
  },
});
