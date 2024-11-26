import { Platform } from "react-native";

export default function isMobile() {
  const os = Platform.OS;

  return os === "android" || os === "ios";
}
