import { useCallback, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Portal } from '@gorhom/portal';

import { api, getBaseUrl } from '~/utils/api';
import { generateToken } from '~/utils/token';
import { isAndroid, isIos } from '~/config/variables';
import useUserData from '~/hooks/useUserData';
import Button from '../Button';

function DEV_MENU() {
  const [isOpened, setIsOpened] = useState(false);
  const [resetting, setResetting] = useState<
    'all' | 'photos' | 'conversations' | 'idle'
  >('idle');

  const { isSignedIn } = useAuth();
  const { data, user, updateUserData } = useUserData();

  const { data: photos } = api.photo.getAll.useQuery(undefined, {
    enabled: isSignedIn,
  });
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();
  const utils = api.useContext();

  const router = useRouter();

  const resetPhotos = useCallback(async () => {
    setResetting('photos');
    await deleteAllPhotos();
    await utils.photo.invalidate();
    await updateUserData({
      token: generateToken(),
      onboarded: 'current',
    });

    router.replace('/');

    setResetting('idle');
    setIsOpened(false);
  }, [deleteAllPhotos, router, updateUserData, utils.photo]);

  const resetAll = useCallback(async () => {
    setResetting('all');
    if (photos?.length !== 0) await deleteAllPhotos();
    await utils.photo.invalidate();
    await utils.upload.invalidate();
    await user?.delete();
    // clear conversations

    router.replace('/');

    setResetting('idle');
    setIsOpened(false);
  }, [
    deleteAllPhotos,
    photos?.length,
    router,
    user,
    utils.photo,
    utils.upload,
  ]);

  return (
    <View className={`z-50 px-4 ${isAndroid ? 'mt-4' : ''}`}>
      <Button
        className="self-end border-2 border-white"
        onPress={() => {
          setIsOpened(true);
        }}>
        <Button.Text>DEV</Button.Text>
      </Button>
      {isOpened ? (
        <Portal>
          <SafeAreaView
            className={`absolute bottom-0 left-0 right-0 top-0 ${
              isIos ? '-mt-2' : 'mt-2'
            } flex bg-white px-4`}>
            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-xl">DEV Menu</Text>
                <Text>NODE_ENV: {process.env.NODE_ENV}</Text>
              </View>
              <Button
                className="self-end"
                onPress={() => {
                  setIsOpened(false);
                }}>
                <Button.Text>Close</Button.Text>
              </Button>
            </View>
            <View className="my-2"></View>
            <Text>Platform: {Platform.OS}</Text>
            <Text>API URL: {getBaseUrl()}</Text>
            <Text>
              EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:{' '}
              {process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            </Text>
            <Text>User ID: {user?.id}</Text>
            <Text>Onboarding: {data.onboarded as string}</Text>
            <Text>Gender: {data.gender as string}</Text>

            <View className="my-2"></View>

            <Button
              onPress={resetPhotos}
              disabled={!user || !photos || photos?.length === 0}
              className={
                !user || !photos || photos?.length === 0 ? 'bg-slate-700' : ''
              }>
              <Button.Text>
                {resetting === 'photos'
                  ? 'Resetting photos...'
                  : 'Reset photos'}
              </Button.Text>
            </Button>

            <View className="my-1"></View>

            <Button
              onPress={resetAll}
              disabled={!user}
              className={!user ? 'bg-slate-700' : ''}>
              <Button.Text>
                {resetting === 'all' ? 'Resetting all...' : 'Reset all'}
              </Button.Text>
            </Button>
          </SafeAreaView>
        </Portal>
      ) : null}
    </View>
  );
}

export default function DEV() {
  const { isSignedIn } = useAuth();

  return isSignedIn ? <DEV_MENU /> : null;
}
