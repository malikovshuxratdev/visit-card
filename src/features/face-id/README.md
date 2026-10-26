# face-id

Step 2 — webcam capture and face verification.

| Path | Purpose |
|---|---|
| `pages/CameraPage.tsx` | `/camera/:id?` — live view → countdown → preview → submit. With `:id` (PNFL from Science ID) it verifies; without it, it recognizes by face only. Texts come from `pages.camera.verify.*` / `pages.camera.recognize.*`. |
| `components/CameraViewport.tsx` | Mirrored square video, circular guide (idle / adjust / aligned), countdown badge. |
| `components/CapturePreview.tsx` | Captured photo with Cancel / Retake / Confirm. |
| `hooks/useCamera.ts` | Owns the `MediaStream` (640×480, front camera); maps errors to `denied`, `not-found`, `unsupported`, `unavailable`; always stops tracks. |
| `hooks/useFaceDetection.ts` | MediaPipe BlazeFace (CDN) every 120 ms; reports detected / aligned / face count / score; fires `onAlignedAndReady` after 6 aligned frames. |
| `hooks/useFaceIdMutation.ts` | `useVerifyFaceMutation` (`POST /verify_face`, with PNFL) and `useRecognizeFaceMutation` (`POST /recognize_face`, face only). Success → `/generator/:pnfl`. |
| `api/faceIdApi.ts`, `types/` | Multipart requests and response types. |

Behaviour
- **Auto capture:** face centred and sized correctly for 6 frames → 3 s countdown → photo. Cancelled if the face leaves the guide.
- **Manual capture:** button starts a 3 s countdown that always completes — works even if the model failed to load.
- Photo: centre-square crop, 480×480 JPEG (quality 0.95), not mirrored; the preview is mirrored only visually.
- Alignment thresholds are relative to the 640×480 frame — re-tune them if the resolution changes.
