import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import Platform from 'react-native';
import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationProvider({ children }){
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const [notification, setNotification] = React.useState<Notifications.Notification | undefined>(
    undefined
  );
  const { user } = useAuth();

  React.useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        Alert.alert(
          notification.request.content.title || "Notification",
          notification.request.content.subtitle || "Subtitle"
        );
        });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      });
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

 React.useEffect(() => {
  saveUserPushToken();
 }, [expoPushToken]);

  const saveUserPushToken = async () => {
    if(!user?.id || !expoPushToken){
      return;
    }
    await supabase
    .from('profiles')
    .update({ id: user.id, push_token: expoPushToken })
  }

    return children;
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }
  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log(pushTokenString);
    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}