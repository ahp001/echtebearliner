import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function getPushToken() {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}