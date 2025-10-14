import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Chip, IconButton, Portal, Dialog, TextInput } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService, WorkoutSessionWithExercises } from '../../services/workouts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAppExperience } from '../../contexts/AppExperienceContext';

type WebShareData = {
  title?: string;
  text?: string;
  url?: string;
};

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const { navigate, params } = useNavigation();
  const { guestViewingUserId, requireAuth } = useAppExperience();
  const [sessionLimit, setSessionLimit] = React.useState(3);
  const [inviteDialogVisible, setInviteDialogVisible] = React.useState(false);
  const [copyFeedback, setCopyFeedback] = React.useState('');

  // Check if viewing another user's profile
  const viewingUserId = params?.userId || guestViewingUserId;
  const isViewingOtherUser = viewingUserId && viewingUserId !== user?.id;
  const isGuestViewingInvite = !user && !!viewingUserId && viewingUserId === guestViewingUserId;

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

  const inviteLink = React.useMemo(() => {
    const baseUrl =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://gym-logger.netlify.app';
    if (user?.id) {
      return `${baseUrl}?invite=${user.id}`;
    }
    return baseUrl;
  }, [user?.id]);

  const inviteMessage = React.useMemo(() => {
    return `Join me on Gym Logger to track workouts with voice or manual entry: ${inviteLink}`;
  }, [inviteLink]);

  const handleNewWorkout = React.useCallback(() => {
    if (!user) {
      requireAuth();
      return;
    }
    navigate('newWorkout');
  }, [navigate, requireAuth, user]);

  const handleInvitePress = async () => {
    if (!user) {
      requireAuth();
      return;
    }

    const shareData: WebShareData = {
      title: 'Join me on Gym Logger',
      text: inviteMessage,
      url: inviteLink,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error: any) {
        // If user cancels share, silently ignore; otherwise fall back to dialog
        if (error?.name === 'AbortError') {
          return;
        }
        console.warn('Navigator share failed, showing invite dialog fallback.', error);
      }
    }

    setInviteDialogVisible(true);
    setCopyFeedback('');
  };

  const handleCopyInviteLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopyFeedback('Link copied!');
        setTimeout(() => setCopyFeedback(''), 2000);
        return;
      } catch (error) {
        console.warn('Clipboard write failed', error);
      }
    }

    setCopyFeedback('Copy not supported. Manually copy the link below.');
    setTimeout(() => setCopyFeedback(''), 4000);
  };

  const closeInviteDialog = () => {
    setInviteDialogVisible(false);
    setCopyFeedback('');
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
            {!isGuestViewingInvite && (
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigate('browsePublicProfiles')}
              />
            )}
            <View>
              <Text variant="headlineMedium" style={styles.title}>
                {isGuestViewingInvite ? 'Gym Logger' : 'Public Profile'}
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {isGuestViewingInvite ? 'Preview workout tracking' : 'Viewing workout history'}
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

      {/* Quick Actions */}
      {(!isViewingOtherUser || isGuestViewingInvite) && (
        <Card style={styles.section}>
          <Card.Title
            title={user ? 'Quick Actions' : 'Ready to log your own workouts?'}
          />
          <Card.Content>
            <Button
              mode="contained"
              icon="plus"
              onPress={handleNewWorkout}
              style={styles.actionButton}
            >
              {user ? 'New Workout' : 'Start Your Own Workout'}
            </Button>

            {user ? (
              <>
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
                <Button
                  mode="outlined"
                  icon="link"
                  onPress={handleCopyInviteLink}
                  style={styles.actionButton}
                >
                  Copy Invite Link
                </Button>
                <Button
                  mode="outlined"
                  icon="share-variant"
                  onPress={handleInvitePress}
                  style={styles.actionButton}
                >
                  Invite Friends
                </Button>
              </>
            ) : (
              <Button
                mode="outlined"
                icon="account-group"
                onPress={() => navigate('browsePublicProfiles')}
              >
                Explore Public Profiles
              </Button>
            )}
            {copyFeedback && !inviteDialogVisible && (
              <Text variant="bodySmall" style={styles.copyFeedback}>
                {copyFeedback}
              </Text>
            )}
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
                <SessionCard
                  key={session.id}
                  session={session}
                  isViewingOtherUser={isViewingOtherUser}
                />
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

      <Portal>
        <Dialog
          visible={inviteDialogVisible}
          onDismiss={closeInviteDialog}
        >
          <Dialog.Title>Invite Friends</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.inviteDescription}>
              Share this link so friends can sign up for Gym Logger:
            </Text>
            <TextInput
              value={inviteLink}
              mode="outlined"
              editable={false}
              style={styles.inviteLinkInput}
              selectTextOnFocus
            />
            {copyFeedback ? (
              <Text variant="bodySmall" style={styles.copyFeedback}>
                {copyFeedback}
              </Text>
            ) : null}
            <Text variant="bodySmall" style={styles.inviteHint}>
              Tip: Use the share button for quick sharing on supported browsers.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCopyInviteLink}>Copy Link</Button>
            <Button onPress={closeInviteDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

interface SessionCardProps {
  session: WorkoutSessionWithExercises;
  isViewingOtherUser?: boolean;
}

function SessionCard({ session, isViewingOtherUser }: SessionCardProps) {
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const deleteSession = useMutation({
    mutationFn: () => workoutService.deleteSession(session.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSessions'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
      setShowDeleteDialog(false);
    },
  });

  const handleEdit = () => {
    navigate('editWorkout', { sessionId: session.id });
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteSession.mutate();
  };
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
    <>
      <Card style={styles.sessionCard}>
        <Card.Content>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionHeaderLeft}>
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
            {!isViewingOtherUser && (
              <View style={styles.sessionActions}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={handleEdit}
                  style={styles.actionIcon}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  iconColor="#f44336"
                  onPress={handleDelete}
                  style={styles.actionIcon}
                />
              </View>
            )}
          </View>

        {/* Exercise list with detailed sets */}
        <View style={styles.exerciseList}>
          {session.session_exercises?.map((ex) => (
            ex.exercises ? (
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
            ) : null
          ))}
        </View>

        <View style={styles.sessionFooter}>
          <Text variant="bodySmall" style={styles.volumeText}>
            Total Volume: {totalVolume.toLocaleString()} lb
          </Text>
        </View>
      </Card.Content>
    </Card>

    <Portal>
      <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
        <Dialog.Title>Delete Workout</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to delete this workout from {formatDate(session.session_date)}? This action cannot be undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button
            onPress={confirmDelete}
            loading={deleteSession.isPending}
            textColor="#f44336"
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </>
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
  sessionHeaderLeft: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionIcon: {
    margin: 0,
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
  inviteDescription: {
    marginBottom: 12,
  },
  inviteLinkInput: {
    marginTop: 4,
  },
  copyFeedback: {
    marginTop: 6,
    color: '#2E7D32',
    fontWeight: '600',
  },
  inviteHint: {
    marginTop: 6,
    color: '#666',
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
