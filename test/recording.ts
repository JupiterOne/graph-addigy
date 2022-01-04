import {
  setupRecording,
  Recording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupAddigyRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization', 'client-secret'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => {
      redact(entry);
    },
  });
}

function redact(entry): void {
  // Redact the password that is in POST of some of the requests
  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }
}
