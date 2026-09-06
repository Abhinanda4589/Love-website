# 17 Months of Us — For My Love ❤️

A cinematic, atmospheric, interactive anniversary experience made by Dudu for Saisha (Bubu).

---

## 🌟 Quick Start

Simply double-click `index.html` to open the site directly in any web browser (Chrome, Safari, Edge, Firefox). No build tools, servers, or terminal commands are required!

---

## 🎵 Adding Background Music

The site looks for your song at:
`assets/music/oda-lage.mp3`

1. Place your MP3 file in `assets/music/` and rename it to `oda-lage.mp3`.
2. When the site starts, the music will automatically fade in with volume ducking and boost appropriately during Chapter 09 (Oda Lage).
3. If no music file is present, the website still functions flawlessly without errors!

---

## 📸 Adding Your Photos & Videos

Every memory card has a styled placeholder ready to hold your real memories. To replace placeholders with your actual photos or videos, simply add an `<img>` or `<video>` tag inside the corresponding `.memory-card__placeholder` in `index.html`:

### For Images:
```html
<div class="memory-card__placeholder">
  <img src="assets/relationship/our-photo.jpg" alt="Our memory">
</div>
```

### For Videos:
```html
<div class="memory-card__placeholder">
  <video src="assets/videos/birthday-video.mp4" controls autoplay muted loop playsinline></video>
</div>
```

### Media Folder Guide:
- `assets/music/` → `oda-lage.mp3`
- `assets/early-days/` → Kiss Kiss screenshots & first conversations (Chapters 01 & 02)
- `assets/sworn-siblings/` → Sworn brother memories (Chapter 01)
- `assets/relationship/` → April 5, 2025 & relationship photos (Chapter 08)
- `assets/birthdays/` → Photos of birthday letters, stories & cakes (Chapters 14, 15, 16)
- `assets/gifts/` → Photo frame & LED glass keepsake photos (Chapter 14)
- `assets/videos/` → Birthday video edits (Chapters 15 & 16)
- `assets/future/` → Locked future memories (Chapter 23)

---

## ✍️ Editing the Story Text

All story text is stored cleanly in two locations for maximum convenience:
1. `index.html`: The full rendered markup of each chapter.
2. `js/content.js`: The pure structured story content data dictionary.

Feel free to customize any sentence, inside joke, or memory!

---

## 🎮 Interactive Features & Easter Eggs

1. **Tap-to-Unlock Key** (Opening): Tap the glowing key to trigger the metallic unlock animation, or click "Just unlock it ♡".
2. **Headphones Audio Onboarding**: Prompts her to put on headphones before beginning the journey.
3. **Interactive Snowflakes** (Chapter 07): Tap the falling snowflakes on screen to dissolve them into floating romantic words ("Love", "April 5", "Dudu", "Bubu").
4. **Interactive Sworn Brother Card** (Chapter 01): Tap the application card to stamp it "LIFETIME APPROVED ❤️".
5. **Medicine Reminder Popup** (Chapter 12): Interactive dialog asking "Did you take your medicine?" with custom celebratory responses.
6. **Apology Burning Cards** (Chapter 18): Tap each regret card to watch it dissolve with ember sparks and reveal sincere promises beneath.
7. **Future Memory Locks** (Chapter 23): Tap the locked future photo frames to reveal hidden romantic notes.
8. **Secret Confession Modal**: Tap the ❤️ symbol 5 times anywhere to unlock Dudu's hidden secret confession ("BACCHA") and claim a real hug!
9. **Nickname Recreations**: Tap "Dudu" (or Nunnu) 3 times for a funny dignity alert, and tap "Bubu" (or Chutu) 3 times for sparkle mode.

---

Made with all my heart for Bubu. Happy 17 Months! ❤️
