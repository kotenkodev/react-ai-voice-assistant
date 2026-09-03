# React AI Voice Assistant Frontend

Modern, dynamic web interface for John's AI Voice Companion built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## Key Features

- **Futuristic Cyberpunk Aesthetic**: Sleek dark theme (`#07090e`), ambient background glow nebulae, and Google Fonts *Outfit*.
- **Interactive Recording Dock**: Floating dock with a glowing orb button featuring expanding sonar rings and animated soundwave visualizers while recording.
- **Unified Event Handling**: Seamless touch and mouse recording support (`onMouseDown`/`onMouseUp` & `onTouchStart`/`onTouchEnd` with `e.preventDefault()`) ensuring no duplicate recording cycles.
- **AudioBubble Equalizer**: Custom 18-bar soundwave equalizer for each message, real-time playback progress, and exact audio duration decoding via the browser's native `AudioContext`.
- **Persistent Header Bar**: Top fixed navigation displaying John's live AI status badge and one-click conversation reset.
- **Smart Error Notification**: Floating toast alert that decodes server error responses (even from raw `ArrayBuffer` payloads) and provides actionable feedback.

---

## Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

- **`VITE_API_URL`**: Base URL of the FastAPI backend.

---

## Scripts & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Type check & build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## Component Architecture

- **`src/components/Controller.tsx`**: Main orchestration component managing message state, conversation feed scrolling, audio upload, and error alerts.
- **`src/components/Title.tsx`**: Fixed top navbar with John's identity badge and reset conversation trigger.
- **`src/components/RecordMessage.tsx`**: Voice recording orb powered by `react-media-recorder` with `stopStreamsOnStop={false}` for multi-turn conversations.
- **`src/components/RecordIcon.tsx`**: SVG microphone icon with animated ping indicator.
- **`src/components/AudioBubble.tsx`**: Glassmorphic message bubble with animated equalizer bars and play/pause controls.
