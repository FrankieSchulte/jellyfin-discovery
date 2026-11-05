"""Create a Jellyfin catalog ZIP and manifest from the compiled plugin.

The ZIP is flat, contains only the plugin assembly/deps file, and embeds the web
bundle in the assembly. Never publish the source ZIP or Linux installer as a plugin.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]

def package(root, output, repository, timestamp):
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repository):
        raise ValueError('Use an owner/repository identifier')
    metadata = json.loads((root / 'native/meta.json').read_text())
    version = metadata['version']
    browser_version = json.loads((root / 'package.json').read_text())['version']
    project_version = ET.parse(root / 'native/src/FazFort.Discovery.csproj').findtext('.//Version')
    if version != browser_version + '.0' or version != project_version:
        raise ValueError('Browser, native project and metadata versions must agree')
    if not re.fullmatch(r'\d+\.\d+\.\d+\.\d+', version):
        raise ValueError('Native version must contain four numeric components')
    stamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
    if stamp.tzinfo is None:
        raise ValueError('Timestamp must include a timezone')
    stamp = stamp.astimezone(timezone.utc)
    output.mkdir(parents=True, exist_ok=True)
    filename = f'Jellyfin.Discovery_{version}.zip'
    archive = output / filename
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
        for name in ('FazFort.Discovery.dll', 'FazFort.Discovery.deps.json'):
            source = root / 'native/src/bin/Release/net10.0' / name
            if not source.is_file() or source.stat().st_size == 0:
                raise ValueError(f'Missing compiled asset: {name}')
            info = zipfile.ZipInfo(name, (2020, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            bundle.writestr(info, source.read_bytes())
    payload = archive.read_bytes()
    entry = {key: metadata[key] for key in ('guid', 'name', 'description', 'overview', 'owner', 'category')}
    entry['repositoryUrl'] = f'https://github.com/{repository}'
    entry['versions'] = [{
        'version': version,
        'changelog': 'Catalog installation, bundled browser delivery and consolidated themed shelves.',
        'targetAbi': metadata['targetAbi'],
        'sourceUrl': f'https://github.com/{repository}/releases/download/v{browser_version}/{filename}',
        'checksum': hashlib.md5(payload).hexdigest().upper(),
        'timestamp': stamp.isoformat().replace('+00:00', 'Z'),
        'dependencies': []
    }]
    (output / 'manifest.json').write_text(json.dumps([entry], indent=2) + '\n')
    (output / 'SHA256SUMS').write_text(f'{hashlib.sha256(payload).hexdigest()}  {filename}\n')
    return archive

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--repository', default=os.environ.get('GITHUB_REPOSITORY', 'FrankieSchulte/jellyfin-discovery'))
    parser.add_argument('--output', type=Path, default=ROOT / 'release/catalog')
    parser.add_argument('--timestamp', default=datetime.now(timezone.utc).isoformat())
    args = parser.parse_args()
    print(package(ROOT, args.output, args.repository, args.timestamp))
