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
      size: opts.size || 20, // 20pt size by default, note: docx-js size is in half-points. 20pt = 40. Wait, the skill says: 'Body text: 18-20pt' and 'size: opts.size || 20' in the template. Let's use the exact values from the template where size is 20, meaning 10pt? Or is size in half-points (so size: 36 to 40)? Let's look at sectionHeader text: size: 20 is given in the skill: cell([para(text, { bold: true, size: 20, color: WHITE })]). This means the skill's helper function parameter "size" is in points, or it maps directly to docx-js. In docx-js, TextRun size is in half-points, so if they pass 20, it is 10pt. Let's keep the helper para size matching the skill's helper exactly, but check if we need to scale it or just use the number directly. Wait, the skill says "Body text: 18-20pt", "Section header text: 20pt bold", "Title: 28pt bold", "Sub-title: 22pt". If docx-js TextRun size uses half-points, 18-20pt is 36-40. But the skill's code says "size: opts.size || 20" and "cell([para(text, { bold: true, size: 20, color: WHITE })])". If we want it to look correct, let's use the point sizes multiplied by 2 for the size option in docx-js TextRun, or just keep them exactly as requested if the skill implies they are in half-points/points. Let's multiply the point sizes by 2 to get the actual pt size in Word since docx-js size is in half-points (e.g. 36 = 18pt). Let's check: "Title: 28pt bold" -> size: 56. "Sub-title: 22pt" -> size: 44. "Section header: 20pt bold" -> size: 40. "Body text: 18-20pt" -> size: 36 to 40. Let's design our helper to multiply size by 2 if it's passed in points, or just specify it in half-points directly! Let's specify it in half-points: Title size = 56, Sub-title size = 44, Section Header = 40, Label = 44, Body = 36 or 38. That is extremely safe and matches docx-js spec.
      bold: opts.bold || false,
      color: opts.color || DARK,
      italics: opts.italic || false
    })]
  });
}

function paraMultiple(runs, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before || 0, after: opts.after || 60 },
    children: runs.map(r => new TextRun({
      text: r.text,
      font: "Arial",
      size: r.size || opts.size || 36, // default body size 18pt (36 half-points)
      bold: r.bold || false,
      color: r.color || opts.color || DARK,
      italics: r.italic || false
    }))
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
      cell([para(text, { bold: true, size: 40, color: WHITE })], { // 20pt bold = 40 half-points
        shading: { fill: BLUE },
        width: 10080,
        margins: { top: 100, bottom: 100, left: 160, right: 160 }
      })
    ]})]
  });
}

// Generate the Document
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
    children: [
      // 1. TITLE BLOCK (Full-width BLUE banner)
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [new TableRow({ children: [
          cell([
            para("Recap — From User to Hypothesis", { bold: true, size: 56, color: WHITE, align: AlignmentType.CENTER }),
            para("BookMyShow — The Superfan Problem", { size: 44, color: LIGHT_BLUE, align: AlignmentType.CENTER }),
            para("Duration: 90 minutes | Format: Pairs | Output: One hypothesis per pair", { size: 36, color: LIGHT_BLUE, italic: true, align: AlignmentType.CENTER })
          ], {
            shading: { fill: BLUE },
            width: 10080,
            margins: { top: 200, bottom: 200, left: 240, right: 240 }
          })
        ]})]
      }),
      
      spacer(120),

      // 2. THE SCENARIO (Context Card)
      sectionHeader("01. The Scenario"),
      spacer(60),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [new TableRow({ children: [
          cell([
            para("BookMyShow (BMS) dominates the Indian entertainment ticketing space with a 55% movie market share and 78% live events share, posting a ₹85 Cr profit last year.", { bold: true, size: 38 }),
            para("The recent Coldplay concert sale exposed critical friction points: 13 million simultaneous login attempts, tickets sold out in 15 minutes, queue numbers in the lakhs, and a massive secondary scalping market where tickets resold for 10x face value. Meanwhile, Zomato District is entering the market with 58 million active food/commerce users, robust surge tech, and Blinkit hyper-local distribution network.", { size: 36 }),
            para("Business Mandate: Sustaining market share and booking conversion in the face of aggressive new entrants.", { bold: true, size: 36 }),
            
            spacer(40),
            para("Your Priority Segment: Occasional Fans", { bold: true, size: 38, color: BLUE }),
            para("Users who attend 2–4 high-demand events per year, booking in groups of 2–4. They are willing to pay face value but highly sensitive to transaction inconvenience and queues.", { size: 36 }),
            
            spacer(40),
            para("Key Segment Breakdown & Economic Exposure:", { bold: true, size: 36 }),
            new Table({
              width: { size: 9800, type: WidthType.DXA },
              columnWidths: [2200, 1200, 1600, 1600, 1600, 1600],
              rows: [
                new TableRow({ children: [
                  cell([para("Segment", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("Users", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("Events/Yr", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("Avg Ticket", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("Revenue", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("At Risk", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders })
                ]}),
                new TableRow({ children: [
                  cell([para("Extreme Enthusiasts", { size: 32 })], { borders: thinBorders }),
                  cell([para("2 Mn", { size: 32 })], { borders: thinBorders }),
                  cell([para("4", { size: 32 })], { borders: thinBorders }),
                  cell([para("₹1,500", { size: 32 })], { borders: thinBorders }),
                  cell([para("₹118.5 Cr", { size: 32 })], { borders: thinBorders }),
                  cell([para("₹4.5 Cr (5%)", { size: 32 })], { borders: thinBorders })
                ]}),
                new TableRow({ children: [
                  cell([para("Occasional Fans", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("3 Mn", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("2", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("₹1,200", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("₹71.1 Cr", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
                  cell([para("₹6.3 Cr (10%)", { bold: true, size: 32 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders })
                ]}),
                new TableRow({ children: [
                  cell([para("Casual Fans", { size: 32 })], { borders: thinBorders }),
                  cell([para("5 Mn", { size: 32 })], { borders: thinBorders }),
                  cell([para("1", { size: 32 })], { borders: thinBorders }),
                  cell([para("₹948", { size: 32 })], { borders: thinBorders }),
                  cell([para("₹47.4 Cr", { size: 32 })], { borders: thinBorders }),
                  cell([para("₹7.2 Cr (15%)", { size: 32 })], { borders: thinBorders })
                ]})
              ]
            }),

            spacer(40),
            para("KPI Connection & Flow Metric:", { bold: true, size: 36 }),
            para("Market Share = BMS Revenue / Total Revenue", { italic: true, size: 34 }),
            para("Ticket Sales Revenue = Active Users × Events Booked per User × Avg Ticket Value", { italic: true, size: 34 }),
            para("Events Booked per User = Sessions × Booking Conversion Rate", { italic: true, size: 34 }),
            para("Booking Conversion Rate = % who attempt × % who successfully complete", { italic: true, size: 34 }),
            para("Occasional Fans directly impact Booking Conversion Rate—specifically the '% who successfully complete' node.", { bold: true, size: 34, color: BLUE }),

            spacer(40),
            para("Research & Discovery Findings:", { bold: true, size: 36 }),
            para("• Survey Data (49 participants): 70% book in groups of 2-4 using phone + laptop simultaneously. Top pain points: Slow loading (59%), App crashes (55%), Bots/scalping (38%), Low seat visibility (40%), No information when things go wrong (40%), No queue notifications (27%). 43% prefer Paytm Insider for faster checkout.", { size: 34 }),
            para("• User Interviews (6 users): Apple users had higher success rates. Users booked with multiple devices. Instructions changed right before login. There was no notice to exit queue after sellout. Logins took 10-30 min, and queue wait times ranged between 50-90 min.", { size: 34 })
          ], {
            shading: { fill: LIGHT_BLUE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: BLUE },
              bottom: noBorder, left: noBorder, right: noBorder
            },
            width: 10080
          })
        ]})]
      }),

      spacer(120),

      // 3. STEP 1 - PERSONA
      sectionHeader("Step 1 — Persona (15 min)"),
      spacer(60),
      para("A persona is a named, specific representation of your segment. Complete the empty fields below to define Dheera's profile based strictly on the provided research context.", { size: 36 }),
      spacer(40),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [2500, 7580],
        rows: [
          new TableRow({ children: [
            cell([para("Section", { bold: true, size: 36, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Your Answer (Complete based on guidelines)", { bold: true, size: 36, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Demographics\n(Given)", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("Name: Dheera, Age 27\nTier 1 City, Working Professional, Income: ₹10L/year\niPhone user, books in groups of 2-4, 2-4 events per year.", { size: 34 })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Behaviors", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("[Enter behaviors here: must cover three windows — before presale, during booking attempt, and 60 seconds after failure]", { size: 34, color: "888888", italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Needs", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("[Enter core needs here: must address underlying human need, not feature request or 'buy ticket']", { size: 34, color: "888888", italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Pain Points", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("[Enter pain points here: must follow format: [specific moment] → [emotion] → [immediate next action]]", { size: 34, color: "888888", italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("One Quote", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("[Enter Quote: must be in Dheera's voice describing this to a friend, not a formal complaint]", { size: 34, color: "888888", italic: true })], { borders: thinBorders })
          ]})
        ]
      }),

      spacer(120),

      // 4. STEP 2 - JTBD
      sectionHeader("Step 2 — JTBD (10 min)"),
      spacer(60),
      para("Define the Jobs-To-Be-Done (JTBD) using the template below to capture what Dheera hires BMS to do, where BMS fails, and the resulting gap.", { size: 36 }),
      spacer(40),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [
          new TableRow({ children: [
            cell([
              para("When [specific situation / trigger],", { size: 36, bold: true }),
              para("I want to [specific motivation],", { size: 36, bold: true }),
              para("So I can [expected outcome].", { size: 36, bold: true }),
              spacer(40),
              para("But BMS currently gives me [current reality],", { size: 36, bold: true, color: AMBER }),
              para("So I end up [actual outcome].", { size: 36, bold: true, color: AMBER }),
              spacer(40),
              para("Write one gap statement:", { bold: true, size: 36, color: BLUE }),
              para("\"BMS fails to deliver __________________________________ which is the only thing Dheera is hiring it to do.\"", { size: 34, italic: true })
            ], {
              shading: { fill: LIGHT_GRAY },
              borders: thinBorders,
              width: 10080
            })
          ]})
        ]
      }),

      spacer(120),

      // 5. STEP 3 - CUSTOMER JOURNEY MAP
      sectionHeader("Step 3 — Customer Journey Map (20 min)"),
      spacer(60),
      para("Map out Dheera's full experience across time. Complete the missing phases (Booking, Post-Booking Got Ticket, Post-Booking No Ticket) based on the guidelines.", { size: 36 }),
      spacer(40),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [1400, 1400, 1400, 1600, 1400, 1400, 1480],
        rows: [
          new TableRow({ children: [
            cell([para("Phase", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Steps", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Goals", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Activities", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Emotions", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Thoughts", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Touchpoints", { bold: true, size: 30, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Awareness", { size: 28, bold: true })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("Hears about Coldplay", { size: 28 })], { borders: thinBorders }),
            cell([para("Quick discovery", { size: 28 })], { borders: thinBorders }),
            cell([para("Discusses with friends, social media", { size: 28 })], { borders: thinBorders }),
            cell([para("😊 Excited", { size: 28 })], { borders: thinBorders }),
            cell([para("\"Who should I go with?\"", { size: 28 })], { borders: thinBorders }),
            cell([para("Insta, WA, Twitter", { size: 28 })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Consideration", { size: 28, bold: true })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("Reviews event details", { size: 28 })], { borders: thinBorders }),
            cell([para("Complete info, best seat", { size: 28 })], { borders: thinBorders }),
            cell([para("Reviews dates, venues, prices", { size: 28 })], { borders: thinBorders }),
            cell([para("😐 Uncertain", { size: 28 })], { borders: thinBorders }),
            cell([para("\"Is venue nearby? Seat view?\"", { size: 28 })], { borders: thinBorders }),
            cell([para("BMS App, Socials", { size: 28 })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Booking", { size: 28, bold: true, color: AMBER })], { shading: { fill: LIGHT_AMBER }, borders: thinBorders }),
            cell([para("[Enter Steps]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Goals]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Activities]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Emotions]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Thoughts]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Touchpoints]", { size: 28, italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Post-Booking (Got Ticket)", { size: 28, bold: true, color: BLUE })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("[Enter Steps]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Goals]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Activities]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Emotions]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Thoughts]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Touchpoints]", { size: 28, italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Post-Booking (No Ticket)", { size: 28, bold: true, color: AMBER })], { shading: { fill: LIGHT_AMBER }, borders: thinBorders }),
            cell([para("[Enter Steps]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Goals]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Activities]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Emotions]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Thoughts]", { size: 28, italic: true })], { borders: thinBorders }),
            cell([para("[Enter Touchpoints]", { size: 28, italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Share", { size: 28, bold: true })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("Posts experience", { size: 28 })], { borders: thinBorders }),
            cell([para("Share with friends", { size: 28 })], { borders: thinBorders }),
            cell([para("Posts on social media", { size: 28 })], { borders: thinBorders }),
            cell([para("😊 / 😠", { size: 28 })], { borders: thinBorders }),
            cell([para("Positive or negative feedback", { size: 28 })], { borders: thinBorders }),
            cell([para("Reddit, Twitter, Insta", { size: 28 })], { borders: thinBorders })
          ]})
        ]
      }),
      
      spacer(40),
      para("Analysis Questions:", { bold: true, size: 36 }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [4000, 6080],
        rows: [
          new TableRow({ children: [
            cell([para("Question", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("Your Answer", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Highest friction moment (step + emotion + gap between goal and reality)", { size: 32 })], { borders: thinBorders }),
            cell([para("[Enter details]", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("Phase where Zomato poses biggest threat + why", { size: 32 })], { borders: thinBorders }),
            cell([para("[Enter details]", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]})
        ]
      }),

      spacer(120),

      // 6. STEP 4 - RESEARCH SYNTHESIS
      sectionHeader("Step 4 — Research Synthesis (15 min)"),
      spacer(60),
      para("Synthesize data to validate, challenge, or add to your assumptions about Dheera. Fill in the three synthesis tables below.", { size: 36 }),
      
      spacer(40),
      para("Table 1 — Stress-test the Persona:", { bold: true, size: 34, color: BLUE }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [3360, 3360, 3360],
        rows: [
          new TableRow({ children: [
            cell([para("Confirms Persona", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Adds to Persona", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Challenges Persona", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("[Data point + which part of persona it confirms]\n\n• \n• ", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Data point + what it adds]\n\n• \n• ", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Data point + what assumption it challenges]\n\n• \n• ", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]})
        ]
      }),

      spacer(60),
      para("Table 2 — Cross-Method Pain Point:", { bold: true, size: 34, color: BLUE }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [2500, 2500, 2500, 2580],
        rows: [
          new TableRow({ children: [
            cell([para("Pain Point", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Survey Evidence", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Interview Evidence", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Why Most Actionable", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("[Enter pain point]", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Survey findings]", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Interview quotes/details]", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Explain business/user actionability]", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]})
        ]
      }),

      spacer(60),
      para("Table 3 — What is Still Unknown (Behavioral focus):", { bold: true, size: 34, color: BLUE }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [3360, 3360, 3360],
        rows: [
          new TableRow({ children: [
            cell([para("The Unknown", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Impact on Product Decision", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders }),
            cell([para("Proposed Research Method", { bold: true, size: 34, color: WHITE })], { shading: { fill: BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("[Specify behavioral unknown]", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Why it would change product direction]", { size: 32, color: "888888", italic: true })], { borders: thinBorders }),
            cell([para("[Method to answer it]", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]})
        ]
      }),

      spacer(120),

      // 7. STEP 5 - HYPOTHESIS
      sectionHeader("Step 5 — Hypothesis (10 min)"),
      spacer(60),
      para("Formulate a complete, traceable hypothesis using the template below. Ensure every blank links back to your prior synthesis and journey mapping steps.", { size: 36 }),
      spacer(40),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [
          new TableRow({ children: [
            cell([
              para("Hypothesis Statement Template:", { bold: true, size: 36, color: BLUE }),
              para("___________________________ [Segment — from context]", { size: 34 }),
              para("struggle with ___________________________ [validated pain point — from Step 4, Table 2]", { size: 34 }),
              para("because ___________________________ [root reason — from Step 4 + Step 3 friction moment],", { size: 34 }),
              para("and BMS currently fails to deliver ___________________________ [JTBD gap — from Step 2].", { size: 34 }),
              para("Solving this improves ___________________________ [Booking Conversion Rate — from KPI tree]", { size: 34 }),
              para("which sustains ___________________________ [Market Share — from context].", { size: 34 })
            ], {
              shading: { fill: LIGHT_GRAY },
              borders: thinBorders,
              width: 10080
            })
          ]})
        ]
      }),

      spacer(40),
      para("Validation Questions:", { bold: true, size: 36 }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [4000, 6080],
        rows: [
          new TableRow({ children: [
            cell([para("Question", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders }),
            cell([para("Your Answer", { bold: true, size: 34 })], { shading: { fill: LIGHT_BLUE }, borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("What evidence would prove this hypothesis wrong?", { size: 32 })], { borders: thinBorders }),
            cell([para("[Enter falsification criteria]", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]}),
          new TableRow({ children: [
            cell([para("What is the ONE product intervention this points toward?", { size: 32 })], { borders: thinBorders }),
            cell([para("[Enter single direct intervention]", { size: 32, color: "888888", italic: true })], { borders: thinBorders })
          ]})
        ]
      }),

      spacer(120),

      // 8. SESSION TIMELINE + JUDGING CRITERIA (Side-by-side Info Boxes)
      sectionHeader("Timeline & Assessment"),
      spacer(60),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [4920, 240, 4920],
        rows: [
          new TableRow({ children: [
            cell([
              para("Session Timeline", { bold: true, size: 36, color: BLUE }),
              spacer(20),
              para("• Introduction & Context: 5 min", { size: 34 }),
              para("• Step 1 — Persona: 15 min", { size: 34 }),
              para("• Step 2 — JTBD: 10 min", { size: 34 }),
              para("• Step 3 — Customer Journey Map: 20 min", { size: 34 }),
              para("• Step 4 — Research Synthesis: 15 min", { size: 34 }),
              para("• Step 5 — Hypothesis Formulation: 10 min", { size: 34 }),
              para("• Presentations & Peer Review: 15 min", { size: 34 })
            ], {
              shading: { fill: LIGHT_GRAY },
              borders: thinBorders,
              width: 4920
            }),
            cell([], { width: 240 }), // spacer column
            cell([
              para("Judging Criteria", { bold: true, size: 36, color: BLUE }),
              spacer(20),
              para("1. Math & Data Accuracy: All persona details & pain points map directly to survey/interview data.", { size: 34 }),
              para("2. Logical Consistency: Journey Map friction points directly inform the synthesized pain points.", { size: 34 }),
              para("3. Depth of Insight: JTBD avoids simple feature requests and identifies root human motivation.", { size: 34 }),
              para("4. Clarity of Hypothesis: The final hypothesis statement is sharp, actionable, and testable.", { size: 34 })
            ], {
              shading: { fill: LIGHT_GRAY },
              borders: thinBorders,
              width: 4920
            })
          ]})
        ]
      }),

      spacer(120),

      // 9. TWIST / WARNING CALLOUT
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [
          new TableRow({ children: [
            cell([
              para("Unexpected Twist Constraint", { bold: true, size: 36, color: AMBER }),
              spacer(20),
              para("Don't reveal your finalized persona or synthesized pain points to the other pairs until the presentation/debrief phase. This keeps evaluation unbiased and allows us to compare different approaches to the same priority segment.", { size: 34 })
            ], {
              shading: { fill: LIGHT_AMBER },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: AMBER },
                bottom: noBorder, left: noBorder, right: noBorder
              },
              width: 10080
            })
          ]})
        ]
      }),

      spacer(120),

      // 10. REFERENCE HYPOTHESIS (Shown after presentation)
      sectionHeader("Reference Hypothesis"),
      spacer(60),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [
          new TableRow({ children: [
            cell([
              para("\"Occasional Fans — working professionals who attend 2-4 high-demand events per year and book in groups — struggle with securing tickets during high-demand presales because BMS's infrastructure collapses under peak load (55% app crashes, 50-90 min queue times, 38% bot scalping), and BMS currently delivers a random opaque compromised queue instead of the guaranteed fair access at face value that is the only job Occasional Fans are hiring it to do. Solving this improves Booking Conversion Rate during high-demand events, which sustains Events Booked per User and protects Market Share against Zomato District's entry.\"", { italic: true, size: 34 })
            ], {
              shading: { fill: LIGHT_GRAY },
              borders: thinBorders,
              width: 10080
            })
          ]})
        ]
      }),

      spacer(120),

      // 11. FOOTER
      para("Output: Submit one completed hypothesis worksheet per pair in .docx format.", { italic: true, align: AlignmentType.CENTER, color: "888888", size: 32 })
    ]
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('BookMyShow_Superfan_Activity.docx', buffer);
  console.log('Document BookMyShow_Superfan_Activity.docx created successfully!');
}).catch(err => {
  console.error('Error generating document:', err);
});
