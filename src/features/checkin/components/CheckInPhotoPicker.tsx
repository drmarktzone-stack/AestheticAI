import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

import { useRTL } from "@/hooks/useRTL";
import { colors } from "@/theme/colors";

interface CheckInPhotoPickerProps {
  photoUri: string | null;
  onPhotoChange: (uri: string) => void;
  disabled?: boolean;
}

export function CheckInPhotoPicker({ photoUri, onPhotoChange, disabled }: CheckInPhotoPickerProps) {
  const { t } = useTranslation();
  const { textStart } = useRTL();

  const pickPhoto = async (useCamera: boolean) => {
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          quality: 0.9,
          allowsEditing: true,
          aspect: [3, 4],
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.9,
          allowsEditing: true,
          aspect: [3, 4],
        });

    if (!result.canceled && result.assets[0]) {
      onPhotoChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { textAlign: textStart }]}>{t("checkin.photoTitle")}</Text>

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{t("checkin.photoHint")}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          style={styles.btn}
          disabled={disabled}
          onPress={() => void pickPhoto(true)}
        >
          <Text style={styles.btnText}>{t("checkin.takePhoto")}</Text>
        </Pressable>
        <Pressable
          style={styles.btnGhost}
          disabled={disabled}
          onPress={() => void pickPhoto(false)}
        >
          <Text style={styles.btnGhostText}>{t("checkin.choosePhoto")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  label: { color: colors.inkSoft, fontSize: 14, fontWeight: "600" },
  preview: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  placeholder: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.15)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  placeholderText: { color: colors.muted, fontSize: 13, paddingHorizontal: 16, textAlign: "center" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  btn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  btnText: { color: "#f4fffd", fontWeight: "600" },
  btnGhost: {
    borderWidth: 1,
    borderColor: "rgba(232,241,239,0.22)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  btnGhostText: { color: colors.inkSoft, fontWeight: "600" },
});
