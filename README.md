# Influenzanet Common Study Implementation

This repository contains the common questions implementation for the  [Study Engine](https://github.com/influenzanet/survey-engine.ts). 

## Overview

This repository uses case-editor-tools to build the survey json using typescript classes.

Several layers are added to handle specific features

- Translations are handled outside from the survey definition and question using the _T() helpers (to be used in place of the text definition), see Translations
- ItemQuestion, GroupQuestion are used instead of Item & Group class (they inherit from them respectively) to provides extra helpers
- SurveyBuilder class overload SurveyDefinition 
- study_exporter() is used to export the study files, it handles translations, generate a file with missing translations, and can check survey consistency (not implemented yet)
- For simple choice question (single, multiple) BaseChoiceQuestion can produce simpler code
- Some extra helpers are available in src/tools (as_option, exp_as_arg, num_as_arg, ...)

## Installation 

Required : Node (16+), Python (if you want to use scripts/)

For a standalone installation 

- clone the repo

Install dependencies:

```bash
 yarn
```

## Usage

### As Standalone repo

To build the common surveys

Build the generator (needed each time the code in typescript has been edited):

```bash
yarn build
```

Build the surveys and export them as json files (will be in an /output directory)

```bash
yarn export
```

### Usage to create an extra repo

To override the surveys and/or create your own and using the helpers in this repository, you will need to make a link in this repo

Example of setup using nested repo

- Create your repo with an src/ dir

- Clone this repo inside it (in common-study-definition directory for example), you can also use it as submodule (if not add the directory in .gitignore to avoid commiting it)

- Symlink the common-study-definition/src as "src/common" directory

```
ln -s common-study-definition/src src/common
```

Then you can have a src/ with the "common" part as a module in your own repo

### Using as package

Not yet but we are working on.

## Translations

In surveys definitions only an english reference text is provided (this text is not to be used for end users but should be used to drive the translation).
Each text has an unique id. By convention, the id starting with the name of survey plus a dot as prefix like "intake.") and then the question id. The following of the id is up to the question creator (but must be unique).

### In a Survey definition and question code

To refer to a translated text you can use the _T() function as follow:

```ts
    _T("survey.Qxx.my.text.ref", "English reference text")
```

During survey generation, the id will be used as a lookup to build the text map from all the loaded translations.
For security the reference english text must be the same in the translation file as in the question. A warning will be raised if the text is different.

### Translation file

A translation file is a JSON file containing an JSON object with translation entries.
The key of each entry is the text id (used in the survey definition) and the content the Translation object.

By convention, this repository has organized translations by language and survey (each translation file only translate to one language), but a translation file can handle any language you want and any keys (it's possible for example to have a file containing all the languages used for a platform in one file if it's simpler for you).

Proposed translation files are here mixing language and platform (country and implementation of the platform's specificities like the name of the platform). They are provided as example and they will probably need to be overridden to be useable for another platform.

Each translation entry, has the language code as key. If a language code is starting with '#' if will be ignored ()

The reference text is always using the "**en**" language code, and is mandatory for each entry.

Languages codes are arbitrary identifier, but they must be the same identifiers used in the platform as language identifiers (it's advised to use codes like iso language code or IETF inspired coding, like "en-uk").

Here a translation with languages "fr", "it"
```js
{
   "survey.Qxx.my.text.ref": {
        "en": "English reference text",
        "fr": "Un texte",
        "it": "Un testo"
        "#": "A comment targeting the translator"
   },
   "survey.Qxx.another.text": {
        "en":"Another reference text",
        "fr":"Un autre text",
        "it":"Un altro testo",
        "#": "A comment"
        "#2": "Another comment"
   }
}

```

Multiline translation, If you want to have several lines in translation (it's not handled by json), you can use an array of texts (a list of text between two [ ])

```js
{
   "survey.Qxx.my.text.ref": {
        "en": "English reference text",
        "fr": [
            "ligne 1",
            "ligne 2"
        ]
   }
}

```

### Translation loading

Translations are provided as typescript module (see in src/studies/common/languages) for each language.

You can load the bundled translations by importing the corresponding module.

Translations are loaded in order of the import, so you can override translations from a bundle by provided a new translation file with the same keys. All the languages are replaced.


For example (here the repository module is referred as "common" you'll need to adapt the path)
```ts
import { CommonStudyBuilder } from "common/studies/common";
import {  study_exporter } from "common/tools/exporter";
import "common/studies/common/languages/fr";

const builder = new CommonStudyBuilder();

builder.build();

const study = builder.getStudy();

study_exporter([study]);
```
