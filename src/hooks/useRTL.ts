import { useMemo } from "react";
import { I18nManager } from "react-native";

import { getFlexDirection, getTextAlign, getWritingDirection } from "@/i18n/rtl";

export function useRTL() {
  return useMemo(
    () => ({
      isRTL: I18nManager.isRTL,
      writingDirection: getWritingDirection(),
      row: getFlexDirection("row"),
      rowReverse: getFlexDirection("row-reverse"),
      textStart: getTextAlign("start"),
      textEnd: getTextAlign("end"),
    }),
    // Re-compute when I18nManager.isRTL changes after reload
    [I18nManager.isRTL],
  );
}
