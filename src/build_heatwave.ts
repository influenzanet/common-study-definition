import { StudyBuilder } from "./tools";
import * as fs from "fs";
import { join } from "path";
import { HeatwaveBackgroundSurvey, HeatwaveSymptomsSurvey } from "./studies/heatwave/surveys";
import { study_exporter } from "./tools/exporter";
import { DocumentExporterPlugin } from "./tools/exporter/documents";
import { LanguageHelpers } from "./studies/common/languages/languageHelpers";

class HeatwaveStudy extends StudyBuilder {
    constructor() {
        super('heatwave');
    }

    build() {

        const meta = new Map<string, string>();

        meta.set('timestamp', Date.now().toString(36));

        const background = new HeatwaveBackgroundSurvey(meta);

        const symptoms = new HeatwaveSymptomsSurvey(meta);

        this.surveys = [
            background,
            symptoms,
        ];
    }
}

const args: string[] = process.argv.slice(2);

let languages: string[] = [];
args.forEach(arg => {
    if(arg.startsWith('lang=')) {
        const codes = arg.slice(5).split(',');
        languages = codes.filter( v=> v.match(/[\-\_a-z]+/));
    }
});

LanguageHelpers.verboseMissing = false;

languages.forEach(code => {
    const p = join(__dirname, 'studies/heatwave/languages/' + code + '.json');
    if(fs.existsSync(p)) {
        console.log("Importing language "+ code);
        const d = fs.readFileSync(p, 'utf8');
        const trans = JSON.parse(d);
        LanguageHelpers.addLanguage(code, trans);
    } else {
        LanguageHelpers.addLanguage(code, {});
    }
});

console.log(languages);

const builder = new HeatwaveStudy();

builder.build();

const study = builder.getStudy();

const docPlugin = new DocumentExporterPlugin();

study_exporter([study], {'check': true, 'missing': true, languages: languages, plugins: [docPlugin]});

