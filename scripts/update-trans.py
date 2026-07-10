import json 
import argparse
from pathlib import Path
from typing import Optional

class TranslationFile:

    def __init__(self, name:str):
        self.name = name
        self.languages: set[str] = set()
        self.trans: dict[str, dict[str, str|list[str]]] = {}
        self.ref = 'en' # Reference language 

    def load(self, path):
        with open(path, 'r') as f:
            self.trans = json.load(f)
        self.discover()

    def discover(self):
        """ 
            Discover languages in the translation file
        """
        for _, item in self.trans.items():
            langs = set(item.keys())
            if self.ref in langs:
                langs.discard(self.ref)
            self.languages.update(langs)
    
    def save(self, path):
        with open(path, 'w') as f:
            json.dump(self.trans, f, ensure_ascii=False, sort_keys=True, indent=2)

    def update_from(self, path):
        with open(path, 'r') as f:
            new_trans = json.load(f)
        for key, trans_item in new_trans.items():
            if key not in self.trans:
                print(f"'{key}' is not in original file, wont update")
                continue
            old_item = self.trans[key]
            new_ref = trans_item.get(self.ref)
            old_ref = old_item.get(self.ref)
            if new_ref is not None and old_ref is not None and old_ref != new_ref:
                print(f"Warning reference is not the same for key '{key}")
            for lang in self.languages:
                if lang in trans_item:
                    old_item[lang]= trans_item[lang]

    def describe(self):
        print(" Translation file '{}' with {} keys for languages {}".format(self.name, len(self.trans), self.languages))

def run_update(org_file:Path, update_file:Path, dry_run:bool, output: Optional[Path] ):
    if not org_file.exists():
        print(f"Unable to find '{org_file}'")
        return
    if not update_file.exists():
        print(f"Unable to find '{update_file}'")
        return
    
    trans = TranslationFile(org_file.name)
    trans.load(org_file)
    trans.describe()
    trans.update_from(update_file)

    if output is None:
        new_file = org_file.name + '.new'
        output = org_file.parent / new_file
    if not dry_run:
        trans.save(output)

parser = argparse.ArgumentParser(prog = 'update translation file',)

parser.add_argument('old_trans', help="Original translation file to update")
parser.add_argument('new_trans', help="New translation to get update from")
parser.add_argument('--dry-run', help="New translation to get update from", action="store_true")
parser.add_argument('--output', help="File to save (default is old_trans file with .new extension)")
            
args = parser.parse_args()


org_file = Path(args.old_trans)
update_file = Path(args.new_trans)

run_update(org_file, update_file, args.dry_run, args.output)
