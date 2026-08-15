# EconTalks Studio

`EconTalks-Studio.exe` is a portable Windows podcast-video generator. It includes its own Chromium renderer and FFmpeg encoder; Node.js and Python are not required.

## Use

1. Double-click `EconTalks-Studio.exe`.
2. Enter the podcast title.
3. Choose the podcast audio and word-timed transcript JSON.
4. Add as many speakers as required. For each one, enter the transcript speaker ID, display name, and portrait.
5. Keep the speaker rows in the vertical order you want in the video.
6. Choose an output `.mp4` and select **Generate video**.

The app produces a 1280×720, 30 fps H.264/AAC MP4. It automatically adds the title screen, ThinkEconomics branding, randomized speaker connection sequence, recorded connection SFX, word-level transcript reveals, active-speaker portrait movement, green active border, and Teenage Works transcription credit.

## Transcript formats

The app accepts:

- Deepgram JSON with `results.channels[0].alternatives[0].words`
- Deepgram JSON containing `utterances`
- Normalized JSON containing `segments`, where every segment has `speaker`, `start`, `end`, and a `words` array

Speaker IDs in the app must match the numeric speaker IDs in the transcript.

## Connection sound

The recorded connection cue is a shortened Mixkit technology-notification sound, provided under the Mixkit Sound Effects Free License:
https://assets.mixkit.co/active_storage/sfx/3123/3123-preview.mp3

## Build verification

- Standalone EXE size: 113,580,436 bytes
- SHA-256: `DA50519C1DE31077893FD26C7753595EC4C76B1D39E2000C5E330E5E30D48362`
- End-to-end sample export: 33.23 seconds, 1280×720, 30 fps, H.264 video and stereo AAC audio
