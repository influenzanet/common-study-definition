import { CommonStudyBuilder } from "./studies/common";
import { buildMissing, study_exporter } from "./tools/exporter";

const builder = new CommonStudyBuilder();

builder.build();

const study = builder.getStudy();

study_exporter([study], true);

buildMissing('./output/common');
