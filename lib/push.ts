import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Platform } from "react-native";
import { db } from "./firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#C9A227",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    showBadge: true,
    sound: "default",
  });
}

export async function getPushToken() {
  if (!Device.isDevice) {
    console.log("Push: kein echtes Gerät");
    return null;
  }

  try {
    await ensureAndroidNotificationChannel();

    let permission = await Notifications.getPermissionsAsync();
    let finalStatus = permission.status;

    if (finalStatus !== "granted") {
      const request = await Notifications.requestPermissionsAsync();
      finalStatus = request.status;
    }

    if (finalStatus !== "granted") {
      console.log("Push: Berechtigung nicht erteilt");
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log("Push: projectId fehlt");
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    console.log("Push token geholt:", token);
    return token;
  } catch (error) {
    console.log("Push token error:", error);
    return null;
  }
}

export async function syncPushTokenToUser(userId: string) {
  try {
    const token = await getPushToken();

    if (!token) {
      console.log("Push: kein Token zum Speichern vorhanden");
      return null;
    }

    await setDoc(
      doc(db, "users", userId),
      {
        pushToken: token,
        pushUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("Push token in Firestore gespeichert");
    return token;
  } catch (error) {
    console.log("Push sync error:", error);
    return null;
  }
}