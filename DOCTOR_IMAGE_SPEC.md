# Doctor Image Specification

Measured on the actual homepage on 18 September 2026, at a 1000px-high browser viewport. This specification applies to the doctor authority panel, also reused on About. It does not replace or change the homepage slideshow.

## Root Cause And Fix

The source `radiance-media-raw/02-doctor/doctor-image.png` is 1122 x 1402. The previous component selected its 2400 x 1400 `heroDesktop` export, already cropped with `fit: cover`. CSS `object-contain` could not restore the lost part of the source.

The processor now makes a rotated, full-frame WebP with `fit: inside`, without enlarging or copying the original. The component uses `uncroppedUrl`, reserves a consistent 4:5 frame, centres the image, applies 4% inner padding and retains `object-contain`. The tablet's former wide 16:12 frame is removed. The outer panel is capped at 544px, giving a maximum 502px image frame after padding and borders.

## Measured Layout

| Viewport width | Image frame (CSS px) | Frame ratio | Minimum 2x frame export |
| --- | --- | --- | --- |
| 375 | 317 x 396.25 | 4:5 | 634 x 793 |
| 430 | 372 x 465 | 4:5 | 744 x 930 |
| 768 | 502 x 627.5 | 4:5 | 1004 x 1255 |
| 1024 | 377.52 x 471.89 | 4:5 | 756 x 945 |
| 1440 | 502 x 627.5 | 4:5 | 1004 x 1255 |

The actual image is slightly smaller than the frame because of the 4% padding and border. These export thresholds are conservative; the existing 1122 x 1402 image is already sufficient for 2x rendering at the largest measured frame. Do not upscale it just to meet a nominal master size.

## Source For A Future Replacement

- One portrait master is sufficient across desktop, tablet and mobile; no alternate crop is required.
- If supplying a new image, use a 1600 x 2000 master, ratio 4:5. This leaves resolution headroom beyond the measured minimum, not a new layout requirement.
- Keep the entire head, both shoulders and folded arms in the source. Keep the face centred horizontally.
- Keep at least 10-12% top breathing room: on a 1600 x 2000 master, the top of the head should be below y=200-240.
- Keep essential shoulder/arm detail inside x=128..1472 (8% side safe zone) and above y=1920 (4% bottom safe zone). These are composition guides, not CSS crop boundaries.
- Do not place text in the picture. The name and credentials remain real HTML below it.
- Upload the original locally, not to `public/`. Run `npm run process:media`.
- Current full-frame website output: `public/radiance-media-processed/uncropped/doctor-image.webp`, 1122 x 1402, 131594 bytes (about 129 KiB).
- Export pipeline ceiling: 1600 x 2000, `fit: inside`, `withoutEnlargement: true`, WebP quality 88. `next/image` supplies responsive AVIF/WebP delivery.

## Responsive Verification

Browser geometry and screenshots were checked at all five requested widths. The source head and shoulders remain in the image, aspect ratio is preserved, and document width equals viewport width. The frame has a reserved aspect ratio before lazy loading, so loading this portrait does not change its allocated height. This is a component-level layout check, not a claim of a measured whole-page CLS score.

At 1024px, the portrait is smaller because the layout has switched to two columns. At 768px it remains a centred, capped single-column portrait. A screenshot scrolled past the top of the frame is viewport clipping, not image cropping; visual checks must show the whole frame below the sticky header.
