import type { SignatureOwner } from '$lib/firebase/signatures';
import type { Timestamp } from 'firebase/firestore';
import type { EValuationTypesDisplayName } from './common';

export enum EConservationOptions {
	EXCELENT = 'Excelente',
	GOOD = 'Bom',
	BAD = 'Ruim'
}

export enum EPhysicalStressOptions {
	YES = 'Sim',
	NO = 'Não'
}

export enum EWorkerPostureOptions {
	ADEQUATED = 'Adequado',
	INADEQUATED = 'Inadequado'
}

export enum ERoutineActivityOptions {
	YES = 'Sim',
	NO = 'Não'
}

export interface IVibrationForm {
	signatures: { [key in SignatureOwner]: string };
	type: keyof typeof EValuationTypesDisplayName;
	company: string;
	date: Timestamp;
	sampleNumber: string;
	name: string;
	function: string;
	sector: string;
	ghe: string;
	manufacturer: string;
	year: string;
	conservation: EConservationOptions;
	avgSpeed: string;
	vibrationLevels: string;
	transportedCargo: string;
	brand: string;
	model: string;
	serialNumber: string;
	startingTime: string;
	endingTime: string;
	totalTime: string;
	physicalStress: EPhysicalStressOptions;
	workerPosture: EWorkerPostureOptions;
	surfaceType: string;
	aggravatingCondition: string;
	routineActivity: ERoutineActivityOptions;
	estimatedExposureTime: string;
	activities: string;
}

export type TVibrationValuationPDFSections = {
	[key: string]: Array<keyof IVibrationForm>;
};

export const vibrationSections: TVibrationValuationPDFSections = {
	header: ['company', 'date', 'sampleNumber'],
	'Dados do Colaborador': ['name', 'function', 'sector', 'ghe'],
	'Características das Máquinas/Veículos/Ferramentas/Equipamentos de Trabalho': [
		'manufacturer',
		'year',
		'conservation',
		'avgSpeed',
		'vibrationLevels',
		'transportedCargo'
	],
	'Dados do Aparelho de Medição': ['brand', 'model', 'serialNumber'],
	'Dados da Amostragem': [
		'startingTime',
		'endingTime',
		'totalTime',
		'physicalStress',
		'workerPosture',
		'surfaceType',
		'aggravatingCondition',
		'routineActivity',
		'estimatedExposureTime',
		'activities'
	]
};

type TVibrationLabels = {
	[key in keyof IVibrationForm]: string;
};

export const vibrationLabels: Omit<TVibrationLabels, 'signatures' | 'type'> = {
	company: 'Empresa',
	date: 'Data',
	sampleNumber: 'Número da Amostragem',
	name: 'Nome',
	function: 'Função',
	sector: 'Setor',
	ghe: 'GHE',
	manufacturer: 'Fabricante/Marca',
	year: 'Ano/Modelo',
	conservation: 'Estado de Conservação',
	avgSpeed: 'Velocidade Média de Operação',
	vibrationLevels: 'Nível de Vibração Fornecidas Pelo Fabricante',
	transportedCargo: 'Cargas Transportadas',
	brand: 'Marca Ap.',
	model: 'Modelo Ap.',
	serialNumber: 'Número de Série Ap.',
	startingTime: 'Hora Inicial',
	endingTime: 'Hora Final',
	totalTime: 'Tempo total',
	physicalStress: 'Esforço Físico',
	workerPosture: 'Aspecto Postural do Colaborador Adequado',
	surfaceType: 'Tipo de Superfície',
	aggravatingCondition: 'Condições que Agrave a Exposição',
	routineActivity: 'Atividade Rotineira',
	estimatedExposureTime: 'Estimativa de Tempo da Exposição Diária',
	activities: 'Descrição das Atividades Realizadas'
};
