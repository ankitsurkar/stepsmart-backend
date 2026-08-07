---
name: neobrutalism-design
description: Complete Neobrutalism design system tokens, Tailwind CSS rules, component principles, and post guidelines matching StepSmart's landing page design. Trigger when generating social media posts, blog posts, cards, banners, or UI components.
---

# Neobrutalism Design Guidelines

Guidelines for generating posts, banners, cards, and UI components matching StepSmart's landing page Neobrutalist design language.

## 1. Core Visual Philosophy

- **Physical & Tactile**: Interface elements look and feel like physical paper stickers, cutout cards, and stamped buttons placed on a clean canvas.
- **High Contrast**: Stark black strokes frame every UI element, creating clear visual boundaries.
- **Zero-Blur Hard Offsets**: Drop shadows are 100% opaque, sharp, hard-edged black boxes offset diagonally down-right. Never use soft or blurred shadows.
- **Energetic Accent Palette**: Crisp neutral white background complemented by bright highlight yellow and deep cyan-blue accents.

## 2. Design Principles & Aesthetic Rules

### Border System
- **Thick Outlines**: Use heavy black borders (`3px border-[#111111]`) on cards, buttons, banners, and major layout containers.
- **Pills & Badges**: Use crisp black borders (`2px border-[#111111]`) on micro-elements, tags, and pills.
- **Flat Corners**: Maintain sharp, rectangular corners (`rounded-none`) or subtle radii. Avoid large rounded shapes except for small circular avatars.

### Hard Box Shadow System
- **Micro Pills / Tags**: 1.5px to 2px offset solid black shadow (`shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]`).
- **Standard Cards & Buttons**: 4px offset solid black shadow (`shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]`).
- **Hero Blocks & Feature Cards**: 6px to 8px offset solid black shadow (`shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]`).

### Color Palette & Semantics
- **Ink Black (`#111111`)**: Primary text, icon strokes, card borders, and solid box shadows.
- **Primary Cyan Blue (`#0f6f8f` / `#188ab2`)**: Main call-to-action buttons, key brand highlights, and active states.
- **Highlight Yellow (`#FFF3A7` / `#FACC15`)**: Headline sticker badges, top announcement banners, and secondary accent buttons.
- **Background White (`#FFFFFF`) / Light Canvas (`#F8FAFC`)**: Base fill for cards and main page background.
- **Category Badge Colors**: Soft pastel contrast fills for tags—Mint Green (`#D1FAE5`), Sky Blue (`#E0F2FE`), Lavender (`#EDE9FE`), Coral (`#FEE2E2`).

### Typography & Headlines
- **Font**: `Plus Jakarta Sans` with heavy weights (`font-black`, `font-extrabold`, `font-bold`).
- **Signature Headline Treatment**: Enclose major title keywords inside a yellow background block (`#FFF3A7`), framed with a thick 3px black stroke, a 4px hard shadow, and a slight negative rotation (-1.5°).
- **Secondary Highlights**: Accent key terms with bold colored underlines (`underline decoration-[#188ab2] decoration-[3px]`).

### Interactive Motion & Press Effect
- **Hover State**: Elevate element upward and left (`translate-x-[-2px] translate-y-[-2px]`), expanding the hard shadow.
- **Active / Click State**: Depress element downward and right (`translate-x-[2px] translate-y-[2px]`), shrinking the hard shadow to simulate a physical push-button.

## 3. Post & Social Media Graphic Guidelines

When creating social media posts, graphics, or blog banners:

1. **Outer Frame**: Frame the entire post inside a thick 4px black border with an 8px or 10px hard offset shadow.
2. **Sticker Headline**: Apply the -1.5° rotated yellow sticker badge to the primary topic phrase.
3. **Category Badges**: Place uppercase category tags (e.g. `PM CAREER INSIGHTS`, `CASE STUDY`) at the top with 2px black borders and 2px drop shadows.
4. **Structured Content Box**: Wrap key points or takeaways in a light background container (`#F8FAFC`) bounded by a 3px black stroke.
5. **Brand Footer**: Include a dedicated footer bar featuring the StepSmart logo icon, domain name (`www.stepsmart.net`), and a primary blue CTA button.

## 4. Verification Checklist

Before publishing or rendering any post or component, verify:
- [ ] Every container, card, button, and tag has an explicit black border (`#111111`).
- [ ] All shadows are 0-blur hard offsets (no CSS blur or `shadow-md`/`shadow-lg` defaults).
- [ ] Key headline text uses the rotated yellow sticker block.
- [ ] Primary buttons use deep cyan-blue (`#0f6f8f`) with physical press states.
- [ ] Typography uses `Plus Jakarta Sans` with bold/black weights.
