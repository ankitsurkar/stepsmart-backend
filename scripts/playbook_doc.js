const fs = require('fs');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  AlignmentType,
  LevelFormat
} = require('docx');

// Design Tokens (Section 1)
const BLUE       = "1A6FA8";   // Primary — headers, section banners, key numbers
const LIGHT_BLUE = "D6E8F5";   // Primary tint — scenario cards, team cards, callout fills
const AMBER      = "E8930A";   // Accent — highlights, twist callouts, warnings
const LIGHT_AMBER= "FEF3D7";   // Accent tint — callout backgrounds, secondary team fills
const DARK       = "1A1A1A";   // Body text
const MID_GRAY   = "CCCCCC";   // Borders
const LIGHT_GRAY = "F5F5F5";   // Neutral fills — timeline blocks, judging/info boxes
const WHITE      = "FFFFFF";

// Helper border definitions
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

// Reusable Helper Functions (Section 3)
function cell(children, opts = {}) {
  return new TableCell({
    borders: opts.borders || noBorders,
    shading: opts.shading ? { fill: opts.shading.fill, type: ShadingType.CLEAR } : undefined,
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
      size: opts.size || 20, // points scaled to half-points in code is better, we'll pass final half-point sizes (e.g. 36 = 18pt)
      bold: opts.bold || false,
      color: opts.color || DARK,
      italics: opts.italic || false
    })]
  });
}

function spacer(size = 80) {
  return new Paragraph({ spacing: { before: 0, after: size }, children: [] });
}

function sectionHeader(text) {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [new TableRow({ children: [
      cell([para(text, { bold: true, size: 40, color: WHITE })], {
        shading: { fill: BLUE },
        width: 10080,
        margins: { top: 100, bottom: 100, left: 160, right: 160 }
      })
    ]})]
  });
}

const COMPANIES = [
  {
    key: "flipkart", name: "Flipkart", tag: "APM", color: "2874F0",
    bullets: [
      "6-page take-home case deck submission",
      "resume screening runs in parallel",
      "no public cgpa cutoff",
      "roughly 1 in 6 candidates shortlisted",
    ],
    rounds: [
      { t: "deck submission", d: "take-home case · ~1 week" },
      { t: "case interview", d: "guesstimate · 30-40 min" },
      { t: "product interview", d: "design + tech · 30-40 min" },
      { t: "hr round", d: "behavioral · 30-40 min" },
    ],
  },
  {
    key: "zomato", name: "Zomato", tag: "APM / PA", color: "E23744",
    bullets: [
      "cgpa cutoff — 7.5 and above",
      "online test — sql + aptitude, 4 problems, 1 hour",
      "cv form submission",
      "only 20-30 candidates shortlisted for interviews",
    ],
    rounds: [
      { t: "online test", d: "sql + aptitude · ~1 hr" },
      { t: "technical 1", d: "cv + sql + case · 60-90 min" },
      { t: "technical 2", d: "sql + product · 60-90 min" },
      { t: "technical 3", d: "deep dive · ~30 min" },
      { t: "hr round", d: "vibe check · ~30 min" },
    ],
  },
  {
    key: "mmt", name: "MakeMyTrip", tag: "APM", color: "F2994A",
    bullets: [
      "resume screening comes first",
      "online aptitude test",
      "product case submission — take-home",
      "no public cgpa cutoff",
    ],
    rounds: [
      { t: "resume screen", d: "shortlisting" },
      { t: "aptitude + case", d: "take-home" },
      { t: "interview 1", d: "deck defense · 60-90 min" },
      { t: "interview 2", d: "live exercise · 60-90 min" },
      { t: "hr round", d: "~30 min" },
    ],
  },
  {
    key: "groww", name: "Groww", tag: "APM", color: "5367FF",
    bullets: [
      "case prompt — product deck, 1-1.5 weeks to prepare",
      "group case format",
      "shortlist based on deck + cv",
      "cgpa not mentioned publicly",
    ],
    rounds: [
      { t: "case prompt", d: "deck prep · 1-1.5 wks" },
      { t: "case + rca", d: "discussion · ~120 min" },
      { t: "dev case", d: "product · 40-50 min" },
      { t: "detailed rca", d: "~30 min" },
      { t: "co-founder chat", d: "hr round · ~15 min" },
    ],
  },
  {
    key: "meesho", name: "Meesho", tag: "APM", color: "E2308A",
    bullets: [
      "online assessment test (product / aptitude) comes first",
      "resume screening happens after the test",
      "few rounds of interviews overall",
    ],
    rounds: [
      { t: "assessment test", d: "product + aptitude · 60-90 min" },
      { t: "case interview", d: "product case · 45-60 min" },
      { t: "deep dive", d: "execution · 45-60 min" },
      { t: "hr round", d: "~30 min" },
    ],
  },
  {
    key: "navi", name: "Navi", tag: "APM", color: "00A878",
    bullets: [
      "online aptitude test — 60 questions, 90 minutes",
      "resume shortlisted after the test",
      "no public cgpa cutoff",
      "roughly 40 candidates interviewed",
    ],
    rounds: [
      { t: "aptitude test", d: "60 qs · ~90 min" },
      { t: "pm interview", d: "sql + case · ~60 min" },
      { t: "sr. pm interview", d: "deep dive · ~60 min" },
    ],
  },
];

const OTHERS = {
  name: "Others", tag: "Various IITs", color: "4A4A4A",
  rows: [
    { name: "media.net", d: "resume + case deck" },
    { name: "unacademy", d: "resume + manager test" },
    { name: "zomato (eng/pm)", d: "coding test" },
    { name: "sprinklr", d: "case + group discussion" },
  ],
  note: "filters differ across companies — usually 2 to 4 interview rounds, mixing case, technical, and hr",
};

// Build the elements list dynamically
const children = [
  // 1. Title Block
  new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [new TableRow({ children: [
      cell([
        para("The APM Shortlisting Playbook", { bold: true, size: 56, color: WHITE, align: AlignmentType.CENTER }),
        para("How 7 companies actually filter campus candidates — before the interview starts", { size: 40, color: LIGHT_BLUE, align: AlignmentType.CENTER }),
        para("Compiled for masterclass students prepping this placement season", { size: 36, color: LIGHT_BLUE, italic: true, align: AlignmentType.CENTER })
      ], {
        shading: { fill: BLUE },
        width: 10080,
        margins: { top: 200, bottom: 200, left: 240, right: 240 }
      })
    ]})]
  }),
  
  spacer(120),
  
  // Intro Callout Box
  new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [new TableRow({ children: [
      cell([
        para("What Actually Stays With You:", { bold: true, size: 38, color: AMBER }),
        para("CGPA decides who even gets read before the case does, for some companies. For others, the case comes first and CGPA never enters the conversation at all.", { size: 36 }),
        para("Know which filter you are walking into, before you build for it.", { bold: true, italic: true, size: 36, color: DARK })
      ], {
        shading: { fill: LIGHT_AMBER },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: AMBER },
          bottom: noBorder, left: noBorder, right: noBorder
        },
        width: 10080
      })
    ]})]
  }),

  spacer(120)
];

// Add each company as a Section
COMPANIES.forEach((co) => {
  children.push(sectionHeader(`${co.name} (${co.tag})`));
  children.push(spacer(60));
  
  // Side-by-side Table layout: Left Column (Shortlisting), Right Column (Interview Rounds)
  // According to PMX style: Column widths must sum to 10080. Side-by-side table is 4920, 240 (spacer), 4920.
  children.push(
    new Table({
      width: { size: 10080, type: WidthType.DXA },
      columnWidths: [4920, 240, 4920],
      rows: [
        new TableRow({ children: [
          // Left Column: Shortlisting Criteria
          cell([
            para("Shortlisting Criteria", { bold: true, size: 36, color: BLUE }),
            spacer(20),
            ...co.bullets.map(b => para(`• ${b}`, { size: 34 }))
          ], {
            shading: { fill: LIGHT_BLUE },
            borders: thinBorders,
            width: 4920
          }),
          
          // Spacer column
          cell([], { width: 240 }),
          
          // Right Column: Interview Rounds
          cell([
            para("Interview Rounds", { bold: true, size: 36, color: AMBER }),
            spacer(20),
            ...co.rounds.map((r, idx) => para(`0${idx + 1}. ${r.t} — ${r.d}`, { size: 34 }))
          ], {
            shading: { fill: LIGHT_AMBER },
            borders: thinBorders,
            width: 4920
          })
        ]})
      ]
    })
  );
  
  children.push(spacer(120));
});

// Add "Others" section
children.push(sectionHeader(`${OTHERS.name} (${OTHERS.tag})`));
children.push(spacer(60));
children.push(
  new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [10080],
    rows: [
      new TableRow({ children: [
        cell([
          para("Summary of Other Campus Shortlists:", { bold: true, size: 36, color: BLUE }),
          spacer(20),
          ...OTHERS.rows.map(r => para(`• ${r.name}: ${r.d}`, { size: 34 })),
          spacer(40),
          para(`Note: ${OTHERS.note}`, { italic: true, size: 34, color: DARK })
        ], {
          shading: { fill: LIGHT_GRAY },
          borders: thinBorders,
          width: 10080
        })
      ]})
    ]
  })
);

children.push(spacer(120));
children.push(para("pm-x  ·  aspiring pm prep  ·  handout format", { italic: true, align: AlignmentType.CENTER, color: "888888", size: 32 }));

// Initialize document
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 240 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } // 0.75"
      }
    },
    children: children
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('APM_Shortlisting_Playbook.docx', buffer);
  console.log('Document APM_Shortlisting_Playbook.docx created successfully!');
}).catch(err => {
  console.error('Error generating document:', err);
});
