"""
Convert all markdown docs in this folder to PDF.
Uses fpdf2 for PDF generation — pure Python, no external binaries needed.
"""

import re
import os
from fpdf import FPDF

DOCS = [
    ("HETZNER_VPS_BLUEPRINT.md",   "Hetzner VPS Deployment Blueprint"),
    ("DEPLOYING_NEW_PROJECT.md",   "Deploying a New Project to Hetzner"),
    ("ADDING_PROJECTS.md",         "Adding Projects to the Portfolio"),
]

COLORS = {
    "black":     (18,  18,  18),
    "white":     (255, 255, 255),
    "heading1":  (255, 215,  0),   # gold
    "heading2":  (220, 170,  0),   # amber
    "heading3":  (200, 200, 200),  # light grey
    "body":      (210, 210, 210),  # near white
    "code_bg":   (30,  30,  30),   # dark panel
    "code_text": (180, 230, 140),  # green tint
    "muted":     (130, 130, 130),
    "rule":      (60,  60,  60),
    "table_hdr": (40,  40,  40),
    "table_alt": (26,  26,  26),
}

PAGE_W = 210  # A4 mm
MARGIN = 18
CONTENT_W = PAGE_W - MARGIN * 2


class DocPDF(FPDF):
    def __init__(self, doc_title):
        super().__init__()
        self.doc_title = doc_title
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        # Dark top strip
        self.set_fill_color(*COLORS["code_bg"])
        self.rect(0, 0, PAGE_W, 10, style="F")
        self.set_font("Helvetica", "B", 7)
        self.set_text_color(*COLORS["muted"])
        self.set_xy(MARGIN, 3)
        self.cell(CONTENT_W, 5, self.doc_title, align="L")

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*COLORS["muted"])
        self.cell(0, 5, f"Page {self.page_no()}", align="C")

    def cover(self, title):
        self.add_page()
        # Full dark background
        self.set_fill_color(*COLORS["black"])
        self.rect(0, 0, PAGE_W, 297, style="F")

        # Gold accent bar
        self.set_fill_color(*COLORS["heading1"])
        self.rect(0, 100, PAGE_W, 2, style="F")

        # Title
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(*COLORS["heading1"])
        self.set_xy(MARGIN, 80)
        self.multi_cell(CONTENT_W, 12, title, align="C")

        # Subtitle line
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*COLORS["muted"])
        self.set_xy(MARGIN, 115)
        self.cell(CONTENT_W, 8, "aaronk.tech  |  Hetzner VPS Setup", align="C")


UNICODE_MAP = {
    "\u2014": " -- ",   # em dash
    "\u2013": " - ",    # en dash
    "\u2019": "'",      # right single quote
    "\u2018": "'",      # left single quote
    "\u201c": '"',      # left double quote
    "\u201d": '"',      # right double quote
    "\u2022": "-",      # bullet
    "\u2192": "->",     # right arrow
    "\u2190": "<-",     # left arrow
    "\u2714": "[OK]",   # checkmark
    "\u2718": "[X]",    # cross
    "\u2713": "[OK]",   # check
    "\u2502": "|",      # box drawings vertical
    "\u251c": "+",      # box drawings tee right
    "\u2514": "+",      # box drawings corner
    "\u2500": "-",      # box drawings horizontal
    "\u2588": "#",      # full block
    "\u25b6": ">",      # play button
    "\u00e9": "e",      # e acute
    "\u00e0": "a",      # a grave
    "\u00e8": "e",      # e grave
    "\u00fc": "u",      # u umlaut
    "\u00f6": "o",      # o umlaut
    "\u00e4": "a",      # a umlaut
    "\u00b7": "-",      # middle dot
    "\u00a9": "(c)",    # copyright
    "\u00ae": "(R)",    # registered
    "\u00b0": " deg",   # degree
    "\u2026": "...",    # ellipsis
    "\u00d7": "x",      # multiplication sign
    "\u00ab": "<<",     # left double angle
    "\u00bb": ">>",     # right double angle
    "\u2212": "-",      # minus sign
    "\u2264": "<=",     # less than or equal
    "\u2265": ">=",     # greater than or equal
    "\u00a0": " ",      # non-breaking space
    "\u00e2": "a",      # a circumflex (and similar corrupt chars)
    "\u00e3": "a",
}


def sanitize(text):
    """Replace Unicode characters with ASCII equivalents."""
    for char, replacement in UNICODE_MAP.items():
        text = text.replace(char, replacement)
    # Remove any remaining non-latin-1 characters
    return text.encode("latin-1", errors="replace").decode("latin-1")


def strip_html(text):
    """Remove any HTML tags from text."""
    return re.sub(r"<[^>]+>", "", text)


def parse_table(lines):
    """Parse a markdown table into list of row lists."""
    rows = []
    for line in lines:
        line = line.strip()
        if not line or set(line.replace("|", "").replace("-", "").replace(":", "").replace(" ", "")) == set():
            continue  # skip separator rows
        cells = [c.strip() for c in line.strip("|").split("|")]
        if cells:
            rows.append(cells)
    return rows


def render_inline(pdf, text, base_font_size=9.5):
    """Render a line with inline bold/code segments."""
    parts = re.split(r"(\*\*[^*]+\*\*|`[^`]+`)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            pdf.set_font("Helvetica", "B", base_font_size)
            pdf.set_text_color(*COLORS["body"])
            pdf.write(5, sanitize(part[2:-2]))
        elif part.startswith("`") and part.endswith("`"):
            pdf.set_font("Courier", "", base_font_size - 0.5)
            pdf.set_text_color(*COLORS["code_text"])
            pdf.write(5, sanitize(part[1:-1]))
        else:
            pdf.set_font("Helvetica", "", base_font_size)
            pdf.set_text_color(*COLORS["body"])
            pdf.write(5, sanitize(part))


def convert(md_path, pdf_path, title):
    with open(md_path, encoding="utf-8") as f:
        raw = f.read()

    lines = raw.splitlines()

    pdf = DocPDF(title)
    pdf.set_margins(MARGIN, 14, MARGIN)

    # Cover page
    pdf.cover(title)

    pdf.add_page()
    pdf.set_fill_color(*COLORS["black"])
    pdf.rect(0, 0, PAGE_W, 297, style="F")

    i = 0
    in_code = False
    code_lines = []
    table_lines = []
    in_table = False

    def flush_table():
        nonlocal table_lines
        if not table_lines:
            return
        rows = parse_table(table_lines)
        if not rows:
            table_lines = []
            return

        col_count = max(len(r) for r in rows)
        col_w = CONTENT_W / col_count

        for ri, row in enumerate(rows):
            is_header = (ri == 0)
            bg = COLORS["table_hdr"] if is_header else (COLORS["table_alt"] if ri % 2 == 0 else COLORS["code_bg"])
            pdf.set_fill_color(*bg)
            # Row background
            row_h = 6
            x0 = pdf.get_x()
            y0 = pdf.get_y()
            pdf.rect(MARGIN, y0, CONTENT_W, row_h, style="F")

            for ci, cell in enumerate(row[:col_count]):
                pdf.set_xy(MARGIN + ci * col_w + 2, y0 + 0.8)
                pdf.set_font("Helvetica", "B" if is_header else "", 7.5)
                pdf.set_text_color(*COLORS["heading1"] if is_header else COLORS["body"])
                safe = sanitize(strip_html(cell))
                safe = re.sub(r"\*\*([^*]+)\*\*", r"\1", safe)
                safe = re.sub(r"`([^`]+)`", r"\1", safe)
                pdf.cell(col_w - 3, row_h - 1.5, safe[:50], border=0)
            pdf.set_xy(MARGIN, y0 + row_h)

        pdf.ln(4)
        table_lines = []

    while i < len(lines):
        line = lines[i]

        # ── Code block ───────────────────────────────────────────────────
        if line.strip().startswith("```"):
            if not in_code:
                in_code = True
                code_lines = []
                i += 1
                continue
            else:
                # Render accumulated code block
                in_code = False
                block_text = "\n".join(code_lines)
                lines_count = len(code_lines)
                block_h = lines_count * 4.2 + 6

                # Background panel
                pdf.set_fill_color(*COLORS["code_bg"])
                y0 = pdf.get_y()
                if y0 + block_h > 270:
                    pdf.add_page()
                    pdf.set_fill_color(*COLORS["black"])
                    pdf.rect(0, 0, PAGE_W, 297, style="F")
                    y0 = pdf.get_y()

                pdf.rect(MARGIN, y0, CONTENT_W, block_h, style="F")
                # Left accent bar
                pdf.set_fill_color(*COLORS["heading2"])
                pdf.rect(MARGIN, y0, 1.5, block_h, style="F")

                pdf.set_xy(MARGIN + 4, y0 + 3)
                for cl in code_lines:
                    display = sanitize(cl[:115])
                    pdf.set_font("Courier", "", 7)
                    pdf.set_text_color(*COLORS["code_text"])
                    pdf.set_x(MARGIN + 4)
                    pdf.cell(CONTENT_W - 5, 4.2, display, border=0, new_x="LMARGIN", new_y="NEXT")

                pdf.set_xy(MARGIN, y0 + block_h + 3)
                code_lines = []
                i += 1
                continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        # ── Table ────────────────────────────────────────────────────────
        if "|" in line and line.strip().startswith("|"):
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(line)
            i += 1
            continue
        elif in_table:
            in_table = False
            flush_table()

        # ── Horizontal rule ──────────────────────────────────────────────
        if re.match(r"^---+$", line.strip()):
            pdf.set_draw_color(*COLORS["rule"])
            pdf.set_line_width(0.4)
            pdf.line(MARGIN, pdf.get_y() + 1, PAGE_W - MARGIN, pdf.get_y() + 1)
            pdf.ln(5)
            i += 1
            continue

        # ── Headings ─────────────────────────────────────────────────────
        h3 = re.match(r"^### (.+)", line)
        h2 = re.match(r"^## (.+)", line)
        h1 = re.match(r"^# (.+)", line)

        if h1:
            pdf.ln(4)
            pdf.set_font("Helvetica", "B", 18)
            pdf.set_text_color(*COLORS["heading1"])
            pdf.set_x(MARGIN)
            text = sanitize(strip_html(re.sub(r"\*\*([^*]+)\*\*", r"\1", h1.group(1))))
            pdf.multi_cell(CONTENT_W, 10, text)
            # Gold underline
            pdf.set_draw_color(*COLORS["heading1"])
            pdf.set_line_width(0.6)
            y = pdf.get_y()
            pdf.line(MARGIN, y, MARGIN + 60, y)
            pdf.ln(5)

        elif h2:
            pdf.ln(5)
            text = sanitize(strip_html(re.sub(r"\*\*([^*]+)\*\*", r"\1", h2.group(1))))
            # Subtle background strip
            pdf.set_fill_color(28, 28, 28)
            y0 = pdf.get_y()
            pdf.rect(MARGIN, y0, CONTENT_W, 8, style="F")
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(*COLORS["heading2"])
            pdf.set_xy(MARGIN + 3, y0 + 1.2)
            pdf.cell(CONTENT_W, 6, text, border=0)
            pdf.set_xy(MARGIN, y0 + 9)
            pdf.ln(2)

        elif h3:
            pdf.ln(4)
            text = sanitize(strip_html(re.sub(r"\*\*([^*]+)\*\*", r"\1", h3.group(1))))
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*COLORS["heading3"])
            pdf.set_x(MARGIN)
            pdf.cell(CONTENT_W, 6, text, border=0, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)

        # ── Bullet list ──────────────────────────────────────────────────
        elif re.match(r"^[\-\*] ", line):
            content = line[2:].strip()
            content = re.sub(r"^`(.+)`$", r"\1", content)
            pdf.set_x(MARGIN + 5)
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*COLORS["muted"])
            pdf.cell(4, 5, "-", border=0)
            pdf.set_x(MARGIN + 10)
            pdf.set_font("Helvetica", "", 9)

            # Inline render
            x0 = pdf.get_x()
            y0 = pdf.get_y()
            parts = re.split(r"(\*\*[^*]+\*\*|`[^`]+`)", content)
            for part in parts:
                if part.startswith("**") and part.endswith("**"):
                    pdf.set_font("Helvetica", "B", 9)
                    pdf.set_text_color(*COLORS["body"])
                    pdf.write(5, part[2:-2])
                elif part.startswith("`") and part.endswith("`"):
                    pdf.set_font("Courier", "", 8.5)
                    pdf.set_text_color(*COLORS["code_text"])
                    pdf.write(5, part[1:-1])
                else:
                    clean = sanitize(strip_html(part))
                    clean = re.sub(r"\*\*([^*]+)\*\*", r"\1", clean)
                    pdf.set_font("Helvetica", "", 9)
                    pdf.set_text_color(*COLORS["body"])
                    pdf.write(5, clean)
            pdf.ln(5)

        # ── Numbered list ────────────────────────────────────────────────
        elif re.match(r"^\d+\. ", line):
            m = re.match(r"^(\d+)\. (.+)", line)
            if m:
                num, content = m.group(1), m.group(2)
                pdf.set_x(MARGIN + 4)
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(*COLORS["heading2"])
                pdf.cell(6, 5, f"{num}.", border=0)
                pdf.set_x(MARGIN + 11)
                clean = sanitize(strip_html(re.sub(r"\*\*([^*]+)\*\*", r"\1", content)))
                clean = re.sub(r"`([^`]+)`", r"\1", clean)
                pdf.set_font("Helvetica", "", 9)
                pdf.set_text_color(*COLORS["body"])
                pdf.multi_cell(CONTENT_W - 11, 5, clean)

        # ── Blockquote ───────────────────────────────────────────────────
        elif line.strip().startswith(">"):
            content = line.strip().lstrip("> ").strip()
            clean = sanitize(strip_html(re.sub(r"\*\*([^*]+)\*\*", r"\1", content)))
            clean = re.sub(r"`([^`]+)`", r"\1", clean)
            if clean:
                pdf.set_fill_color(35, 35, 35)
                y0 = pdf.get_y()
                text_h = 5 * (len(clean) // 75 + 1) + 4
                pdf.rect(MARGIN, y0, CONTENT_W, text_h, style="F")
                pdf.set_fill_color(*COLORS["heading1"])
                pdf.rect(MARGIN, y0, 2, text_h, style="F")
                pdf.set_xy(MARGIN + 5, y0 + 2)
                pdf.set_font("Helvetica", "I", 8.5)
                pdf.set_text_color(*COLORS["muted"])
                pdf.multi_cell(CONTENT_W - 7, 5, clean)
                pdf.ln(2)

        # ── Blank line ───────────────────────────────────────────────────
        elif line.strip() == "":
            pdf.ln(2)

        # ── Normal paragraph ─────────────────────────────────────────────
        else:
            clean = strip_html(line)
            if clean.strip():
                pdf.set_x(MARGIN)
                render_inline(pdf, clean)
                pdf.ln(6)

        i += 1

    if in_table:
        flush_table()

    pdf.output(pdf_path)
    print(f"  OK  {os.path.basename(pdf_path)}")


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print("\nConverting docs to PDF...\n")
    for md_file, title in DOCS:
        md_path  = os.path.join(script_dir, md_file)
        pdf_path = os.path.join(script_dir, md_file.replace(".md", ".pdf"))
        if not os.path.exists(md_path):
            print(f"  SKIP  {md_file} not found")
            continue
        convert(md_path, pdf_path, title)
    print("\nDone. PDF files are in the docs/ folder.\n")
