import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import DashboardScreen from './DashboardScreen';
import HistoryScreen from '../history/HistoryScreen';
import NewWorkoutScreen from '../workout/NewWorkoutScreen';
import StatsScreen from '../stats/StatsScreen';
import BrowsePublicProfilesScreen from '../public/BrowsePublicProfilesScreen';
import PublicProfileView from '../public/PublicProfileView';

export default function HomeScreen() {
  const { currentScreen } = useNavigation();

  switch (currentScreen) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'newWorkout':
      return <NewWorkoutScreen />;
    case 'stats':
      return <StatsScreen />;
    case 'browsePublicProfiles':
      return <BrowsePublicProfilesScreen />;
    case 'publicProfile':
      return <PublicProfileView />;
    default:
      return <DashboardScreen />;
  }
}
