"""Package source and the rebuilt browser bundle, excluding private/generated work."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parents[1]
version = json.loads((root / "package.json").read_text())["version"]
destination = root / "release" / f"fazfort-discovery-{version}.zip"
destination.parent.mkdir(exist_ok=True)
excluded = {"node_modules", "bin", "obj", ".git", "release", "__pycache__"}
with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root)
        if not path.is_file() or any(part in excluded for part in relative.parts):
            continue
        if "backup" in path.name.lower() or path.name.startswith(".env") or path.suffix == ".log":
            continue
        archive.write(path, Path(root.name) / relative)
print(destination)
