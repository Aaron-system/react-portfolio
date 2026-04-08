"""
Convert all markdown docs to self-contained, styled HTML files.
Single .html file per doc — open in any browser, share via email or LinkedIn.
Run: python docs/convert_to_html.py
"""

import re
import os
import html as html_lib
from datetime import date

DOCS = [
    ("HETZNER_VPS_BLUEPRINT.md",  "Hetzner VPS Deployment Blueprint"),
    ("DEPLOYING_NEW_PROJECT.md",  "Deploying a New Project to Hetzner"),
    ("ADDING_PROJECTS.md",        "Adding Projects to the Portfolio"),
]

# ── Sanitization ─────────────────────────────────────────────────────────────
# Applied before rendering so generated HTML contains no personal info.
# Order matters — more specific patterns first.
REDACTIONS = [
    # Server IP
    ("204.168.177.22",                          "YOUR_SERVER_IP"),
    # Subdomains (before root domain so they don't partially match)
    ("horizonlegaldocs.online",                 "yourproject.com"),
    ("docs.aaronk.tech",                        "docs.yourdomain.com"),
    ("arbiter.aaronk.tech",                     "arbiter.yourdomain.com"),
    ("blockchain-node.aaronk.tech",             "blockchain-node.yourdomain.com"),
    ("blockchain-wallet.aaronk.tech",           "blockchain-wallet.yourdomain.com"),
    ("blockchain.aaronk.tech",                  "blockchain.yourdomain.com"),
    ("newproject.aaronk.tech",                  "newproject.yourdomain.com"),
    ("www.aaronk.tech",                         "www.yourdomain.com"),
    ("aaronk.tech",                             "yourdomain.com"),
    # GitHub
    ("github.com/Aaron-system",                 "github.com/your-username"),
    ("Aaron-system",                            "your-username"),
    # Paths that mention portfolio specifically
    ("/opt/portfolio",                          "/opt/yourproject"),
    ("C:\\portfolio\\your-project",             "C:\\path\\to\\your-project"),
    ("C:\\portfolio\\react-portfolio",          "C:\\path\\to\\your-project"),
    # Resume file
    ("Aaron_Kreidieh_Resume_2026.docx",         "Your_Resume.docx"),
    # Full name
    ("Aaron Kreidieh's React portfolio",        "your React portfolio"),
    ("Aaron Kreidieh",                          "[Your Name]"),
    ("Aaron K",                                 "[Your Name]"),
    # First name references in prose
    ("in Aaron Kreidieh",                       "in [Your Name]"),
    # Email
    ("aaron.kreidieh@gmail.com",                "your@email.com"),
    # Top bar brand in generated HTML
    ("aaronk.tech",                             "yourdomain.com"),  # catch any leftovers
]


def sanitize_content(text):
    """Replace all personal info with generic placeholders."""
    for personal, generic in REDACTIONS:
        text = text.replace(personal, generic)
    return text

CSS = """
  :root {
    --bg:       #111113;
    --surface:  #1a1a1d;
    --surface2: #222226;
    --border:   #2e2e34;
    --gold:     #ffd700;
    --amber:    #e0a800;
    --green:    #98d98e;
    --muted:    #888;
    --body:     #d0d0d0;
    --white:    #f0f0f0;
    --code-bg:  #16181c;
    --radius:   6px;
    --font:     -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    --mono:     'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--body);
    font-family: var(--font);
    font-size: 15px;
    line-height: 1.75;
    padding: 0;
  }

  /* ── Top bar ─────────────────────────────────────────── */
  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .topbar-brand {
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .topbar-brand span { color: var(--gold); font-weight: 700; }
  .topbar-date { font-size: 12px; color: var(--muted); }

  /* ── Layout ──────────────────────────────────────────── */
  .layout { display: flex; max-width: 1100px; margin: 0 auto; }

  /* ── Sidebar TOC ─────────────────────────────────────── */
  .toc {
    width: 240px;
    min-width: 240px;
    padding: 40px 20px 40px 0;
    position: sticky;
    top: 53px;
    height: calc(100vh - 53px);
    overflow-y: auto;
    border-right: 1px solid var(--border);
  }
  .toc-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 14px;
    padding-left: 12px;
  }
  .toc a {
    display: block;
    font-size: 12.5px;
    color: var(--muted);
    text-decoration: none;
    padding: 4px 10px 4px 12px;
    border-left: 2px solid transparent;
    border-radius: 0 3px 3px 0;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .toc a:hover, .toc a.active {
    color: var(--gold);
    border-left-color: var(--gold);
    background: rgba(255,215,0,0.05);
  }
  .toc a.h3 { padding-left: 22px; font-size: 12px; }

  /* ── Main content ────────────────────────────────────── */
  .content {
    flex: 1;
    min-width: 0;
    padding: 48px 56px 80px 56px;
  }

  /* ── Cover ───────────────────────────────────────────── */
  .cover {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    padding: 48px 40px 40px;
    margin-bottom: 48px;
    position: relative;
    overflow: hidden;
  }
  .cover::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--amber), transparent);
  }
  .cover-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .cover h1 {
    font-size: 28px;
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
    margin-bottom: 16px;
    border: none;
    padding: 0;
  }
  .cover-meta {
    font-size: 13px;
    color: var(--muted);
  }
  .cover-meta a { color: var(--gold); text-decoration: none; }

  /* ── Headings ────────────────────────────────────────── */
  h1, h2, h3, h4 {
    color: var(--white);
    font-weight: 700;
    scroll-margin-top: 70px;
  }
  h1 {
    font-size: 26px;
    color: var(--gold);
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
    margin: 40px 0 20px;
  }
  h2 {
    font-size: 18px;
    color: var(--amber);
    background: var(--surface);
    border-left: 3px solid var(--gold);
    padding: 10px 14px;
    border-radius: 0 var(--radius) var(--radius) 0;
    margin: 36px 0 16px;
  }
  h3 {
    font-size: 15px;
    color: var(--white);
    margin: 28px 0 10px;
  }
  h4 {
    font-size: 13px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 20px 0 8px;
  }

  /* ── Paragraphs & inline ─────────────────────────────── */
  p { margin: 0 0 14px; color: var(--body); }
  a { color: var(--gold); text-decoration: none; }
  a:hover { text-decoration: underline; }
  strong { color: var(--white); font-weight: 600; }
  em { color: var(--body); font-style: italic; }

  code {
    font-family: var(--mono);
    font-size: 13px;
    background: var(--code-bg);
    color: var(--green);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }

  /* ── Code blocks ─────────────────────────────────────── */
  pre {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-left: 3px solid var(--amber);
    border-radius: var(--radius);
    padding: 18px 20px;
    overflow-x: auto;
    margin: 16px 0 20px;
    font-size: 13px;
    line-height: 1.6;
  }
  pre code {
    background: none;
    border: none;
    padding: 0;
    color: var(--green);
    font-size: inherit;
  }
  .code-lang {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  /* ── Tables ──────────────────────────────────────────── */
  .table-wrap { overflow-x: auto; margin: 16px 0 24px; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  th {
    background: var(--surface2);
    color: var(--gold);
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 10px 14px;
    text-align: left;
    border-bottom: 2px solid var(--gold);
  }
  td {
    padding: 9px 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    color: var(--body);
  }
  tr:nth-child(even) td { background: var(--surface); }
  tr:hover td { background: rgba(255,215,0,0.04); }

  /* ── Lists ───────────────────────────────────────────── */
  ul, ol {
    margin: 0 0 16px 0;
    padding-left: 0;
    list-style: none;
  }
  li {
    padding: 3px 0 3px 22px;
    position: relative;
    color: var(--body);
    font-size: 14.5px;
  }
  ul > li::before {
    content: '▸';
    position: absolute;
    left: 4px;
    color: var(--gold);
    font-size: 11px;
    top: 5px;
  }
  ol { counter-reset: ol-counter; }
  ol > li { counter-increment: ol-counter; }
  ol > li::before {
    content: counter(ol-counter) ".";
    position: absolute;
    left: 0;
    color: var(--amber);
    font-weight: 700;
    font-size: 13px;
  }
  li p { margin: 0; }

  /* Checklist */
  li.check::before { content: '✓'; color: #5cb85c; }
  li.uncheck::before { content: '☐'; color: var(--muted); }

  /* ── Blockquotes ─────────────────────────────────────── */
  blockquote {
    margin: 16px 0;
    padding: 12px 16px;
    border-left: 3px solid var(--gold);
    background: rgba(255,215,0,0.05);
    border-radius: 0 var(--radius) var(--radius) 0;
    color: var(--muted);
    font-style: italic;
    font-size: 14px;
  }
  blockquote strong { color: var(--amber); }
  blockquote p { margin: 0; }

  /* ── Horizontal rule ─────────────────────────────────── */
  hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 36px 0;
  }

  /* ── Responsive ──────────────────────────────────────── */
  @media (max-width: 780px) {
    .toc { display: none; }
    .content { padding: 28px 20px 60px; }
    .topbar { padding: 12px 20px; }
    .cover { padding: 28px 20px; }
  }

  /* ── Print ───────────────────────────────────────────── */
  @media print {
    .topbar, .toc { display: none; }
    .content { padding: 0; }
    body { background: white; color: black; }
    pre { border: 1px solid #ccc; }
    h1, h2, h3 { color: black; }
    code, pre code { color: #333; background: #f5f5f5; }
  }
"""

TOC_JS = """
  const links = document.querySelectorAll('.toc a');
  const sections = [];
  links.forEach(a => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (target) sections.push({ a, target });
  });
  const onScroll = () => {
    const scrollY = window.scrollY + 80;
    let active = sections[0];
    sections.forEach(s => { if (s.target.offsetTop <= scrollY) active = s; });
    links.forEach(a => a.classList.remove('active'));
    if (active) active.a.classList.add('active');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
"""


def slugify(text):
    text = re.sub(r"[^a-z0-9\s-]", "", text.lower())
    return re.sub(r"[\s]+", "-", text.strip())


def escape(text):
    return html_lib.escape(text)


def render_inline(text):
    """Convert inline markdown (bold, code, links, italic) to HTML."""
    # Escape HTML first
    text = html_lib.escape(text)
    # **bold**
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    # *italic*
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    # `code`
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    # [link](url)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    return text


def convert_md_to_html(md_text, title):
    lines = md_text.splitlines()
    toc_items = []   # (level, text, slug)
    body_parts = []  # HTML fragments

    i = 0
    while i < len(lines):
        line = lines[i]

        # ── Code block ────────────────────────────────────────────────
        fence = re.match(r"^```(\w*)", line)
        if fence:
            lang = fence.group(1) or ""
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            code_body = "\n".join(code_lines)
            lang_label = f'<div class="code-lang">{escape(lang)}</div>' if lang else ""
            body_parts.append(
                f'{lang_label}<pre><code>{escape(code_body)}</code></pre>'
            )
            i += 1
            continue

        # ── Horizontal rule ───────────────────────────────────────────
        if re.match(r"^---+$", line.strip()):
            body_parts.append("<hr>")
            i += 1
            continue

        # ── Headings ──────────────────────────────────────────────────
        hm = re.match(r"^(#{1,4})\s+(.+)", line)
        if hm:
            level = len(hm.group(1))
            raw_text = hm.group(2)
            clean_text = re.sub(r"\*\*(.+?)\*\*", r"\1", raw_text)
            clean_text = re.sub(r"`(.+?)`", r"\1", clean_text)
            clean_text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", clean_text)
            slug = slugify(clean_text)
            inner = render_inline(raw_text)
            body_parts.append(
                f'<h{level} id="{slug}">{inner}</h{level}>'
            )
            if level in (1, 2, 3):
                toc_items.append((level, clean_text, slug))
            i += 1
            continue

        # ── Table ─────────────────────────────────────────────────────
        if "|" in line and line.strip().startswith("|"):
            table_lines = []
            while i < len(lines) and "|" in lines[i]:
                table_lines.append(lines[i])
                i += 1
            rows = []
            for tl in table_lines:
                tl = tl.strip()
                if re.match(r"^\|[\s\-:|]+\|$", tl):
                    continue
                cells = [c.strip() for c in tl.strip("|").split("|")]
                rows.append(cells)
            if rows:
                html_t = ['<div class="table-wrap"><table>']
                for ri, row in enumerate(rows):
                    tag = "th" if ri == 0 else "td"
                    html_t.append("<tr>" + "".join(
                        f"<{tag}>{render_inline(c)}</{tag}>" for c in row
                    ) + "</tr>")
                html_t.append("</table></div>")
                body_parts.append("\n".join(html_t))
            continue

        # ── Blockquote ────────────────────────────────────────────────
        if line.strip().startswith(">"):
            bq_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                bq_lines.append(lines[i].strip().lstrip(">").strip())
                i += 1
            inner = render_inline(" ".join(bq_lines))
            body_parts.append(f"<blockquote><p>{inner}</p></blockquote>")
            continue

        # ── Unordered list ────────────────────────────────────────────
        if re.match(r"^[\-\*] ", line):
            items = []
            while i < len(lines) and re.match(r"^[\-\*] ", lines[i]):
                content = lines[i][2:].strip()
                css_class = ""
                if content.startswith("[ ] "):
                    css_class = " class=\"uncheck\""
                    content = content[4:]
                elif content.startswith("[x] ") or content.startswith("[X] "):
                    css_class = " class=\"check\""
                    content = content[4:]
                items.append(f"<li{css_class}>{render_inline(content)}</li>")
                i += 1
            body_parts.append("<ul>" + "\n".join(items) + "</ul>")
            continue

        # ── Ordered list ──────────────────────────────────────────────
        if re.match(r"^\d+\. ", line):
            items = []
            while i < len(lines) and re.match(r"^\d+\. ", lines[i]):
                content = re.match(r"^\d+\. (.+)", lines[i]).group(1)
                items.append(f"<li>{render_inline(content)}</li>")
                i += 1
            body_parts.append("<ol>" + "\n".join(items) + "</ol>")
            continue

        # ── Blank line ────────────────────────────────────────────────
        if line.strip() == "":
            i += 1
            continue

        # ── Normal paragraph ──────────────────────────────────────────
        # Collect continuation lines
        para_lines = []
        while i < len(lines) and lines[i].strip() != "" \
                and not lines[i].strip().startswith("#") \
                and not lines[i].strip().startswith("```") \
                and not lines[i].strip().startswith("|") \
                and not lines[i].strip().startswith(">") \
                and not re.match(r"^[\-\*] ", lines[i]) \
                and not re.match(r"^\d+\. ", lines[i]) \
                and not re.match(r"^---+$", lines[i].strip()):
            para_lines.append(lines[i])
            i += 1
        if para_lines:
            combined = " ".join(para_lines)
            body_parts.append(f"<p>{render_inline(combined)}</p>")

    # Build TOC HTML
    toc_html_parts = ['<div class="toc-title">Contents</div>']
    for level, text, slug in toc_items:
        css = " h3" if level == 3 else ""
        toc_html_parts.append(
            f'<a href="#{slug}" class="{css.strip()}">{escape(text)}</a>'
        )
    toc_html = "\n".join(toc_html_parts)

    body_html = "\n".join(body_parts)

    today = date.today().strftime("%B %d, %Y")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{escape(title)}</title>
  <style>{CSS}</style>
</head>
<body>

    <header class="topbar">
    <div class="topbar-brand"><span>Hetzner VPS</span> &nbsp;/&nbsp; Deployment Guide</div>
    <div class="topbar-date">{today}</div>
  </header>

  <div class="layout">

    <nav class="toc">
      {toc_html}
    </nav>

    <main class="content">

      <div class="cover">
        <div class="cover-label">Hetzner VPS &nbsp;&mdash;&nbsp; Technical Documentation</div>
        <h1>{escape(title)}</h1>
        <div class="cover-meta">Generated {today}</div>
      </div>

      {body_html}

    </main>
  </div>

  <script>{TOC_JS}</script>
</body>
</html>"""


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print("\nConverting docs to HTML...\n")
    for md_file, title in DOCS:
        md_path   = os.path.join(script_dir, md_file)
        html_path = os.path.join(script_dir, md_file.replace(".md", ".html"))
        if not os.path.exists(md_path):
            print(f"  SKIP  {md_file} not found")
            continue
        with open(md_path, encoding="utf-8") as f:
            md_text = f.read()
        md_text = sanitize_content(md_text)
        html_out = convert_md_to_html(md_text, title)
        html_out = sanitize_content(html_out)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_out)
        size_kb = round(os.path.getsize(html_path) / 1024, 1)
        print(f"  OK  {os.path.basename(html_path)}  ({size_kb} KB)")
    print("\nDone. Open any .html file in your browser.\n")
