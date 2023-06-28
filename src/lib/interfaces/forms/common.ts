import { HeatFormIndexes, HeatFormLabels, HeatFormSections } from './heat';

export type ValuationTypes = 'heat' | 'noise' | 'vibration' | 'chemicalAgents';

export enum ValuationTypesDisplayName {
	heat = 'Calor',
	noise = 'Ruído',
	vibration = 'Vibração',
	chemicalAgents = 'Agentes Químicos'
}

export const FormIndexes = {
	heat: HeatFormIndexes
};

export const FormLabels = {
	heat: HeatFormLabels
};

export const FormSections = {
	heat: HeatFormSections
};
