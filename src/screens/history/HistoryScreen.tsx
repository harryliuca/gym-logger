import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  ActivityIndicator,
  Chip,
  Button,
  IconButton,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { workoutService, WorkoutSessionWithExercises } from '../../services/workouts';
import { useNavigation } from '../../contexts/NavigationContext';

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { navigate } = useNavigation();

  // Fetch all sessions
  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ['allSessions'],
    queryFn: () => workoutService.getSessions(),
  });

  // Filter sessions by search query
  const filteredSessions = sessions?.filter((session) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const dateMatch = session.session_date.toLowerCase().includes(query);
    const notesMatch = session.notes?.toLowerCase().includes(query);
    const exerciseMatch = session.session_exercises?.some((ex) =>
      ex.exercises.canonical_name.toLowerCase().includes(query)
    );

    return dateMatch || notesMatch || exerciseMatch;
  });

  // Group sessions by month
  const sessionsByMonth = filteredSessions?.reduce((acc, session) => {
    const date = new Date(session.session_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        label: monthLabel,
        sessions: [],
      };
    }

    acc[monthKey].sessions.push(session);
    return acc;
  }, {} as Record<string, { label: string; sessions: WorkoutSessionWithExercises[] }>);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigate('dashboard')}
          />
          <View>
            <Text variant="headlineMedium" style={styles.title}>
              Workout History
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {sessions?.length || 0} total workouts
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by date, exercise, or notes"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Sessions List */}
      <ScrollView style={styles.scrollView}>
        {filteredSessions && filteredSessions.length > 0 ? (
          Object.entries(sessionsByMonth || {})
            .sort(([a], [b]) => b.localeCompare(a)) // Sort months descending
            .map(([monthKey, { label, sessions: monthSessions }]) => (
              <View key={monthKey} style={styles.monthSection}>
                <Text variant="titleMedium" style={styles.monthHeader}>
                  {label}
                </Text>
                {monthSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </View>
            ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              {searchQuery ? 'No workouts found matching your search' : 'No workouts yet'}
            </Text>
            {searchQuery && (
              <Button
                mode="text"
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                Clear Search
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface SessionCardProps {
  session: WorkoutSessionWithExercises;
}

function SessionCard({ session }: SessionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const totalExercises = session.session_exercises?.length || 0;
  const totalVolume = session.session_exercises?.reduce(
    (sum, ex) => sum + (ex.total_volume || 0),
    0
  ) || 0;
  const totalSets = session.session_exercises?.reduce(
    (sum, ex) => sum + (ex.sets?.length || 0),
    0
  ) || 0;

  return (
    <Card style={styles.sessionCard} mode="outlined">
      <Card.Content>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionHeaderLeft}>
            <Text variant="titleMedium" style={styles.sessionDate}>
              {formatDate(session.session_date)}
            </Text>
            <Text variant="bodySmall" style={styles.sessionDateFull}>
              {new Date(session.session_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            {session.category && (
              <Chip compact mode="outlined" style={styles.categoryChip}>
                {session.category}
              </Chip>
            )}
          </View>
          <View style={styles.chipContainer}>
            <Chip compact icon="dumbbell">
              {totalExercises}
            </Chip>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Sets
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {totalSets}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Volume
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {totalVolume.toLocaleString()} lb
            </Text>
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.exerciseList}>
          {session.session_exercises?.map((ex) => (
            <View key={ex.id} style={styles.exerciseRow}>
              <Text variant="bodyMedium" style={styles.exerciseName}>
                {ex.exercises.canonical_name}
              </Text>
              <Text variant="bodySmall" style={styles.exerciseDetail}>
                {ex.sets?.length || 0} × {ex.total_reps || 0} reps
              </Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        {session.notes && (
          <View style={styles.notesContainer}>
            <Text variant="bodySmall" style={styles.notesText}>
              {session.notes}
            </Text>
          </View>
        )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#e3f2fd',
    marginTop: 8,
  },
  sessionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionHeaderLeft: {
    flex: 1,
  },
  sessionDate: {
    fontWeight: 'bold',
  },
  sessionDateFull: {
    color: '#666',
    marginTop: 2,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  exerciseList: {
    gap: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  exerciseName: {
    flex: 1,
    fontWeight: '500',
  },
  exerciseDetail: {
    color: '#666',
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notesText: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 16,
  },
});
