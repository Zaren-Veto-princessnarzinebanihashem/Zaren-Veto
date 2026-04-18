# Design Brief: Zaren Veto

## Purpose & Tone
Premium dark social networking app emphasizing digital sovereignty and privacy. Elegant, refined, anti-corporate. Facebook-style profile layout with royal blue verification badges. Privacy controls front-and-center. Every surface intentional.

## Differentiation
**Metallic silver precision + royal blue verification.** Dark canvas with deliberate card hierarchy. Royal blue (#0052CC) for verification and admin identity. No biometric visuals, no forced avatars. Privacy-first with sophisticated, reserved accent colors.

## Palette

| Token | OKLCH | Usage |
| --- | --- | --- |
| Background | 0.145 0 0 | Main dark canvas |
| Foreground | 0.95 0 0 | Primary text on dark |
| Card | 0.18 0 0 | Elevated surfaces, posts |
| Primary/Accent (Metallic) | 0.8 0.15 260 | Interactive highlights, CTAs, active states |
| Royal Blue | 0.53 0.24 258 | Verification badges, admin identity, brand accent |
| Muted | 0.22 0 0 | Secondary surfaces, disabled states |
| Destructive | 0.65 0.19 22 | Delete, destructive actions, liked state |
| Border | 0.28 0 0 | Subtle dividers, input strokes |

## Typography
**Display:** Fraunces (editorial elegance, profile headers, section titles)  
**Body:** DM Sans (approachable precision, clean and readable)  
**Mono:** Geist Mono (code, technical info)

## Elevation & Depth
Card-based post layout. Progressive depth: background < card (0.18) < popover (0.22). Metallic silver glow on active interactive elements (no crude neon). Royal blue verification badge sits inline at 18×18px.

## Structural Zones

| Zone | Treatment | Intent |
| --- | --- | --- |
| Header/Nav | `bg-card` with `border-b` + notification bell icon | Anchored, intentional separation, awareness hub |
| Profile Cover | 16:9 full-width container with gradient muted background | Editorial visual hierarchy |
| Profile Picture | 120px circular, overlapped at bottom-left of cover, border-4 card color | Facebook-style depth and layout |
| Verification Badge | `verification-badge` class: 18×18px royal blue circle, white checkmark, inline next to username | Clear admin identity |
| Feed Posts | Card-based with `post-action-bar`: like (destructive on active), react (emoji), comment, share buttons | Familiar social interaction |
| Interactive Elements | `action-button` with hover state, `metallic-border` on focus, `metallic-border-active` on state | Metallic silver accent for precision |

## Spacing & Rhythm
Generous whitespace (16px base). Dense card interiors, loose gaps between sections. Rhythm through card layering, not flat backgrounds. Profile picture overlap creates visual anchor.

## Component Patterns
- **Buttons:** metallic silver or destructive; hover adds subtle bg tint
- **Posts:** card with action bar (like, react, comment, share); liked state shows destructive color
- **Profile:** Fraunces for username + inline verification badge, DM Sans for bio, circular picture overlapping cover
- **Inputs:** dark background with subtle border, focus state adds metallic glow
- **Notifications:** bell icon with red dot badge, hover reveals notification panel

## Motion
Smooth transitions (0.3s cubic-bezier) on all interactive states. No bouncy animations. Entrance: subtle fade. State changes: border/glow/color updates.

## Constraints
- No gradients. Solid OKLCH values only.
- Royal blue ONLY for verification and admin identity — not ambient.
- Metallic silver ONLY for interactive highlights and CTAs.
- All text token-based (no arbitrary colors).
- Dark mode default, no light mode.

## Signature Details
1. **Metallic glow on interactive elements.** A subtle 2-layer box-shadow (color + blur) suggesting precision and luxury.
2. **Royal blue verification badge.** Inline 18×18px solid circle with white checkmark, matching Facebook/Instagram standards.
3. **Facebook-style profile layout.** 16:9 cover photo with circular 120px profile picture overlapping at bottom-left, edit overlay on hover.
