import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator, IconButton, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { profileService, workoutService, WorkoutSessionWithExercises } from '../../services/workouts';
import { useNavigation } from '../../contexts/NavigationContext';

export default function PublicProfileView() {
  const { navigate, params } = useNavigation();
  const userId = params?.userId;

  // Fetch public profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: () => profileService.getPublicProfile(userId),
    enabled: !!userId,
  });

  // Fetch user's workout sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['publicUserSessions', userId],
    queryFn: () => workoutService.getPublicUserSessions(userId),
    enabled: !!userId,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (profileLoading || sessionsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Profile not found or not public</Text>
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
            onPress={() => navigate('browsePublicProfiles')}
          />
          <Text variant="headlineMedium" style={styles.title}>
            {profile.public_username || profile.display_name || 'User Profile'}
          </Text>
        </View>
      </View>

      {/* Profile Stats */}
      <Card style={styles.section}>
        <Card.Title title="Stats Overview" />
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={styles.statValue}>
                {profile.total_sessions || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Workouts
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text variant="titleLarge" style={styles.statValue}>
                {(profile.total_volume || 0).toLocaleString()} lb
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Volume
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Workout History */}
      <Card style={styles.section}>
        <Card.Title title={`Workout History (${sessions?.length || 0})`} />
        <Card.Content>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No workouts recorded yet.
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

interface SessionCardProps {
  session: WorkoutSessionWithExercises;
}

function SessionCard({ session }: SessionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalExercises = session.session_exercises?.length || 0;
  const totalVolume = session.session_exercises?.reduce(
    (sum, ex) => sum + (ex.total_volume || 0),
    0
  ) || 0;

  return (
    <Card style={styles.sessionCard}>
      <Card.Content>
        <View style={styles.sessionHeader}>
          <View>
            <Text variant="titleMedium">{formatDate(session.session_date)}</Text>
            {session.category && (
              <Chip compact mode="outlined" style={styles.dayCategoryChip}>
                {session.category}
              </Chip>
            )}
          </View>
          <Chip compact>{totalExercises} exercises</Chip>
        </View>

        {/* Exercise list with detailed sets */}
        <View style={styles.exerciseList}>
          {session.session_exercises?.map((ex) => (
            <View key={ex.id} style={styles.exerciseBlock}>
              <Text variant="bodyMedium" style={styles.exerciseName}>
                {ex.exercises.canonical_name}
              </Text>
              <View style={styles.setsContainer}>
                {ex.sets?.map((set, idx) => (
                  <Text key={idx} variant="bodySmall" style={styles.setDetail}>
                    {set.reps} × {set.weight} lb
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sessionFooter}>
          <Text variant="bodySmall" style={styles.volumeText}>
            Total Volume: {totalVolume.toLocaleString()} lb
          </Text>
        </View>
      </Card.Content>
    </Card>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dayCategoryChip: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  exerciseList: {
    gap: 12,
    marginBottom: 12,
  },
  exerciseBlock: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exerciseName: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 15,
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  setDetail: {
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 13,
  },
  sessionFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 4,
  },
  volumeText: {
    color: '#666',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});
