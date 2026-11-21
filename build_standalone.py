import os

base_dir = os.path.dirname(os.path.abspath(__file__))
index_path = os.path.join(base_dir, 'index.html')
app_path = os.path.join(base_dir, 'app.jsx')
standalone_path = os.path.join(base_dir, 'standalone.html')

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(app_path, 'r', encoding='utf-8') as f:
    app_jsx = f.read()

target = '<script type="text/babel" src="app.jsx"></script>'
replacement = '<script type="text/babel">\n' + app_jsx + '\n</script>'

if target in html:
    standalone_html = html.replace(target, replacement)
    with open(standalone_path, 'w', encoding='utf-8') as f:
        f.write(standalone_html)
    print(f"Generated {standalone_path} successfully ({len(standalone_html)} bytes).")
else:
    print("Target tag not found in index.html")
