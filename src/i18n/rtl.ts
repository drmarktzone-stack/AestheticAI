import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { isRtlLocale, type SupportedLocale } from "@/types/translations";

const LOCALE_STORAGE_KEY = "protokol.locale";
const RTL_FLAG_KEY = "protokol.rtl_applied";

export async function getStoredLocale(): Promise<SupportedLocale | null> {
  const value = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  if (value === "en" || value === "he" || value === "ar") return value;
  return null;
}

export async function persistLocale(locale: SupportedLocale): Promise<void> {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/**
 * Applies RTL/LTR at the native layout engine level.
 * Requires app reload when direction changes — standard RN behavior.
 */
export async function applyLayoutDirection(locale: SupportedLocale): Promise<boolean> {
  const shouldRtl = isRtlLocale(locale);
  const currentlyRtl = I18nManager.isRTL;

  if (shouldRtl === currentlyRtl) {
    await AsyncStorage.setItem(RTL_FLAG_KEY, shouldRtl ? "1" : "0");
    return false;
  }

  I18nManager.allowRTL(shouldRtl);
  I18nManager.forceRTL(shouldRtl);
  await AsyncStorage.setItem(RTL_FLAG_KEY, shouldRtl ? "1" : "0");

  if (!__DEV__ && Updates.isEnabled) {
    await Updates.reloadAsync();
  }

  return true;
}

export function getWritingDirection(): "rtl" | "ltr" {
  return I18nManager.isRTL ? "rtl" : "ltr";
}

export function getFlexDirection(
  direction: "row" | "row-reverse" = "row",
): "row" | "row-reverse" {
  if (direction === "row-reverse") {
    return I18nManager.isRTL ? "row" : "row-reverse";
  }
  return I18nManager.isRTL ? "row-reverse" : "row";
}

export function getTextAlign(
  align: "start" | "end" | "center" = "start",
): "left" | "right" | "center" {
  if (align === "center") return "center";
  if (align === "start") return I18nManager.isRTL ? "right" : "left";
  return I18nManager.isRTL ? "left" : "right";
}
