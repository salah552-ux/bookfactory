import graphviz

dot = graphviz.Digraph('YouTube_Automation_Architecture', format='png', engine='dot')
dot.attr(rankdir='TB', bgcolor='white', size='26,36', dpi='150')
dot.attr('node', shape='box', style='rounded,filled', fillcolor='lightblue', fontname='Arial', fontsize='10')
dot.attr('edge', fontname='Arial', fontsize='8')

# ── HERMES ──────────────────────────────────────────────────────────────────
dot.node('HERMES', 'HERMES\nMaster Orchestrator',
         fillcolor='darkred', fontcolor='white', penwidth='3', fontsize='13')

# ── FIX 1: Renamed "PRE-TRAINING" → "INTELLIGENCE GATHERING" ────────────────
with dot.subgraph(name='cluster_PT') as c:
    c.attr(label='INTELLIGENCE GATHERING LAYER', style='filled', fillcolor='#fffde7',
           color='orange', fontname='Arial Bold', fontsize='11')
    c.node('PT_YT',   'YouTube\nResearch Agent',       fillcolor='lightgreen')
    c.node('PT_MON',  'Monetization\nResearch Agent',  fillcolor='lightgreen')
    c.node('PT_COMP', 'Competitor\nAnalysis Agent',    fillcolor='lightgreen')
    c.node('PT_TREND','Trend Forecasting\nAgent',      fillcolor='lightgreen')

dot.edge('HERMES', 'PT_YT')
dot.edge('HERMES', 'PT_MON')
dot.edge('HERMES', 'PT_COMP')
dot.edge('HERMES', 'PT_TREND')

# ── INTELLIGENCE LAYER ───────────────────────────────────────────────────────
with dot.subgraph(name='cluster_INT') as c:
    c.attr(label='INTELLIGENCE LAYER', style='filled', fillcolor='#e0f7fa',
           color='steelblue', fontname='Arial Bold', fontsize='11')
    c.node('INT_DEC',   'Decision\nAgent',               fillcolor='lightcyan')
    c.node('INT_STRAT', 'Strategy\nAgent',               fillcolor='lightcyan')
    c.node('INT_YT',    'YouTube Algorithm\nExpert',     fillcolor='lightcyan')
    # FIX 3: Crisis Management now has outbound edges (pause → review → resume)
    c.node('INT_CRISIS','Crisis Management\nAgent',      fillcolor='#ffccbc')
    c.node('INT_AUD',   'Audience Segmentation\nAgent',  fillcolor='lightcyan')

dot.edge('PT_YT',   'INT_DEC',   label='knowledge')
dot.edge('PT_MON',  'INT_STRAT', label='knowledge')
dot.edge('PT_COMP', 'INT_YT',    label='knowledge')
dot.edge('PT_TREND','INT_AUD',   label='knowledge')
dot.edge('INT_DEC',   'INT_STRAT')
dot.edge('INT_STRAT', 'INT_YT')
dot.edge('INT_YT',    'INT_CRISIS')
dot.edge('INT_AUD',   'INT_STRAT')

# FIX 3 outbound: Crisis fires a pipeline pause → HERMES escalation
dot.edge('INT_CRISIS', 'HERMES',    label='escalate / pause pipeline',
         style='dashed', color='red', fontcolor='red')

# ── PRODUCTION LAYER ─────────────────────────────────────────────────────────
with dot.subgraph(name='cluster_PROD') as c:
    c.attr(label='PRODUCTION LAYER', style='filled', fillcolor='#fce4ec',
           color='deeppink', fontname='Arial Bold', fontsize='11')
    c.node('PROD_SCRIPT', 'Script Writer\nAgent',       fillcolor='lightpink')
    c.node('PROD_VIDEO',  'Video Generator\nAgent',     fillcolor='lightpink')
    # FIX 6: Retry node for Video Generator failures
    c.node('PROD_RETRY',  'Retry / Fallback\nController',
           fillcolor='#ffe0b2', shape='diamond', style='filled')
    c.node('PROD_THUMB',  'Thumbnail Designer\nAgent',  fillcolor='lightpink')
    c.node('PROD_SEO',    'SEO Expert\nAgent',           fillcolor='lightpink')
    c.node('PROD_HASH',   'Hashtag Expert\nAgent',       fillcolor='lightpink')
    c.node('PROD_COMP',   'Compliance\nAgent',           fillcolor='lightpink')
    c.node('PROD_BRAND',  'Brand Integrity\nAgent',      fillcolor='lightpink')
    # FIX 1: Human approval gate before Upload
    c.node('PROD_GATE',   '⚑ Human Approval\nGate',
           fillcolor='#fff176', shape='hexagon', style='filled', penwidth='2')
    c.node('PROD_UP',     'Upload\nAgent',                fillcolor='lightpink')

dot.edge('INT_STRAT',   'PROD_SCRIPT', label='strategy')
# FIX 4: Direct Audience Segmentation → Script Writer edge
dot.edge('INT_AUD',     'PROD_SCRIPT', label='audience profile',
         style='dashed', color='steelblue', fontcolor='steelblue')
dot.edge('PROD_SCRIPT', 'PROD_VIDEO')
# FIX 6: Video Generator → Retry controller → success or escalate
dot.edge('PROD_VIDEO',  'PROD_RETRY',  label='result')
dot.edge('PROD_RETRY',  'PROD_THUMB',  label='success')
dot.edge('PROD_RETRY',  'PROD_VIDEO',  label='retry (≤3)',
         style='dashed', color='orange', fontcolor='orange')
dot.edge('PROD_RETRY',  'INT_CRISIS',  label='failure (3x)',
         style='dashed', color='red', fontcolor='red')
dot.edge('PROD_VIDEO',  'PROD_SEO')
dot.edge('PROD_VIDEO',  'PROD_HASH')
dot.edge('PROD_THUMB',  'PROD_COMP')
dot.edge('PROD_SEO',    'PROD_COMP')
dot.edge('PROD_HASH',   'PROD_COMP')
dot.edge('PROD_COMP',   'PROD_BRAND')
# FIX 1: Brand → Human Gate → Upload (not Brand → Upload directly)
dot.edge('PROD_BRAND',  'PROD_GATE')
dot.edge('PROD_GATE',   'PROD_UP',    label='approved')
dot.edge('PROD_GATE',   'PROD_COMP',  label='rejected → rework',
         style='dashed', color='red', fontcolor='red')

# ── MONETIZATION LAYER ───────────────────────────────────────────────────────
with dot.subgraph(name='cluster_MON') as c:
    c.attr(label='MONETIZATION LAYER', style='filled', fillcolor='#e8eaf6',
           color='slateblue', fontname='Arial Bold', fontsize='11')
    c.node('MON_YT',    'YouTube Monetization\nAgent',    fillcolor='lightsteelblue')
    c.node('MON_TT',    'TikTok Monetization\nAgent',     fillcolor='lightsteelblue')
    c.node('MON_FB',    'Facebook Monetization\nAgent',   fillcolor='lightsteelblue')
    c.node('MON_PERF',  'Performance Analytics\nAgent',   fillcolor='lightsteelblue')
    c.node('MON_REV',   'Revenue Optimizer\nAgent',       fillcolor='lightsteelblue')
    c.node('MON_SCHED', 'Scheduling Optimization\nAgent', fillcolor='lightsteelblue')

dot.edge('PROD_UP', 'MON_YT',  label='published content')
dot.edge('PROD_UP', 'MON_TT',  label='published content')
dot.edge('PROD_UP', 'MON_FB',  label='published content')
dot.edge('MON_YT',  'MON_PERF', label='revenue data')
dot.edge('MON_TT',  'MON_PERF', label='revenue data')
dot.edge('MON_FB',  'MON_PERF', label='revenue data')
dot.edge('MON_PERF', 'MON_REV',  label='performance metrics')
dot.edge('MON_PERF', 'MON_SCHED')
dot.edge('MON_REV',  'INT_DEC',     label='performance feedback',
         style='dashed', color='slateblue')
dot.edge('MON_PERF', 'PROD_SCRIPT', label='content performance',
         style='dashed', color='slateblue')
dot.edge('MON_SCHED','PROD_UP',     label='optimal timing',
         style='dashed', color='slateblue')

# ── FINANCIAL MANAGEMENT LAYER ───────────────────────────────────────────────
with dot.subgraph(name='cluster_FIN') as c:
    c.attr(label='FINANCIAL MANAGEMENT LAYER', style='filled', fillcolor='#fffde7',
           color='goldenrod', fontname='Arial Bold', fontsize='11')
    c.node('FIN_FORE',  'Revenue Forecasting\nAgent',  fillcolor='lightgoldenrodyellow')
    c.node('FIN_TREAS', 'Treasury Management\nAgent',  fillcolor='lightgoldenrodyellow')
    c.node('FIN_BUDGET','Budget Optimization\nAgent',  fillcolor='lightgoldenrodyellow')

dot.edge('MON_REV',    'FIN_FORE',   label='revenue')
dot.edge('FIN_FORE',   'FIN_TREAS')
dot.edge('FIN_TREAS',  'FIN_BUDGET')
dot.edge('FIN_BUDGET', 'INT_DEC',      label='financial intelligence',
         style='dashed', color='goldenrod')
# FIX (budget → production): budget constraints flow directly to production planning
dot.edge('FIN_BUDGET', 'PROD_SCRIPT', label='budget constraints',
         style='dashed', color='goldenrod')

# ── FIX 5: LLM Router — single routing node replaces direct agent→LLM wires ──
dot.node('LLM_ROUTER', 'LLM Router\n(model selector)',
         shape='diamond', fillcolor='#e1bee7', style='filled', fontsize='9')

# FIX 5: All LLM-calling agents go through the router
dot.edge('PROD_SCRIPT', 'LLM_ROUTER', style='dotted', color='purple')
dot.edge('INT_DEC',     'LLM_ROUTER', style='dotted', color='purple')
dot.edge('INT_STRAT',   'LLM_ROUTER', style='dotted', color='purple')

# ── EXTERNAL APIs ─────────────────────────────────────────────────────────────
with dot.subgraph(name='cluster_API') as c:
    c.attr(label='EXTERNAL APIs / SERVICES', style='dashed', color='gray',
           fontname='Arial Bold', fontsize='11')
    c.node('API_YT',   'YouTube API',    shape='ellipse', fillcolor='white', style='filled,dashed')
    c.node('API_GT',   'Google Trends',  shape='ellipse', fillcolor='white', style='filled,dashed')
    c.node('API_VEO',  'Google Veo 3.1', shape='ellipse', fillcolor='white', style='filled,dashed')
    c.node('API_CHAT', 'ChatGPT Pro',    shape='ellipse', fillcolor='white', style='filled,dashed')
    c.node('API_DEEP', 'DeepSeek V4',    shape='ellipse', fillcolor='white', style='filled,dashed')

dot.edge('PT_YT',     'API_YT',   style='dotted', color='gray')
dot.edge('PT_TREND',  'API_GT',   style='dotted', color='gray')
dot.edge('MON_YT',    'API_YT',   style='dotted', color='gray')
# FIX 6: Video Generator → API_VEO (retry loop handles failures)
dot.edge('PROD_VIDEO','API_VEO',  style='dotted', color='gray')
# FIX 5: Router dispatches to the right LLM
dot.edge('LLM_ROUTER','API_CHAT', label='creative / script', style='dotted', color='purple')
dot.edge('LLM_ROUTER','API_DEEP', label='analysis / decision', style='dotted', color='purple')

# ── Render ────────────────────────────────────────────────────────────────────
out = dot.render('/home/user/bookfactory/youtube_automation_architecture', cleanup=True)
print(f"Saved: {out}")
