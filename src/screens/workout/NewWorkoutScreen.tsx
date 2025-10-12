import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Chip,
  SegmentedButtons,
} from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../../services/workouts';
import { useNavigation } from '../../contexts/NavigationContext';
import { Set } from '../../types/database';

interface ExerciseSet {
  reps: string;
  weight: string;
}

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

export default function NewWorkoutScreen() {
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Day 1');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch all sessions to find the last workout for selected category
  const { data: allSessions } = useQuery({
    queryKey: ['allSessions'],
    queryFn: () => workoutService.getSessions(),
  });

  // Load last workout when category changes
  useEffect(() => {
    if (!allSessions || isLoaded) return;

    // Find the most recent workout with the selected category
    const lastWorkout = allSessions.find(session => session.category === category);

    if (lastWorkout && lastWorkout.session_exercises) {
      // Pre-fill with last workout data
      const loadedExercises = lastWorkout.session_exercises.map(ex => ({
        exerciseId: ex.exercise_id,
        exerciseName: ex.exercises.canonical_name,
        sets: ex.sets.map((set: Set) => ({
          reps: set.reps.toString(),
          weight: set.weight.toString(),
        })),
      }));
      setExercises(loadedExercises);
      setIsLoaded(true);
    }
  }, [category, allSessions, isLoaded]);

  // Save workout mutation
  const saveWorkout = useMutation({
    mutationFn: async () => {
      // Create session with category
      const session = await workoutService.createSession(date, notes, category);

      // Add exercises
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        const sets = exercise.sets
          .filter(s => s.reps && s.weight)
          .map((s, idx) => ({
            set: idx + 1,
            reps: parseInt(s.reps) || 0,
            weight: parseFloat(s.weight) || 0,
            unit: 'lb' as const,
          }));

        if (sets.length > 0) {
          await workoutService.addExerciseToSession(
            session.id,
            exercise.exerciseId,
            sets,
            i
          );
        }
      }

      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSessions'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
      navigate('dashboard');
    },
  });

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setIsLoaded(false); // Allow reloading
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleSave = () => {
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }
    saveWorkout.mutate();
  };

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
            New Workout
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saveWorkout.isPending}
          disabled={saveWorkout.isPending}
        >
          Save
        </Button>
      </View>

      {/* Workout Details */}
      <Card style={styles.section}>
        <Card.Title title="Workout Details" />
        <Card.Content>
          <TextInput
            label="Date"
            value={date}
            onChangeText={setDate}
            mode="outlined"
            style={styles.input}
          />

          {/* Day Selector */}
          <Text variant="bodyMedium" style={styles.label}>
            Workout Day
          </Text>
          <SegmentedButtons
            value={category}
            onValueChange={handleCategoryChange}
            buttons={[
              { value: 'Day 1', label: 'Day 1' },
              { value: 'Day 2', label: 'Day 2' },
              { value: 'Day 3', label: 'Day 3' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Pre-loaded Exercises */}
      {exercises.length === 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No previous workout found for {category}.
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Switch to a different day or the form will be empty to start fresh.
            </Text>
          </Card.Content>
        </Card>
      )}

      {exercises.map((exercise, exerciseIndex) => (
        <Card key={exerciseIndex} style={styles.section}>
          <Card.Title title={exercise.exerciseName} />
          <Card.Content>
            <View style={styles.exerciseBlock}>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setEditRow}>
                  <Text variant="bodySmall" style={styles.setLabel}>
                    Set {setIndex + 1}:
                  </Text>
                  <TextInput
                    value={set.reps}
                    onChangeText={(value) =>
                      updateSet(exerciseIndex, setIndex, 'reps', value)
                    }
                    keyboardType="numeric"
                    mode="outlined"
                    dense
                    style={styles.setEditInput}
                    placeholder="0"
                  />
                  <Text variant="bodySmall" style={styles.setMultiplier}>
                    ×
                  </Text>
                  <TextInput
                    value={set.weight}
                    onChangeText={(value) =>
                      updateSet(exerciseIndex, setIndex, 'weight', value)
                    }
                    keyboardType="decimal-pad"
                    mode="outlined"
                    dense
                    style={styles.setEditInput}
                    placeholder="0"
                  />
                  <Text variant="bodySmall" style={styles.unitLabel}>
                    lb
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      ))}

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
  section: {
    margin: 16,
    marginBottom: 0,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: '#666',
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
  },
  exerciseBlock: {
    gap: 8,
  },
  setEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  setLabel: {
    minWidth: 50,
    color: '#666',
  },
  setEditInput: {
    flex: 1,
    minWidth: 60,
  },
  setMultiplier: {
    color: '#666',
    paddingHorizontal: 4,
  },
  unitLabel: {
    color: '#666',
    minWidth: 20,
  },
  bottomPadding: {
    height: 32,
  },
});
