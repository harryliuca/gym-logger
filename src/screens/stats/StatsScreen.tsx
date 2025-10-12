import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, ActivityIndicator, Chip, DataTable, IconButton } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { workoutService } from '../../services/workouts';
import { useNavigation } from '../../contexts/NavigationContext';

export default function StatsScreen() {
  const { navigate } = useNavigation();
  // Fetch volume trend data
  const { data: volumeTrend, isLoading: trendLoading } = useQuery({
    queryKey: ['volumeTrend'],
    queryFn: () => workoutService.getVolumeTrend(),
  });

  // Fetch personal records
  const { data: personalRecords, isLoading: prsLoading } = useQuery({
    queryKey: ['personalRecords'],
    queryFn: () => workoutService.getPersonalRecords(),
  });

  // Fetch workout frequency stats
  const { data: frequency, isLoading: frequencyLoading } = useQuery({
    queryKey: ['workoutFrequency'],
    queryFn: () => workoutService.getWorkoutFrequency(),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (trendLoading || prsLoading || frequencyLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Prepare chart data
  const maxVolume = Math.max(...(volumeTrend?.map(v => v.volume) || [1]));
  const recentTrend = volumeTrend?.slice(-10) || [];

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
            Statistics
          </Text>
        </View>
      </View>

      {/* Workout Frequency Stats */}
      <Card style={styles.section}>
        <Card.Title title="Workout Consistency" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {frequency?.currentStreak || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Current Streak (days)
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {frequency?.longestStreak || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Longest Streak
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {frequency?.averagePerWeek || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Avg Workouts/Week
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {frequency?.workoutDays || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Workout Days
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Volume Trend Chart */}
      {recentTrend.length > 0 && (
        <Card style={styles.section}>
          <Card.Title title="Volume Trend (Last 10 Workouts)" />
          <Card.Content>
            <View style={styles.chartContainer}>
              {recentTrend.map((item, index) => {
                const heightPercent = (item.volume / maxVolume) * 100;
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          { height: `${heightPercent}%` },
                        ]}
                      />
                    </View>
                    <Text variant="bodySmall" style={styles.barLabel}>
                      {formatDate(item.date)}
                    </Text>
                    <Text variant="bodySmall" style={styles.barValue}>
                      {Math.round(item.volume / 1000)}k
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text variant="bodySmall" style={styles.chartCaption}>
              Total volume (lb) per workout session
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Personal Records */}
      {personalRecords && personalRecords.length > 0 && (
        <Card style={styles.section}>
          <Card.Title title="Personal Records" />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Exercise</DataTable.Title>
                <DataTable.Title numeric>Max Weight</DataTable.Title>
                <DataTable.Title numeric>Max Volume</DataTable.Title>
              </DataTable.Header>

              {personalRecords.slice(0, 10).map((pr, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>
                    <View>
                      <Text variant="bodyMedium" style={styles.exerciseName}>
                        {pr.exercise}
                      </Text>
                      <Text variant="bodySmall" style={styles.prDate}>
                        {formatDate(pr.date)}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text variant="bodyMedium">{pr.maxWeight} lb</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text variant="bodyMedium">
                      {pr.maxVolume.toLocaleString()} lb
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: 150,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingVertical: 16,
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barWrapper: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    backgroundColor: '#6200ee',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
    width: 50,
  },
  barValue: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  chartCaption: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  exerciseName: {
    fontWeight: '600',
  },
  prDate: {
    color: '#999',
    marginTop: 2,
  },
  bottomPadding: {
    height: 32,
  },
});
