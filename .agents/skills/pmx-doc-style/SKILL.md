---
name: pmx-doc-style
description: >
  Apply the PM-X course document design system whenever creating any student-facing Word (.docx) document for Sanket's PM course — including activity handouts, worksheets, assignment briefs, frameworks, reference sheets, case study templates, or any printable course material. Always use this skill before writing any docx generation code for PM course documents. Triggers on: "create a handout", "make a worksheet", "build an activity brief", "student document", "course document", "printable", or any request to produce a .docx file in the context of the PM course.
---
 
# PMX Document Style Skill
 
This skill captures the exact design system, color tokens, layout rules, and language style used across all PM-X course documents. Read this before writing any docx generation code for the course.
 
---
 
## 1. Design Tokens
 
### Colors
```javascript
const BLUE       = "1A6FA8";   // Primary — headers, section banners, key numbers
const LIGHT_BLUE = "D6E8F5";   // Primary tint — scenario cards, team cards, callout fills
const AMBER      = "E8930A";   // Accent — highlights, twist callouts, warnings
const LIGHT_AMBER= "FEF3D7";   // Accent tint — callout backgrounds, secondary team fills
const DARK       = "1A1A1A";   // Body text
const MID_GRAY   = "CCCCCC";   // Borders
const LIGHT_GRAY = "F5F5F5";   // Neutral fills — timeline blocks, judging/info boxes
const WHITE      = "FFFFFF";
```
 
### Typography
- **Font**: Arial throughout (universally supported, no install required)
- **Body text**: 18–20pt, color DARK
- **Section header text**: 20pt bold, WHITE (on BLUE banner)
- **Title**: 28pt bold, WHITE (on BLUE banner)
- **Sub-title**: 22pt, light blue tint text on BLUE
- **Numbered labels (01, 02…)**: 22pt bold, BLUE
- **Supporting metadata**: 17–18pt, color `"888888"`, italic
- **Team names / emphasis labels**: 18pt bold, BLUE or AMBER depending on team
### Page Setup
```javascript
// Always A4 or US Letter explicitly — never rely on docx-js defaults
size: { width: 12240, height: 15840 },   // US Letter
margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }  // 0.75" margins
// Content width = 12240 - 2160 = 10080 DXA
```
 
---
 
## 2. Layout Components
 
All layout uses **tables**, never unicode bullets for structure, and never raw newlines (`\n`).
 
### Section Header Banner
A full-width single-row table with BLUE fill and white bold text. Used to label every major section.
 
```javascript
function sectionHeader(text) {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [new TableRow({ children: [
      cell([para(text, { bold: true, size: 20, color: WHITE })], {
        shading: { fill: BLUE, type: ShadingType.CLEAR },
        width: 10080,
        margins: { top: 100, bottom: 100, left: 160, right: 160 }
      })
    ]})]
  });
}
```
 
### Title Block
Full-width BLUE banner at the top. Three lines: TITLE (28pt bold white), subtitle (22pt light tint), metadata line (18pt muted tint). Always the first element.
 
### Scenario / Info Cards
Single-column table with LIGHT_BLUE fill and a left BLUE border (4pt top border used as left-equivalent). Used for the main scenario description, key context, or any block of explanatory text.
 
```javascript
borders: {
  top: { style: BorderStyle.SINGLE, size: 4, color: BLUE },
  bottom: noBorder, left: noBorder, right: noBorder
}
```
 
### Two-Column Team Cards
Side-by-side table with a 240 DXA spacer column in the middle. Left team = LIGHT_BLUE fill. Right team = LIGHT_AMBER fill. Both use thin borders on all sides.
 
```javascript
columnWidths: [4920, 240, 4920]  // total = 10080
```
 
### Deliverables Grid
Multi-row two-column table. Each row = one deliverable on the left + one on the right. Each cell has:
- A numbered label cell (600 DXA, LIGHT_BLUE fill, number in BLUE 22pt bold)
- A content cell (4440 DXA, white, thin borders)
Special last row (the "money" deliverable): spans full width, LIGHT_AMBER fill, AMBER number.
 
```javascript
columnWidths: [600, 4440, 600, 4440]  // total = 10080
```
 
### Twist / Warning Callout
Left-border-only accent box with LIGHT_AMBER fill and AMBER left border (4pt). Used for surprise reveals, important constraints, or creative twists.
 
```javascript
borders: {
  top: { style: BorderStyle.SINGLE, size: 4, color: AMBER },
  bottom: noBorder, left: noBorder, right: noBorder
}
// Fill: LIGHT_AMBER
```
 
### Info Boxes (Timeline / Judging / Notes)
Side-by-side LIGHT_GRAY filled boxes with thin borders. Used for supporting reference material that doesn't need to be "read" linearly.
 
### Spacer Paragraphs
```javascript
function spacer(size = 80) {
  return new Paragraph({ spacing: { before: 0, after: size }, children: [] });
}
// Use spacer(120) between major sections, spacer(60) between sub-elements
```
 
---
 
## 3. Reusable Helper Functions
 
Always define these at the top of the generation script:
 
```javascript
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
 
function cell(children, opts = {}) {
  return new TableCell({
    borders: opts.borders || noBorders,
    shading: opts.shading || undefined,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    verticalAlign: opts.va || VerticalAlign.TOP,
    margins: opts.margins || { top: 80, bottom: 80, left: 120, right: 120 },
    children
  });
}
 
function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before || 0, after: opts.after || 60 },
    numbering: opts.numbering || undefined,
    border: opts.border || undefined,
    children: [new TextRun({
      text,
      font: "Arial",
      size: opts.size || 20,
      bold: opts.bold || false,
      color: opts.color || DARK,
      italics: opts.italic || false
    })]
  });
}
 
function spacer(size = 80) {
  return new Paragraph({ spacing: { before: 0, after: size }, children: [] });
}
 
function sectionHeader(text) { /* see Section 2 */ }
```
 
---
 
## 4. Numbering Config
 
Always declare in the Document constructor. Use `LevelFormat.BULLET` — never unicode `\u2022` inline.
 
```javascript
numbering: {
  config: [{
    reference: "bullets",
    levels: [{
      level: 0, format: LevelFormat.BULLET, text: "\u2022",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 480, hanging: 240 } } }
    }]
  }]
}
```
 
---
 
## 5. Language & Tone Style Guide
 
### Voice
- **Direct, energetic, slightly provocative** — like a good coach, not a textbook
- **Second person** throughout student-facing docs ("You are...", "Your job is...", "Pick 3...")
- **Short sentences for instructions.** Longer sentences only for context/scenario setting.
- **No filler words**: never "please note", "it is important to", "in order to"
### Scenario Writing
- Open with a **single bold fact** that anchors the market (e.g., "India has 300M+ working professionals who skip breakfast.")
- Follow with a **founder character** — give them a background, a belief, and a constraint (funding, time, geography)
- End the scenario with the student's **role** and **mandate** in one sentence
### Deliverable Labels
- Use **action-noun pairs**: "Market Map", "Gap Analysis", "Comp Analysis", not "Step 1: Identify the market"
- Number them 01, 02, 03… in BLUE — the number is a visual anchor, not just a sequence
- Each deliverable gets: a title + one sentence of instruction that specifies *what* to produce, not *how* to think
### Twist / Creative Element
- Every activity should have one **unexpected constraint or reveal** — framed in the Twist Callout box
- The twist should create **divergence** between teams or between sessions, enabling a richer debrief
- Write it as a direct instruction: "Don't reveal your persona to the other team until the debrief."
### Debrief Framing
- Always end with a **single discussion question** that forces comparison across teams
- Format: *"If both of you are right — [tension] — which would you [decision]?"*
### Judging Criteria
- 4–5 items maximum
- Each criterion = **what** is being judged, not how points are awarded
- Ordered from most objective (math, data) to most subjective (insight, clarity)
---
 
## 6. Document Structure Order
 
For any activity handout, follow this section order:
 
1. **Title Block** — activity name, one-line description, time metadata
2. **The Scenario** — context card
3. **Team Assignments** — two-column team cards (if applicable)
4. **What You Must Produce** — deliverables grid
5. **Session Timeline + Judging Criteria** — side-by-side info boxes
6. **Twist Callout** — accent box
7. **Footer line** — output format instruction, italic, centered, muted
For non-activity documents (frameworks, reference sheets, assignment briefs), replace sections 3–6 with appropriate equivalents while keeping the header banner, color system, and typography consistent.
 
---
 
## 7. Critical docx-js Rules (Never Violate)
 
- Always set page size explicitly — never rely on defaults
- Never use `\n` — use separate `Paragraph` elements
- Never use unicode bullets inline — use `LevelFormat.BULLET`
- Always set `width` on both the table AND each cell (DXA only, never percentage)
- Always use `ShadingType.CLEAR` — never `ShadingType.SOLID`
- Never use tables as visual dividers — use paragraph border instead
- Column widths must sum exactly to table width
- Always validate after generation: `python scripts/office/validate.py output.docx`
---
 
## 8. Quick Checklist Before Generating
 
- [ ] Tokens defined at top of script
- [ ] Helper functions (`cell`, `para`, `spacer`, `sectionHeader`) declared
- [ ] Numbering config in Document constructor
- [ ] Page size set explicitly to US Letter (12240 × 15840), margins 1080
- [ ] All tables use DXA widths that sum correctly
- [ ] Scenario opens with a bold anchor fact
- [ ] At least one Twist Callout present
- [ ] Debrief question written
- [ ] Validated with `validate.py`
