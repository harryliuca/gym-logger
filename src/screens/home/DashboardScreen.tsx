import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Chip, IconButton } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { workoutService, WorkoutSessionWithExercises } from '../../services/workouts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const { navigate, params } = useNavigation();
  const [sessionLimit, setSessionLimit] = React.useState(3);

  // Check if viewing another user's profile
  const viewingUserId = params?.userId;
  const isViewingOtherUser = viewingUserId && viewingUserId !== user?.id;

  // Fetch user stats (for current user or public user)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', viewingUserId || user?.id],
    queryFn: () =>
      viewingUserId
        ? workoutService.getUserStatsForUser(viewingUserId)
        : workoutService.getUserStats(),
    enabled: !!user || !!viewingUserId,
  });

  // Fetch recent sessions (for current user or public user)
  const { data: recentSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['recentSessions', viewingUserId || user?.id, sessionLimit],
    queryFn: () =>
      viewingUserId
        ? workoutService.getPublicUserSessions(viewingUserId).then(sessions => sessions.slice(0, sessionLimit))
        : workoutService.getRecentSessions(sessionLimit),
    enabled: !!user || !!viewingUserId,
  });

  const handleViewMore = () => {
    setSessionLimit(prev => prev + 5);
  };

  const formatDate = (dateString: string) => {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatVolume = (volume: number) => {
    return volume.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  if (statsLoading || sessionsLoading) {
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
        {isViewingOtherUser ? (
          <View style={styles.headerLeft}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigate('browsePublicProfiles')}
            />
            <View>
              <Text variant="headlineMedium" style={styles.title}>
                Public Profile
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Viewing workout history
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View>
              <Text variant="headlineMedium" style={styles.title}>
                Gym Logger
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {user?.email}
              </Text>
            </View>
            <Button mode="outlined" onPress={signOut}>
              Sign Out
            </Button>
          </>
        )}
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.statValue}>
              {stats?.totalSessions || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Workouts
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.statValue}>
              {formatVolume(stats?.totalVolume || 0)} lb
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Volume
            </Text>
          </Card.Content>
        </Card>

        {stats?.lastWorkoutDate && (
          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="titleSmall" style={styles.statValue}>
                {formatDate(stats.lastWorkoutDate)}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Last Workout
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Quick Actions - Only show for own profile */}
      {!isViewingOtherUser && (
        <Card style={styles.section}>
          <Card.Title title="Quick Actions" />
          <Card.Content>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => navigate('newWorkout')}
              style={styles.actionButton}
            >
              New Workout
            </Button>
            <Button
              mode="outlined"
              icon="chart-line"
              onPress={() => navigate('stats')}
              style={styles.actionButton}
            >
              View Statistics
            </Button>
            <Button
              mode="outlined"
              icon="account-group"
              onPress={() => navigate('browsePublicProfiles')}
            >
              Browse Public Profiles
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card style={styles.section}>
        <Card.Title title="Recent Workouts" />
        <Card.Content>
          {recentSessions && recentSessions.length > 0 ? (
            <>
              {recentSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              {stats && recentSessions.length < (stats.totalSessions || 0) && (
                <Button
                  mode="outlined"
                  onPress={handleViewMore}
                  style={styles.viewMoreButton}
                >
                  View More ({stats.totalSessions - recentSessions.length} older workouts)
                </Button>
              )}
            </>
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No workouts yet. Start logging!
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Version Info */}
      <View style={styles.versionFooter}>
        <Text variant="bodySmall" style={styles.versionText}>
          Gym Logger v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

interface SessionCardProps {
  session: WorkoutSessionWithExercises;
}

function SessionCard({ session }: SessionCardProps) {
  const formatDate = (dateString: string) => {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 100,
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  actionButton: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 24,
  },
  viewMoreButton: {
    marginTop: 16,
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
  versionFooter: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
});
