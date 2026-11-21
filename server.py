import http.server
import socketserver
import os
import webbrowser

PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n=======================================================")
        print(f"🌾 Krishi Saathi - AI Kisan Dost (कृषि साथी)")
        print(f"📡 Running live at: {url}")
        print(f"📂 Serving directory: {DIRECTORY}")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Krishi Saathi server.")

if __name__ == "__main__":
    start_server()
