import os

# Change this to wherever you want the project
project_path = r"C:\SmartFlood"

folders = [
    "css",
    "js",
    "assets",
    "assets/icons",
    "assets/images",
    "assets/logos",
    "api",
    "data",
    "docs"
]

files = [
    "index.html",
    "dashboard.html",
    "README.md",
    "package.json",
    "vercel.json",
    ".gitignore",
    ".env.example",

    "css/style.css",
    "css/map.css",
    "css/chatbot.css",
    "css/dashboard.css",
    "css/responsive.css",

    "js/app.js",
    "js/map.js",
    "js/weather.js",
    "js/floodRisk.js",
    "js/chatbot.js",
    "js/analytics.js",
    "js/utils.js",

    "api/weather.js",
    "api/tides.js",
    "api/floodRisk.js",

    "data/flood-data.json",
    "data/elevation-data.json",

    "docs/architecture.md"
]

# Create project folder
os.makedirs(project_path, exist_ok=True)

# Create folders
for folder in folders:
    os.makedirs(os.path.join(project_path, folder), exist_ok=True)

# Create files
for file in files:
    file_path = os.path.join(project_path, file)

    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            pass

print("\nProject structure created successfully!")
print(f"\nLocation:\n{project_path}")