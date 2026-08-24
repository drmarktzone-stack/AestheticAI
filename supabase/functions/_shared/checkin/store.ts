import type { CheckInRecord, ClinicAlert, SubmitCheckInRequest } from "./schema.ts";
import { detectAnomalies, maxRedFlagSeverity } from "./detectAnomalies.ts";

/** Dev / single-instance store — replace with Supabase tables in production. */
const checkIns = new Map<string, CheckInRecord>();
const alerts = new Map<string, ClinicAlert>();

export function submitCheckInRecord(input: {
  request: SubmitCheckInRequest;
  physicianId: string;
}): { checkIn: CheckInRecord; alert: ClinicAlert | null } {
  const now = new Date().toISOString();
  const redFlags = detectAnomalies({
    symptoms: input.request.symptoms,
    imageSignals: input.request.imageSignals,
  });
  const maxSeverity = maxRedFlagSeverity(redFlags);
  const hasRedFlags = redFlags.length > 0;

  const { notesEncrypted, ...symptomsWithoutNotes } = input.request.symptoms;

  const checkIn: CheckInRecord = {
    id: crypto.randomUUID(),
    patientId: input.request.patientId,
    physicianId: input.physicianId,
    photoStoragePath: input.request.photoStoragePath,
    symptomsSummary: symptomsWithoutNotes,
    notesEncrypted,
    redFlags,
    hasRedFlags,
    maxSeverity,
    checkInDay: input.request.checkInDay ?? null,
    locale: input.request.locale,
    createdAt: now,
  };

  checkIns.set(checkIn.id, checkIn);

  let alert: ClinicAlert | null = null;
  if (hasRedFlags && maxSeverity) {
    alert = {
      id: crypto.randomUUID(),
      checkInId: checkIn.id,
      patientId: checkIn.patientId,
      physicianId: input.physicianId,
      redFlags,
      maxSeverity,
      acknowledged: false,
      locale: input.request.locale,
      createdAt: now,
    };
    alerts.set(alert.id, alert);
  }

  return { checkIn, alert };
}

export function listClinicAlerts(physicianId: string): ClinicAlert[] {
  return [...alerts.values()]
    .filter((a) => a.physicianId === physicianId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function acknowledgeAlert(alertId: string, physicianId: string): ClinicAlert | null {
  const alert = alerts.get(alertId);
  if (!alert || alert.physicianId !== physicianId) return null;
  const updated = { ...alert, acknowledged: true };
  alerts.set(alertId, updated);
  return updated;
}

export function listPatientCheckIns(patientId: string): CheckInRecord[] {
  return [...checkIns.values()]
    .filter((c) => c.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
