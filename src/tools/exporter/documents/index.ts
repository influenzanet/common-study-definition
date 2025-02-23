import { Study } from "case-editor-tools/types/study";
import { existsSync, readFileSync, readSync, writeFileSync } from "fs";
import { Expression, Survey } from "survey-engine/data_types";
import { HtmlRenderer, HtmlRendererContext, BootstrapTheme, RulesHtmlRenderer, MappingSpec, RenderContextOptions, SurveyMapping } from "ifn-survey-tools"

/**
 * DocumentExportPlugin generate Html documents describing Survey Definition and rules in a 
 * more human-readable form
 */
export class DocumentExporterPlugin {
    
    mapping?: MappingSpec

    export(study: Study, output: string, languages?: string[]) {

        study.surveys.forEach(survey=>{
            buildDocument(survey.editor.getSurvey(), output + '/surveys/', languages, this.mapping);
        })

        const defaultStudyRulesName = 'studyRules';

        if(study.studyRules) {
            buildDRulesDocument(study.studyRules.get(), output, defaultStudyRulesName, languages);
        }

        if(study.customStudyRules) {
            study.customStudyRules.forEach((csr, index) => {
                buildDRulesDocument(csr.rules, output + '/customRules/', csr.name, languages);
            });
        }
    }

    loadMappingFromJson(file: string) {
        this.mapping = readMappingSpec(file)
    }
}



/**
 * 
 * @param survey Survey Definition object
 * @param outputFolder 
 * @param languages list of language to export in document
 * @param mapping Survey variable Mapping spec (can defined mapping for several surveys) 
 */
export function buildDocument(survey: Survey, outputFolder:string, languages?: string[], mapping?: MappingSpec) {
    // Create a survey context, to tell the renderer how to render (languages to show and css theme)

    const ctxOptions: RenderContextOptions = {
        languages: languages ?? ['en']
    };

    if(mapping) {
        const surveyKey = survey.surveyDefinition.key;
        const surveyMappingSpec = mapping[surveyKey]; 
        if(surveyMappingSpec) {
            console.log("Using mapping specification for survey "+ surveyKey);
            ctxOptions.mapping = new SurveyMapping(surveyMappingSpec);
        }
    }
   
    const context = new HtmlRendererContext(ctxOptions, new BootstrapTheme());

    console.log(context);
    const renderer = new HtmlRenderer();

    // Considering `survey` contains your survey definition
    const doc = renderer.render(survey, context);
    writeFileSync(outputFolder + '/' + survey.surveyDefinition.key + '.html', doc);
}

export function buildDRulesDocument(rules: Expression[], outputFolder:string, name: string, languages?: string[]) {
    // Create a survey context, to tell the renderer how to render (languages to show and css theme)
    const context = new HtmlRendererContext({languages: languages ?? ['en']}, new BootstrapTheme());
    const renderer = new RulesHtmlRenderer();
    // Considering `survey` contains your survey definition
    const doc = renderer.render(rules, context, name);
    writeFileSync(outputFolder + '/' + name + '.html', doc);
}

export function readMappingSpec(file: string): MappingSpec | undefined {
    if(existsSync(file)) {
        const mappingData = readFileSync(file);
        const mappingSpec = JSON.parse(mappingData.toString()) as MappingSpec;
        return mappingSpec;
    }
    return undefined;
}