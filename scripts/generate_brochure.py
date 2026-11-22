import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717A"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, A4[1] - 30, "STEPSMART · PM-X ACCELERATOR · THE AI PM COHORT")
            self.drawRightString(A4[0] - 40, A4[1] - 30, "admin.stepsmart@net")
            self.setStrokeColor(colors.HexColor("#E4E4E7"))
            self.setLineWidth(0.75)
            self.line(40, A4[1] - 34, A4[0] - 40, A4[1] - 34)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#E4E4E7"))
        self.setLineWidth(0.75)
        self.line(40, 36, A4[0] - 40, 36)
        self.drawString(40, 24, "StepSmart Fellowship · 12-Week AI PM Track · Starts Dec 1st Week")
        self.drawRightString(A4[0] - 40, 24, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_DARK = colors.HexColor("#141413")
    C_BLUE = colors.HexColor("#188AB2")
    C_YELLOW = colors.HexColor("#FEF08A")
    C_LIGHT_BG = colors.HexColor("#FDFCF7")
    C_GRAY = colors.HexColor("#52525B")
    C_LIGHT_GRAY = colors.HexColor("#F4F4F5")
    C_BORDER = colors.HexColor("#141413")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=32,
        textColor=C_DARK,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=C_BLUE,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=C_DARK,
        spaceAfter=8,
        spaceBefore=12
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=C_DARK,
        spaceAfter=6,
        spaceBefore=8
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=C_DARK,
        spaceAfter=6
    )

    bold_body_style = ParagraphStyle(
        'BoldBody_Custom',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    tag_style = ParagraphStyle(
        'Tag_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=C_DARK
    )

    story = []

    # ==================== PAGE 1: COVER & OVERVIEW ====================
    story.append(Spacer(1, 15))
    
    # Eyebrow Pill
    eyebrow_data = [[
        Paragraph("<font color='#188ab2'><b>STEPSMART ACCELERATOR</b></font> · LIVE COHORT · SMALL BY DESIGN · CAPPED AT 15 SEATS", tag_style)
    ]]
    t_eyebrow = Table(eyebrow_data, colWidths=[515])
    t_eyebrow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_YELLOW),
        ('BOX', (0,0), (-1,-1), 1.5, C_DARK),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(t_eyebrow)
    story.append(Spacer(1, 16))

    story.append(Paragraph("The AI PM Cohort", title_style))
    story.append(Paragraph("12 weeks. One real AI product. Built from your own domain.", subtitle_style))
    story.append(Paragraph(
        "<b>300+ applications. About 10 interviews. One PM job.</b><br/>"
        "Sanket was a data engineer. On our wheel, Product Manager was a 9% slice. He became a PM anyway. "
        "The wheel isn’t your career. What you can show is.<br/><br/>"
        "You are an experienced professional who works around AI and wants to build with it. Your mandate for 12 weeks: "
        "<b>pick one real problem from your own work and ship an AI product that solves it.</b>",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Highlights 4-box banner
    metrics_data = [
        [
            Paragraph("<b>12 WEEKS</b><br/><font size=7.5 color='#52525B'>Full AI PM Build</font>", tag_style),
            Paragraph("<b>1 AI PRODUCT</b><br/><font size=7.5 color='#52525B'>From Your Domain</font>", tag_style),
            Paragraph("<b>8 WKS INTERVIEW</b><br/><font size=7.5 color='#52525B'>Live Mocks & Drills</font>", tag_style),
            Paragraph("<b>4 WKS PROFILE</b><br/><font size=7.5 color='#52525B'>Resume & LinkedIn</font>", tag_style)
        ]
    ]
    t_metrics = Table(metrics_data, colWidths=[128, 129, 129, 129])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#E0F2FE")),
        ('BOX', (0,0), (-1,-1), 1.5, C_DARK),
        ('INNERGRID', (0,0), (-1,-1), 1, C_DARK),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 14))

    # WHAT YOU WALK AWAY WITH
    story.append(Paragraph("WHAT YOU WALK AWAY WITH", h1_style))
    outcomes = [
        "<b>A working AI product</b>, built on a real problem from your own domain.",
        "<b>An AI PRD and a 20-case test set</b> that show how you think, not just what you built.",
        "<b>A portfolio case study and a LinkedIn story</b> you can use directly in interviews.",
        "<b>A plain way to explain how AI products behave</b>, to engineers, executives, and hiring managers.",
        "<b>A full mock interview loop</b>, run directly on your own product with senior PM mentors.",
        "<b>We don’t promise a job. We promise proof you can defend.</b>"
    ]
    outcomes_table = []
    for o in outcomes:
        outcomes_table.append([Paragraph("✓", ParagraphStyle('Check', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#059669'))),
                               Paragraph(o, body_style)])
    t_outcomes = Table(outcomes_table, colWidths=[20, 495])
    t_outcomes.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_outcomes)
    story.append(Spacer(1, 10))

    # IS THIS FOR YOU
    story.append(Paragraph("IS THIS FOR YOU?", h1_style))
    fit_data = [
        [
            Paragraph("<b>THIS IS FOR YOU IF:</b><br/>"
                      "• You are an analyst, QA, BA, product owner, program, data, risk or tech role<br/>"
                      "• You use AI at work and want to explain it with confidence<br/>"
                      "• You want to move toward product or AI product work<br/>"
                      "• You can give about 6 hours a week and build every week", body_style),
            Paragraph("<b>THIS IS NOT FOR YOU IF:</b><br/>"
                      "• You are a student or fresher<br/>"
                      "• You want to learn to code AI systems from scratch<br/>"
                      "• You want an unrealistic job guarantee<br/>"
                      "• You would rather passively watch videos than build", body_style)
        ]
    ]
    t_fit = Table(fit_data, colWidths=[257, 258])
    t_fit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#ECFDF5")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#FEF2F2")),
        ('BOX', (0,0), (0,0), 1.2, colors.HexColor("#059669")),
        ('BOX', (1,0), (1,0), 1.2, colors.HexColor("#DC2626")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_fit)

    story.append(PageBreak())

    # ==================== PAGE 2: 12-WEEK DELIVERABLES ROADMAP ====================
    story.append(Paragraph("THE 12 WEEKS: ONE DELIVERABLE EVERY WEEK", title_style))
    story.append(Paragraph("A disciplined, production-grade progression taking you from problem space to live demo and portfolio defense.", body_style))
    story.append(Spacer(1, 8))

    weeks_data = [
        ("01", "Problem Brief", "Problem space", "Pick one real problem from your own work. Write who has it, how often, and the evidence."),
        ("02", "AI Brief", "Problem space", "Decide if AI is even the answer. Set one success number and write a one-page brief."),
        ("03", "Behaviour Log", "How AI behaves", "Test your problem across prompts and models. Record where answers vary, drift or hallucinate."),
        ("04 ★", "Prototype v1", "How AI behaves", "Give the AI your own documents. Build a first version that answers them. (1:1 Checkpoint #1)"),
        ("05", "Test Set", "Make it trustworthy", "Write 20 known test cases with right answers. Score your prototype against them."),
        ("06", "Agent Sketch", "Make it trustworthy", "Design an agent on one page: its goal, its tools, and what it must never do."),
        ("07", "Safety Plan", "Make it trustworthy", "Add guardrails and approval points. List three ways it fails and how you will catch each."),
        ("08 ★", "AI PRD", "Design & ship", "Turn your brief and test results into a PRD an engineering team could build from. (1:1 Checkpoint #2)"),
        ("09", "Build Sprint", "Design & ship", "Ship a working version of your product and put it in front of three real users."),
        ("10", "Launch Plan", "Design & ship", "Work out cost per use, telemetry metrics, and how the product improves after launch."),
        ("11", "Proof Pack", "Proof & positioning", "Turn the build into a portfolio case study and an interview-ready LinkedIn story."),
        ("12 ★", "Demo Day", "Proof & positioning", "Demo your product, then run a full mock interview loop on it. (1:1 Checkpoint #3)")
    ]

    table_rows = [
        [
            Paragraph("<b>WK</b>", tag_style),
            Paragraph("<b>DELIVERABLE</b>", tag_style),
            Paragraph("<b>PHASE</b>", tag_style),
            Paragraph("<b>WHAT YOU EXECUTE & SHIP</b>", tag_style)
        ]
    ]

    for wk, name, phase, desc in weeks_data:
        is_graded = "★" in wk
        bg_col = "#FEF08A" if is_graded else "#FFFFFF"
        table_rows.append([
            Paragraph(f"<b>{wk}</b>", tag_style),
            Paragraph(f"<b>{name}</b>", bold_body_style),
            Paragraph(f"<font color='#188ab2'>{phase}</font>", tag_style),
            Paragraph(desc, body_style)
        ])

    t_weeks = Table(table_rows, colWidths=[38, 105, 95, 277])
    t_weeks.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E4E4E7")),
        ('BOX', (0,0), (-1,-1), 1.2, C_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D4D4D8")),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,4), (-1,4), colors.HexColor("#FEF9C3")),
        ('BACKGROUND', (0,8), (-1,8), colors.HexColor("#FEF9C3")),
        ('BACKGROUND', (0,12), (-1,12), colors.HexColor("#FEF9C3")),
    ]))
    story.append(t_weeks)
    story.append(Spacer(1, 10))

    # Checkpoints note
    story.append(Paragraph(
        "<b>★ 1:1 Mentor Checkpoints:</b> Weeks 4, 8, and 12 include dedicated 1:1 sessions with Sanket & Ankit to stress-test your deliverables, review PRD technical architecture, and conduct full mock interviews.",
        ParagraphStyle('Note', parent=body_style, fontSize=8.5, leading=12, textColor=C_GRAY)
    ))

    story.append(PageBreak())

    # ==================== PAGE 3: THE 3 MODULES & TIMELINE ====================
    story.append(Paragraph("THE THREE ACCELERATOR MODULES", title_style))
    story.append(Paragraph("Take the full AI PM Flagship track or reserve targeted modular tracks based on where your gaps are.", subtitle_style))
    story.append(Spacer(1, 6))

    # MODULE 1: AI PM
    mod1_content = [
        [Paragraph("<b>FLAGSHIP MODULE 01: THE AI PM COHORT</b> · 12 WEEKS · ₹30,000", tag_style)],
        [Paragraph(
            "<b>12 weeks. One real AI product. Built from your own domain.</b><br/>"
            "Includes all 12 weekly deliverables, working AI prototype, AI PRD, 20-case test set, "
            "<b>plus the complete 8-Week Interview Module and 4-Week Profile Enhancer included at no extra cost.</b> "
            "3 dedicated 1:1 checkpoints and permanent Learn Library access.",
            body_style
        )]
    ]
    t_mod1 = Table(mod1_content, colWidths=[515])
    t_mod1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_YELLOW),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#FFFDF5")),
        ('BOX', (0,0), (-1,-1), 1.5, C_DARK),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_mod1)
    story.append(Spacer(1, 12))

    # MODULE 2 & 3: SIDE BY SIDE (Interview Module & Profile Enhancer)
    story.append(Paragraph("STANDALONE MODULES (₹7,000 EACH · RUNNING PARALLEL BELOW AI PM)", h2_style))
    
    side_data = [
        [
            Paragraph("<b>MODULE 02: INTERVIEW MODULE</b><br/>"
                      "<font size=8 color='#188ab2'>FIRST 8 WEEKS (W1–W8) · ₹7,000</font><br/><br/>"
                      "<b>What it delivers:</b><br/>"
                      "• 8 live Saturday out-loud practice sessions<br/>"
                      "• Clarifying questions & product design drills<br/>"
                      "• Root cause analysis (RCA) & metrics drop diagnosis<br/>"
                      "• Market sizing, guesstimates & pricing logic<br/>"
                      "• Behavioral storytelling & executive presence<br/>"
                      "• 2 live 1:1 mock interview loops with written rubric", body_style),
            Paragraph("<b>MODULE 03: PROFILE ENHANCER</b><br/>"
                      "<font size=8 color='#188ab2'>LAST 4 WEEKS (W9–W12) · ₹7,000</font><br/><br/>"
                      "<b>What it delivers:</b><br/>"
                      "• 4 live interactive sessions on profile reconstruction<br/>"
                      "• Complete PM resume rewrite highlighting proof & telemetry<br/>"
                      "• LinkedIn profile overhaul & personal narrative<br/>"
                      "• Portfolio defense pack to share with hiring teams<br/>"
                      "• 3 months complimentary StepSmart PM Job Board access<br/>"
                      "• WhatsApp referral circle & active alumni community", body_style)
        ]
    ]
    t_side = Table(side_data, colWidths=[253, 254])
    t_side.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#F0FDF4")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (0,0), 1.2, colors.HexColor("#141413")),
        ('BOX', (1,0), (1,0), 1.2, colors.HexColor("#141413")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_side)
    story.append(Spacer(1, 14))

    # HOW IT RUNS AND TIMELINE MAP
    story.append(Paragraph("YOUR PATH THROUGH THE 12 WEEKS", h1_style))
    
    path_data = [
        [
            Paragraph("<b>LANE 1: AI PM TRACK (WEEKS 1–12)</b><br/>"
                      "Problem Brief ➜ AI Brief ➜ Behaviour Log ➜ Prototype v1 (1:1) ➜ Test Set ➜ Agent Sketch ➜ Safety Plan ➜ AI PRD (1:1) ➜ Build Sprint ➜ Launch Plan ➜ Proof Pack ➜ Demo Day (1:1)",
                      ParagraphStyle('L1', parent=body_style, fontSize=8.5, leading=12))
        ],
        [
            Paragraph("<b>LANE 2A: INTERVIEW MODULE (FIRST 8 WEEKS)</b><br/>"
                      "Weekly Live Mocks: Product Sense · RCA · Metrics · Strategy · Estimation · 2 Full Mocks (Weeks 4 & 8)",
                      ParagraphStyle('L2A', parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor('#065F46')))
        ],
        [
            Paragraph("<b>LANE 2B: PROFILE ENHANCER (LAST 4 WEEKS: W9–W12)</b><br/>"
                      "Resume Rewrite ➜ LinkedIn Overhaul ➜ Portfolio Proof Pack ➜ StepSmart Job Board (3 Months)",
                      ParagraphStyle('L2B', parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor('#1E40AF')))
        ]
    ]
    t_path = Table(path_data, colWidths=[515])
    t_path.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FEF08A")),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#D1FAE5")),
        ('BACKGROUND', (0,2), (-1,2), colors.HexColor("#DBEAFE")),
        ('BOX', (0,0), (-1,-1), 1.2, C_DARK),
        ('INNERGRID', (0,0), (-1,-1), 1, C_DARK),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_path)
    story.append(Spacer(1, 12))

    # ADMISSIONS & HOW TO JOIN
    story.append(Paragraph("ADMISSIONS & INVESTMENT", h1_style))
    adm_data = [
        [
            Paragraph("<b>HOW IT RUNS:</b><br/>"
                      "• One live build session a week (evening / weekend IST)<br/>"
                      "• Every session opens with live drill on your phone, then you build<br/>"
                      "• Mentor feedback on every deliverable<br/>"
                      "• 1:1 checkpoints at weeks 4, 8 and 12<br/>"
                      "• Class recordings uploaded within 4 hours", body_style),
            Paragraph("<b>HOW TO JOIN:</b><br/>"
                      "• <b>Starts:</b> December 1st Week (1st Dec 2026)<br/>"
                      "• <b>Seats:</b> Strictly capped at 15<br/>"
                      "• <b>Fee:</b> INR ₹30,000 for all 12 weeks<br/>"
                      "• <b>Process:</b> Apply ➜ 15-minute alignment call ➜ Invitation if fit ➜ ₹1,000 seat-hold adjusted in fee", body_style)
        ]
    ]
    t_adm = Table(adm_data, colWidths=[253, 254])
    t_adm.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_LIGHT_GRAY),
        ('BOX', (0,0), (-1,-1), 1.2, C_DARK),
        ('INNERGRID', (0,0), (-1,-1), 1, C_DARK),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_adm)
    story.append(Spacer(1, 10))

    # MENTORS
    story.append(Paragraph(
        "<b>FACULTY:</b> Sanket (Senior PM at Mastercard, ex-Paytm, IIT Kanpur alum) &amp; Ankit (Product Manager 2 at Microsoft, IIM Bangalore alum). "
        "<i>Before your call: write down one problem from your own job that you wish someone would fix. That becomes your project.</i>",
        ParagraphStyle('Mentors', parent=body_style, fontSize=8, leading=11, textColor=C_GRAY)
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Brochure PDF generated successfully at: {filename}")

if __name__ == "__main__":
    out_path = "landing/public/PM-X-Accelerator-Brochure.pdf"
    build_pdf(out_path)
    # Also copy to dist if dist exists
    if os.path.exists("landing/dist"):
        import shutil
        shutil.copyfile(out_path, "landing/dist/PM-X-Accelerator-Brochure.pdf")
        print("Copied to landing/dist/PM-X-Accelerator-Brochure.pdf")
