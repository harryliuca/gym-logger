import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Menu,
  Portal,
  Modal,
  List,
} from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutService, templateService } from '../../services/workouts';
import { useNavigation } from '../../contexts/NavigationContext';
import { Set, WorkoutTemplateWithExercises } from '../../types/database';

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
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loadedFromTemplate, setLoadedFromTemplate] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Fetch user's categories
  const { data: userCategories } = useQuery({
    queryKey: ['userCategories'],
    queryFn: () => workoutService.getUserCategories(),
  });

  // Fetch most recent workout for selected category
  const { data: recentWorkout } = useQuery({
    queryKey: ['recentWorkout', selectedCategory],
    queryFn: () => workoutService.getMostRecentWorkoutByCategory(selectedCategory),
    enabled: !!selectedCategory,
  });

  // Fetch templates for all users
  const { data: allTemplates } = useQuery({
    queryKey: ['allTemplates'],
    queryFn: () => templateService.getPublicTemplates(),
  });

  // Fetch all exercises for adding manually
  const { data: allExercises } = useQuery({
    queryKey: ['allExercises'],
    queryFn: () => workoutService.getExercises(),
  });

  // Auto-select most recent category on mount
  useEffect(() => {
    if (userCategories && userCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(userCategories[0]);
    }
  }, [userCategories, selectedCategory]);

  // Load workout data when category changes (only if not from template)
  useEffect(() => {
    if (recentWorkout && recentWorkout.session_exercises && !loadedFromTemplate) {
      loadFromRecentWorkout(recentWorkout);
    }
  }, [recentWorkout?.id]); // Only reload when workout ID changes

  // Load exercises from recent workout with actual weights/reps
  const loadFromRecentWorkout = (workout: any) => {
    const loadedExercises = workout.session_exercises
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      .map((se: any) => ({
        exerciseId: se.exercise_id,
        exerciseName: se.exercises?.canonical_name || 'Unknown Exercise',
        sets: se.sets.map((set: Set) => ({
          reps: set.reps.toString(),
          weight: set.weight.toString(),
        })),
      })) || [];

    setExercises(loadedExercises);
    setLoadedFromTemplate(false);
  };

  // Load template into form
  const loadTemplate = (template: WorkoutTemplateWithExercises) => {
    setSelectedCategory(template.name);
    setLoadedFromTemplate(true);

    const loadedExercises = template.template_exercises
      .sort((a, b) => a.display_order - b.display_order)
      .map(te => ({
        exerciseId: te.exercise_id,
        exerciseName: te.exercises?.canonical_name || 'Unknown',
        sets: Array(te.suggested_sets).fill(null).map(() => ({
          reps: te.suggested_reps_min?.toString() || '10',
          weight: '',
        })),
      }));

    setExercises(loadedExercises);
    setShowTemplateModal(false);
  };

  // Save workout mutation
  const saveWorkout = useMutation({
    mutationFn: async () => {
      const session = await workoutService.createSession(
        date,
        notes,
        selectedCategory || 'Custom'
      );

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
      queryClient.invalidateQueries({ queryKey: ['userCategories'] });
      navigate('dashboard');
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
    // Copy values from last set
    updated[exerciseIndex].sets.push({
      reps: lastSet.reps,
      weight: lastSet.weight,
    });
    setExercises(updated);
  };

  const addExercise = (exerciseId: string, exerciseName: string) => {
    const newExercise: WorkoutExercise = {
      exerciseId,
      exerciseName,
      sets: [
        { reps: '10', weight: '' },
        { reps: '10', weight: '' },
        { reps: '10', weight: '' },
      ],
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseModal(false);
    setExerciseSearch('');
  };

  const startVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        setVoiceTranscript('Processing...');

        const audioBlob = new Blob(chunks, { type: 'audio/webm' });

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];

          try {
            // Call Netlify function
            const response = await fetch('/.netlify/functions/parse-workout-voice', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audioBase64: base64Audio }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setVoiceTranscript(data.transcript);
            await processOpenAIResponse(data.exercises);
          } catch (error: any) {
            console.error('Error processing voice:', error);
            alert(`Error: ${error.message}`);
            setVoiceTranscript('');
          }
        };

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setVoiceTranscript('Recording... Tap to stop');
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      alert(`Could not access microphone: ${error.message}`);
    }
  };

  const processOpenAIResponse = async (parsedExercises: any[]) => {
    try {
      console.log('Processing OpenAI response:', parsedExercises);

      const workoutExercises: WorkoutExercise[] = [];

      for (const exercise of parsedExercises) {
        const exerciseName = exercise.name;

        // Find or create exercise
        let exerciseId = allExercises?.find(ex =>
          ex.canonical_name.toLowerCase() === exerciseName.toLowerCase()
        )?.id;

        if (!exerciseId) {
          // Create new exercise
          try {
            console.log('Creating new exercise:', exerciseName);
            const newEx = await workoutService.createExercise(exerciseName);
            exerciseId = newEx.id;
            // Invalidate exercises query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['allExercises'] });
          } catch (error) {
            console.error('Error creating exercise:', error);
            alert(`Could not create exercise "${exerciseName}": ${error}`);
            continue;
          }
        }

        // Convert sets to our format
        const sets = exercise.sets.map((set: any) => ({
          reps: set.reps?.toString() || '10',
          weight: set.weight?.toString() || '',
        }));

        workoutExercises.push({
          exerciseId,
          exerciseName,
          sets,
        });
      }

      console.log('Processed exercises:', workoutExercises);

      if (workoutExercises.length > 0) {
        setExercises([...exercises, ...workoutExercises]);
        alert(`Added ${workoutExercises.length} exercise(s) to your workout!`);
        // Clear transcript after success
        setTimeout(() => setVoiceTranscript(''), 3000);
      } else {
        alert('Could not parse workout from voice input. Please try again.');
        setVoiceTranscript('');
      }
    } catch (error) {
      console.error('Error processing OpenAI response:', error);
      alert(`Error processing workout: ${error}`);
      setVoiceTranscript('');
    }
  };

  const handleSave = () => {
    if (exercises.length === 0) {
      alert('Please add some exercises to your workout');
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

          {/* Category Selection */}
          <Text variant="bodyMedium" style={styles.label}>
            Load Workout From
          </Text>

          <View style={styles.buttonRow}>
            {userCategories && userCategories.length > 0 && (
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    icon="history"
                    onPress={() => setCategoryMenuVisible(true)}
                    style={styles.flexButton}
                  >
                    {selectedCategory || 'My Recent Workouts'}
                  </Button>
                }
              >
                {userCategories.map((category) => (
                  <Menu.Item
                    key={category}
                    onPress={() => {
                      setSelectedCategory(category);
                      setLoadedFromTemplate(false);
                      setCategoryMenuVisible(false);
                    }}
                    title={category}
                  />
                ))}
              </Menu>
            )}

            <Button
              mode="outlined"
              icon="view-list"
              onPress={() => setShowTemplateModal(true)}
              style={userCategories && userCategories.length > 0 ? styles.flexButton : styles.fullButton}
            >
              Templates
            </Button>
          </View>

          {selectedCategory && (
            <Text variant="bodySmall" style={styles.categoryHint}>
              {loadedFromTemplate
                ? `Loaded from template: "${selectedCategory}"`
                : `Loaded from your most recent "${selectedCategory}" workout`}
            </Text>
          )}

          {/* Voice Input Button */}
          <Button
            mode="contained"
            icon={isRecording ? "stop" : "microphone"}
            onPress={startVoiceInput}
            style={styles.voiceButton}
            buttonColor={isRecording ? "#f44336" : "#4CAF50"}
          >
            {isRecording ? 'Recording... Tap to Stop' : 'Voice Input Workout'}
          </Button>

          {voiceTranscript && (
            <Card style={styles.transcriptCard}>
              <Card.Content>
                <Text variant="bodySmall" style={styles.transcriptLabel}>Heard:</Text>
                <Text variant="bodyMedium">{voiceTranscript}</Text>
              </Card.Content>
            </Card>
          )}

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

      {/* Add Exercise Button */}
      {exercises.length === 0 ? (
        <Card style={styles.section}>
          <Card.Content style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No exercises added yet
            </Text>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setShowExerciseModal(true)}
              style={styles.addExerciseButton}
            >
              Add Your First Exercise
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <View style={styles.addExerciseButtonContainer}>
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => setShowExerciseModal(true)}
            style={styles.addExerciseButtonOutlined}
          >
            Add Exercise
          </Button>
        </View>
      )}

      {/* Exercises List */}
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

      {/* Template Selection Modal */}
      <Portal>
        <Modal
          visible={showTemplateModal}
          onDismiss={() => setShowTemplateModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Choose a Workout Template
          </Text>
          <ScrollView style={styles.modalScroll}>
            {allTemplates?.map((template) => (
              <List.Item
                key={template.id}
                title={template.name}
                description={`${template.category} • ${template.template_exercises?.length || 0} exercises`}
                left={(props) => <List.Icon {...props} icon="dumbbell" />}
                onPress={() => loadTemplate(template)}
                style={styles.templateItem}
              />
            ))}
          </ScrollView>
          <Button
            mode="outlined"
            onPress={() => setShowTemplateModal(false)}
            style={styles.modalCloseButton}
          >
            Cancel
          </Button>
        </Modal>

        {/* Exercise Selection Modal */}
        <Modal
          visible={showExerciseModal}
          onDismiss={() => {
            setShowExerciseModal(false);
            setExerciseSearch('');
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Add Exercise
          </Text>
          <TextInput
            label="Search exercises"
            value={exerciseSearch}
            onChangeText={setExerciseSearch}
            mode="outlined"
            style={styles.searchInput}
            autoFocus
          />
          <ScrollView style={styles.modalScroll}>
            {allExercises
              ?.filter(ex =>
                ex.canonical_name.toLowerCase().includes(exerciseSearch.toLowerCase())
              )
              .map((exercise) => (
                <List.Item
                  key={exercise.id}
                  title={exercise.canonical_name}
                  description={exercise.category || 'Exercise'}
                  left={(props) => <List.Icon {...props} icon="weight-lifter" />}
                  onPress={() => addExercise(exercise.id, exercise.canonical_name)}
                  style={styles.templateItem}
                />
              ))}
            {allExercises && allExercises.filter(ex =>
              ex.canonical_name.toLowerCase().includes(exerciseSearch.toLowerCase())
            ).length === 0 && (
              <Text style={styles.noResults}>No exercises found</Text>
            )}
          </ScrollView>
          <Button
            mode="outlined"
            onPress={() => {
              setShowExerciseModal(false);
              setExerciseSearch('');
            }}
            style={styles.modalCloseButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>

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
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  flexButton: {
    flex: 1,
  },
  fullButton: {
    width: '100%',
  },
  categoryHint: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  voiceButton: {
    marginBottom: 12,
  },
  transcriptCard: {
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
  },
  transcriptLabel: {
    color: '#666',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  addExerciseButton: {
    marginTop: 8,
  },
  addExerciseButtonContainer: {
    padding: 16,
    paddingTop: 0,
  },
  addExerciseButtonOutlined: {
    width: '100%',
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
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
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    padding: 20,
    paddingBottom: 12,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: 400,
  },
  templateItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    margin: 16,
    marginTop: 8,
  },
  bottomPadding: {
    height: 32,
  },
});
