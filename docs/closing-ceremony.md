# Closing ceremony

Open `/closing` for the 33-slide bilingual presentation. The camera starts at the bottom of the website landscape and rises to Parliament. `/closing-timer` uses the same 10-minute timer and fully preloaded recap as the opening ceremony, then hands control to `/closing#closing`. The recap is the existing `hthrecap_2.mp4`, not new footage from this weekend.

## Presenting

- Up or Right advances; Down or Left goes back. Slide navigation uses arrow keys only, with no on-screen arrows or scroll navigation. F toggles fullscreen.
- Awards have two beats: drumroll, then result. Going back restores the previous result. Deep links use `/closing#foss` and `/closing#foss/winner`.
- Revealing an award fires confetti: side cannons, streamers, stars, fountains, or rain. Podium placements use bronze, silver, and gold, with three volleys for first place. Effects finish within five seconds, clear on navigation, and respect reduced motion. Backtracking and direct winner links do not fire; hide and reveal a result again to replay.
- Winner names appear on a contrasting bar that wipes across the drumroll, revealing the bar and name together. The two layers share their layout space so the slide stays still; reduced motion makes the reveal immediate. Names use 104–112px type, with 86px for long names.
- Simple confetti motifs mix with ordinary paper: Gemini sparks, MathemaTech math symbols, FOSS brackets, UI/UX pointers, hardware lightning bolts, ElevenLabs twin bars, and Solana bars. Other awards keep classic confetti. The Gemini spark uses a simplified silhouette and the [Google color treatment](https://blog.google/company-news/inside-google/company-announcements/gradient-g-logo-design/); no detailed logos or wordmarks are shrunk into particles.
- On the timer, + or = adds a minute; - removes a minute. Reload resets it. If sound autoplay is blocked, use Play recap or Enter.

## Results to supply

The winner bar shows one project title with team member names beneath it; this part is not bilingual. Confetti draws above the entire slide, including the winner bar. The reminder signposts sit behind the existing foreground bushes. CTN has only its bilingual header and QR code.

The signs rise after the landscape settles. Their foliage occlusion uses an alpha mask of the existing bush artwork, so no second red foreground moves with the slide. Reduced motion skips the rise.

Edit `src/components/Presentation/closingWinners.ts`. Each award has a `winner` project title and `members` string. Leave them empty until confirmed. Until populated, reveals explicitly say “Winner to be announced”; no old results have been reused. Main tracks run third, second, first. There are 21 award slots: nine main-track placements, five local mini-challenges, and seven further MLH awards. The ElevenLabs sponsor and MLH awards are combined into one slot, as the current rules specify.

The CTN QR points to the public community Linktree linked from the CTN website, not a verified recruiting application. Replace `closingLinks.ctn` and regenerate `ctn-qr.png` together when a dedicated form is supplied.

## Sources checked September 27, 2026

- [Current Devpost prize list](https://hack-the-hill-iii.devpost.com/): CGI, Civic Technology, General ($500 / $300 / $200 each); FOSS, UI/UX, Hardware, MathemaTech ($200 each); combined ElevenLabs award; Gemini API, Solana, Tiger Data, Presage, Vultr, Auth0, GoDaddy Registry. General first also receives three months of ElevenLabs Pro per member. The live page changed during research; the newer list with separate main-track placements and the combined ElevenLabs award is used.
- [Challenge resources](https://tracker.hackthehill.com/resources): official resource destination linked by Devpost.
- [CTN](https://ctn-rtc.org/) links its join invitation to [the community Linktree](https://linktr.ee/hackthehill). No specific current recruitment application was verified.
- [Stupid Ideas Hackathon Ottawa F26](https://stupideas-ottawa-f26.devpost.com/) supplied the initial event reference. The revised slide says only Ottawa / November and links its QR to the user-supplied [@stupideas_com](https://www.instagram.com/stupideas_com/) account.
- Both organizer-supplied closing PDFs were reviewed for sequence, bilingual award layouts, acknowledgements and departure reminders. Their older winners, statistics, dates, travel deadlines and QR destinations are not current ceremony facts.
- Sponsor and collaborator logos come from the repository's `sponsorData.ts`; MLH uses the existing opening-presentation logo. No substitute brand marks were generated.

The room cleanup, belongings, hardware/ID, prominent CTN recruitment and Stupid Ideas aside come from the current request. The PDFs are reference material, not additional instructions.

## Validation

`npm run test:e2e -- tests/e2e/closing.spec.ts tests/e2e/timer.spec.ts` checks upward navigation, reversible reveals, all slides' content bounds and loaded assets, timer handoff, and opening-timer compatibility. Run `npm run lint` and `npm run typecheck` as well.

## Artwork and contrast

The closing and opening decks share `PresentationAnchor.tsx`, including the original anchor placement, sway and chain animation. Logos sit on the existing snowbank artwork. Camera stops are composed on clear water, ice and foliage rather than evenly spaced; underwater text reserves the right side for the anchor, ice uses dark lettering, and no gradient overlay dims the landscape.

The ending is sponsors, collaborators, three departure-reminder signs (cleanup, belongings, hardware/ID), the white Stupid Ideas intro and event card, a CTN header and QR, and the Hack the Hill logo over Parliament with no extra text. The reminder signs use a second advance to flip to French; `/fr` deep links select that face. Old `#belongings` and `#return-hardware` links open `#clean-up`; old `#thank-you` links open `#closing-logo`.

## Stupid Ideas intro

The user supplied `roomclean.png`, `takehome.png`, `return.png`, `spob.png`, and `prick.png`. Copies live in `public/art/presentation/closing/`; the original images remain untouched. The character silhouettes are a browser SVG filter, not modified source artwork.

Audio source: [Richard Strauss - Also Sprach Zarathustra / 2001 Space Odyssey opening theme](https://www.youtube.com/watch?v=SLuW-GBaJ8k), uploaded by schmobot. Downloaded using yt-dlp with Node and the M4A audio format, then trimmed from 00:18 to 00:38. The final `zarathustra-intro.m4a` is 20 seconds, AAC stereo at 48 kHz, with a one-second fade-in and three-second fade-out. It passed ffprobe and a full FFmpeg decode with `-xerror`.

`StupidIdeas.tsx` follows the audio playhead so buffering cannot desynchronize the visuals. At 0.5–2.5 seconds Spob enters from the right, at 4.5–6.5 seconds Prick enters from the left, and at 8–11 seconds both arrive together as black silhouettes. At the first big orchestral hit (12–14 seconds), the artwork gains colour and the Instagram card appears. The music fades out at 17–20 seconds; the event card remains on screen.

Right/Up skips the intro to the event card; the next advance goes to CTN. Leaving pauses and resets the audio; returning replays the intro. If the browser blocks autoplay, Right/Up or the Play intro button starts it. Reduced motion keeps the timed cues and audio but skips the entrance movement. The audio file is preloaded by the deck.

To reproduce the audio in a scratch directory:

```powershell
yt-dlp --js-runtimes node --no-playlist -f 'bestaudio[ext=m4a]' -o 'zarathustra.%(ext)s' 'https://www.youtube.com/watch?v=SLuW-GBaJ8k'
ffmpeg -ss 18 -i zarathustra.m4a -t 20 -af 'afade=t=in:st=0:d=1,afade=t=out:st=17:d=3' -c:a aac -b:a 192k -ar 48000 -movflags +faststart zarathustra-intro.m4a
ffmpeg -v error -xerror -i zarathustra-intro.m4a -f null NUL
```
