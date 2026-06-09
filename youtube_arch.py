import graphviz

dot = graphviz.Digraph('YouTube_Automation_Architecture', format='png', engine='dot')
dot.attr(rankdir='TB', bgcolor='white', size='24,32', dpi='150')
dot.attr('node', shape='box', style='rounded,filled', fillcolor='lightblue', fontname='Arial', fontsize='10')
dot.attr('edge', fontname='Arial', fontsize='8')

# ── HERMES ──────────────────────────────────────────────────────────────────
dot.node('HERMES', 'HERMES\nMaster Orchestrator',
         fillcolor='darkred', fontcolor='white', penwidth='3', fontsize='13')

# ── PRE-TRAINING LAYER ───────────────────────────────────────────────────────
with dot.subgraph(name='cluster_PT') as c:
    c.attr(label='PRE-TRAINING LAYER', style='filled', fillcolor='#fffde7',
           color='orange', fontname='Arial Bold', fontsize='11')
    c.node('PT_YT',   'YouTube\nResearch Agent',       fillcolor='lightgreen')
    c.node('PT_MON',  'Monetization\nResearch Agent',  fillcolor='lightgreen')
    c.node('PT_COMP', 'Competitor\nAnalysis Agent',    fillcolor='lightgreen')
    c.node('PT_TREND','Trend Forecasting\nAgent',      fillcolor='lightgreen')

dot.edge('HERMES', 'PT_YT',    lhead='cluster_PT')
dot.edge('HERMES', 'PT_MON',   lhead='cluster_PT')
dot.edge('HERMES', 'PT_COMP',  lhead='cluster_PT')
dot.edge('HERMES', 'PT_TREND', lhead='cluster_PT')

# ── INTELLIGENCE LAYER ───────────────────────────────────────────────────────
with dot.subgraph(name='cluster_INT') as c:
    c.attr(label='INTELLIGENCE LAYER', style='filled', fillcolor='#e0f7fa',
           color='steelblue', fontname='Arial Bold', fontsize='11')
    c.node('INT_DEC',   'Decision\nAgent',               fillcolor='lightcyan')
    c.node('INT_STRAT', 'Strategy\nAgent',               fillcolor='lightcyan')
    c.node('INT_YT',    'YouTube Algorithm\nExpert',     fillcolor='lightcyan')
    c.node('INT_CRISIS','Crisis Management\nAgent',      fillcolor='lightcyan')
    c.node('INT_AUD',   'Audience Segmentation\nAgent',  fillcolor='lightcyan')

dot.edge('PT_YT',   'INT_DEC',   label='knowledge')
dot.edge('PT_MON',  'INT_STRAT', label='knowledge')
dot.edge('PT_COMP', 'INT_YT',    label='knowledge')
dot.edge('PT_TREND','INT_AUD',   label='knowledge')
dot.edge('INT_DEC',   'INT_STRAT')
dot.edge('INT_STRAT', 'INT_YT')
dot.edge('INT_YT',    'INT_CRISIS')
dot.edge('INT_AUD',   'INT_STRAT')

# ── PRODUCTION LAYER ─────────────────────────────────────────────────────────
with dot.subgraph(name='cluster_PROD') as c:
    c.attr(label='PRODUCTION LAYER', style='filled', fillcolor='#fce4ec',
           color='deeppink', fontname='Arial Bold', fontsize='11')
    c.node('PROD_SCRIPT', 'Script Writer\nAgent',    fillcolor='lightpink')
    c.node('PROD_VIDEO',  'Video Generator\nAgent',  fillcolor='lightpink')
    c.node('PROD_THUMB',  'Thumbnail Designer\nAgent', fillcolor='lightpink')
    c.node('PROD_SEO',    'SEO Expert\nAgent',        fillcolor='lightpink')
    c.node('PROD_HASH',   'Hashtag Expert\nAgent',    fillcolor='lightpink')
    c.node('PROD_COMP',   'Compliance\nAgent',        fillcolor='lightpink')
    c.node('PROD_BRAND',  'Brand Integrity\nAgent',   fillcolor='lightpink')
    c.node('PROD_UP',     'Upload\nAgent',             fillcolor='lightpink')

dot.edge('INT_STRAT',   'PROD_SCRIPT', label='strategy')
dot.edge('PROD_SCRIPT', 'PROD_VIDEO')
dot.edge('PROD_VIDEO',  'PROD_THUMB')
dot.edge('PROD_VIDEO',  'PROD_SEO')
dot.edge('PROD_VIDEO',  'PROD_HASH')
dot.edge('PROD_THUMB',  'PROD_COMP')
dot.edge('PROD_SEO',    'PROD_COMP')
dot.edge('PROD_HASH',   'PROD_COMP')
dot.edge('PROD_COMP',   'PROD_BRAND')
dot.edge('PROD_BRAND',  'PROD_UP')

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
dot.edge('MON_PERF', 'MON_REV', label='performance metrics')
dot.edge('MON_PERF', 'MON_SCHED')
dot.edge('MON_REV',  'INT_DEC',      label='performance feedback', style='dashed', color='slateblue')
dot.edge('MON_PERF', 'PROD_SCRIPT',  label='content performance',  style='dashed', color='slateblue')
dot.edge('MON_SCHED','PROD_UP',      label='optimal timing',        style='dashed', color='slateblue')

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
dot.edge('FIN_BUDGET', 'INT_DEC', label='financial intelligence', style='dashed', color='goldenrod')

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
dot.edge('PROD_VIDEO','API_VEO',  style='dotted', color='gray')
dot.edge('PROD_SCRIPT','API_CHAT', style='dotted', color='gray')
dot.edge('INT_DEC',   'API_DEEP', style='dotted', color='gray')
dot.edge('INT_STRAT', 'API_CHAT', style='dotted', color='gray')

# ── Render ────────────────────────────────────────────────────────────────────
out = dot.render('/home/user/bookfactory/youtube_automation_architecture', cleanup=True)
print(f"Saved: {out}")
