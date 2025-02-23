import { Study } from "case-editor-tools/types/study";

export interface ExporterPlugin {
    export: (study: Study, output: string, languages?: string[])=>void
}