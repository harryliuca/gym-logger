import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  ActivityIndicator,
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
  sessionExerciseId?: string; // ID of the session_exercise record
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

export default function EditWorkoutScreen() {
  const { navigate, params } = useNavigation();
  const queryClient = useQueryClient();
  const sessionId = params?.sessionId;

  const [date, setDate] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the existing session
  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => workoutService.getSession(sessionId),
    enabled: !!sessionId,
  });

  // Load session data into form
  useEffect(() => {
    if (session) {
      setDate(session.session_date);
      setWorkoutCategory(session.category || '');

      const loadedExercises = session.session_exercises
        ?.sort((a: any, b: any) => a.display_order - b.display_order)
        .map((se: any) => ({
          sessionExerciseId: se.id,
          exerciseId: se.exercise_id,
          exerciseName: se.exercises?.canonical_name || 'Unknown Exercise',
          sets: se.sets.map((set: Set) => ({
            reps: set.reps.toString(),
            weight: set.weight.toString(),
          })),
        })) || [];

      setExercises(loadedExercises);
    }
  }, [session]);

  // Save workout mutation - REPLACE all exercises
  const saveWorkout = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error('Session not found');

      // Step 1: Delete all existing session_exercises
      for (const exercise of session.session_exercises || []) {
        await workoutService.deleteSessionExercise(exercise.id);
      }

      // Step 2: Update session category
      if (workoutCategory) {
        await workoutService.updateSession(session.id, {});
      }

      // Step 3: Add new exercises
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        const sets = exercise.sets
          .filter(s => s.reps && parseInt(s.reps) > 0)
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
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      navigate('dashboard');
    },
    onError: (error) => {
      console.error('Error saving workout:', error);
      setErrorMessage(`Error saving workout: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    },
  });

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

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    updated[exerciseIndex].sets.push({
      reps: lastSet.reps,
      weight: lastSet.weight,
    });
    setExercises(updated);
  };

  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    if (updated[exerciseIndex].sets.length > 1) {
      updated[exerciseIndex].sets.splice(setIndex, 1);
      setExercises(updated);
    }
  };

  const deleteExercise = (exerciseIndex: number) => {
    const updated = exercises.filter((_, index) => index !== exerciseIndex);
    setExercises(updated);
  };

  const handleSave = () => {
    if (exercises.length === 0) {
      setErrorMessage('Please keep at least one exercise in your workout');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    saveWorkout.mutate();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Session not found</Text>
        <Button onPress={() => navigate('dashboard')}>Go Back</Button>
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
            Edit Workout
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
            mode="outlined"
            style={styles.input}
            disabled
          />

          <TextInput
            label="Workout Name (e.g., Leg Day, Upper Body)"
            value={workoutCategory}
            onChangeText={setWorkoutCategory}
            mode="outlined"
            style={styles.input}
          />

          {errorMessage && (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text variant="bodyMedium" style={styles.errorText}>{errorMessage}</Text>
              </Card.Content>
            </Card>
          )}
        </Card.Content>
      </Card>

      {/* Exercises List */}
      {exercises.map((exercise, exerciseIndex) => (
        <Card key={exerciseIndex} style={styles.section}>
          <Card.Title
            title={exercise.exerciseName}
            right={(props) => (
              <IconButton
                {...props}
                icon="delete"
                iconColor="#f44336"
                onPress={() => deleteExercise(exerciseIndex)}
              />
            )}
          />
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
                  <IconButton
                    icon="close"
                    size={16}
                    onPress={() => deleteSet(exerciseIndex, setIndex)}
                    disabled={exercise.sets.length === 1}
                  />
                </View>
              ))}
              <Button
                mode="outlined"
                icon="plus"
                onPress={() => addSet(exerciseIndex)}
                style={styles.addSetButton}
                compact
              >
                Add Set
              </Button>
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
  section: {
    margin: 16,
    marginBottom: 0,
  },
  input: {
    marginBottom: 12,
  },
  errorCard: {
    marginBottom: 12,
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#C62828',
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
  addSetButton: {
    marginTop: 8,
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
