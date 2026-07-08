import { StudyBuilder } from "./tools";

import { HeatwaveBackgroundSurvey } from "./studies/heatwave/surveys";
import { study_exporter } from "./tools/exporter";
import { DocumentExporterPlugin } from "./tools/exporter/documents";

class HeatwaveStudy extends StudyBuilder {
    constructor() {
        super('heatwave');
    }

    build() {

        const meta = new Map<string, string>();

        meta.set('timestamp', Date.now().toString(36));

        const background = new HeatwaveBackgroundSurvey();
        
        this.surveys = [
            background,
        ];
    }
}

const builder = new HeatwaveStudy();

builder.build();

const study = builder.getStudy();

const docPlugin = new DocumentExporterPlugin();

study_exporter([study], {'check': true, 'missing': true, languages: ['fr'], plugins: [docPlugin]});

