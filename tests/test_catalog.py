import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('catalog', Path(__file__).resolve().parents[1] / 'scripts/catalog.py')
catalog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalog)

class CatalogTests(unittest.TestCase):
    def fixture(self, root):
        (root/'native/src/bin/Release/net10.0').mkdir(parents=True)
        (root/'native/meta.json').write_text(json.dumps(dict(guid='test-guid',name='Discovery',description='d',overview='o',owner='c',category='General',version='0.3.2.0',targetAbi='12.4.0.0')))
        (root/'package.json').write_text('{"version":"0.3.2"}')
        (root/'native/src/FazFort.Discovery.csproj').write_text('<Project><PropertyGroup><Version>0.3.2.0</Version></PropertyGroup></Project>')
        for name in ['FazFort.Discovery.dll','FazFort.Discovery.deps.json']:
            (root/'native/src/bin/Release/net10.0'/name).write_bytes(b'synthetic compiled-asset fixture')
    def test_flat_archive_checksums_and_download_url(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);self.fixture(root)
            archive=catalog.package(root,root/'out','owner/repo','2026-11-04T12:00:00Z')
            with zipfile.ZipFile(archive) as z:
                self.assertEqual(sorted(z.namelist()),['FazFort.Discovery.deps.json','FazFort.Discovery.dll'])
            version=json.loads((root/'out/manifest.json').read_text())[0]['versions'][0]
            self.assertEqual(version['checksum'],hashlib.md5(archive.read_bytes()).hexdigest().upper())
            self.assertEqual(version['sourceUrl'],'https://github.com/owner/repo/releases/download/v0.3.2/Jellyfin.Discovery_0.3.2.0.zip')
            self.assertEqual(version['targetAbi'],'12.4.0.0')
            first=archive.read_bytes()
            catalog.package(root,root/'out','owner/repo','2026-11-05T12:00:00Z')
            self.assertEqual(first,archive.read_bytes())
    def test_mismatched_version_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);self.fixture(root);(root/'package.json').write_text('{"version":"9.0.0"}')
            with self.assertRaises(ValueError):catalog.package(root,root/'out','owner/repo','2026-11-04T12:00:00Z')
    def test_missing_compiled_plugin_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);self.fixture(root);(root/'native/src/bin/Release/net10.0/FazFort.Discovery.dll').unlink()
            with self.assertRaises(ValueError):catalog.package(root,root/'out','owner/repo','2026-11-04T12:00:00Z')
    def test_repository_injection_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaises(ValueError):catalog.package(Path(temp),Path(temp)/'out','owner/repo?token=secret','2026-11-04T12:00:00Z')
