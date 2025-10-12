import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import DashboardScreen from './DashboardScreen';
import HistoryScreen from '../history/HistoryScreen';
import NewWorkoutScreen from '../workout/NewWorkoutScreen';

export default function HomeScreen() {
  const { currentScreen } = useNavigation();

  switch (currentScreen) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'newWorkout':
      return <NewWorkoutScreen />;
    default:
      return <DashboardScreen />;
  }
}
