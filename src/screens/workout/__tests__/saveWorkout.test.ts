import { ExerciseSet, WorkoutExercise } from '../../../types/database';

// Extract the filtering/mapping logic to test
export function prepareExerciseSetsForSave(exercise: {
  sets: { reps: string; weight: string }[];
}) {
  return exercise.sets
    .filter(s => s.reps && parseInt(s.reps) > 0) // Only require reps > 0, weight can be 0
    .map((s, idx) => ({
      set: idx + 1,
      reps: parseInt(s.reps) || 0,
      weight: parseFloat(s.weight) || 0,
      unit: 'lb' as const,
    }));
}

describe('Save Workout Logic', () => {
  describe('prepareExerciseSetsForSave', () => {
    it('should save exercises with reps and weight', () => {
      const exercise = {
        sets: [
          { reps: '10', weight: '135' },
          { reps: '8', weight: '135' },
          { reps: '6', weight: '135' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 10, weight: 135, unit: 'lb' },
        { set: 2, reps: 8, weight: 135, unit: 'lb' },
        { set: 3, reps: 6, weight: 135, unit: 'lb' },
      ]);
      expect(result.length).toBe(3);
    });

    it('should save exercises with reps but no weight (empty string)', () => {
      const exercise = {
        sets: [
          { reps: '15', weight: '' },
          { reps: '12', weight: '' },
          { reps: '10', weight: '' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 15, weight: 0, unit: 'lb' },
        { set: 2, reps: 12, weight: 0, unit: 'lb' },
        { set: 3, reps: 10, weight: 0, unit: 'lb' },
      ]);
      expect(result.length).toBe(3);
    });

    it('should save exercises with reps and weight 0', () => {
      const exercise = {
        sets: [
          { reps: '20', weight: '0' },
          { reps: '20', weight: '0' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 20, weight: 0, unit: 'lb' },
        { set: 2, reps: 20, weight: 0, unit: 'lb' },
      ]);
      expect(result.length).toBe(2);
    });

    it('should filter out sets with no reps (empty string)', () => {
      const exercise = {
        sets: [
          { reps: '10', weight: '135' },
          { reps: '', weight: '135' },
          { reps: '8', weight: '135' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 10, weight: 135, unit: 'lb' },
        { set: 2, reps: 8, weight: 135, unit: 'lb' },
      ]);
      expect(result.length).toBe(2);
    });

    it('should filter out sets with reps as "0"', () => {
      const exercise = {
        sets: [
          { reps: '10', weight: '135' },
          { reps: '0', weight: '135' },
          { reps: '8', weight: '135' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      // parseInt('0') is 0, which is falsy, so it gets filtered out
      expect(result).toEqual([
        { set: 1, reps: 10, weight: 135, unit: 'lb' },
        { set: 2, reps: 8, weight: 135, unit: 'lb' },
      ]);
      expect(result.length).toBe(2);
    });

    it('should handle mixed valid and invalid sets', () => {
      const exercise = {
        sets: [
          { reps: '10', weight: '100' },
          { reps: '', weight: '' },
          { reps: '15', weight: '' },
          { reps: '0', weight: '50' },
          { reps: '12', weight: '100' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 10, weight: 100, unit: 'lb' },
        { set: 2, reps: 15, weight: 0, unit: 'lb' },
        { set: 3, reps: 12, weight: 100, unit: 'lb' },
      ]);
      expect(result.length).toBe(3);
    });

    it('should handle voice input format (string numbers with weight)', () => {
      // This simulates what comes from voice input
      const exercise = {
        sets: [
          { reps: '10', weight: '135' },
          { reps: '10', weight: '135' },
          { reps: '10', weight: '135' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 10, weight: 135, unit: 'lb' },
        { set: 2, reps: 10, weight: 135, unit: 'lb' },
        { set: 3, reps: 10, weight: 135, unit: 'lb' },
      ]);
      expect(result.length).toBe(3);
    });

    it('should handle decimal weights', () => {
      const exercise = {
        sets: [
          { reps: '10', weight: '45.5' },
          { reps: '8', weight: '50.25' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([
        { set: 1, reps: 10, weight: 45.5, unit: 'lb' },
        { set: 2, reps: 8, weight: 50.25, unit: 'lb' },
      ]);
      expect(result.length).toBe(2);
    });

    it('should return empty array if all sets have no reps', () => {
      const exercise = {
        sets: [
          { reps: '', weight: '100' },
          { reps: '0', weight: '100' },
          { reps: '', weight: '' },
        ],
      };

      const result = prepareExerciseSetsForSave(exercise);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
});
