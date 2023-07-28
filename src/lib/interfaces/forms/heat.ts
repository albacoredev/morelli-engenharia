import type { SignatureOwner } from '$lib/firebase/signatures';

type IHeatForm = [
	{
		name: 'meta';
		signatures: { [key in SignatureOwner]: string };
	},
	{
		name: 'header';
		fields: {
			company: string;
			date: string;
			sampleNumber: string;
			valuation: 'Individual' | 'Ambiental' | '';
			methodology: 'NR-15' | 'NHO-06' | '';
		};
	},
	{
		name: 'employeeData';
		fields: {
			name: string;
			function: string;
			sector: string;
			ghe: string;
			epi: string;
			epc: string;
		};
	},
	{
		name: 'equipmentData';
		fields: { brand: string; model: string; serialNumber: string };
	},
	{
		name: 'sampleData';
		fields: {
			climaticConditions: 'Sol' | 'Chuva' | 'Nublado' | '';
			environment: 'Aberto' | 'Fechado' | '';
			ventilation: 'Natural' | 'Forçada' | '';
			enviromentSolarIncidence:
				| 'Inerno ou externo sem carga solar'
				| 'Externo com carga solar'
				| '';
			heatSource: string;
			rest: 'No mesmo local' | 'Outro ambiente' | '';
			activities: 'Leve' | 'Moderada' | 'Pesada' | '';
			temperature?: string;
			humidity?: string;
			wind?: string;
			startingTime: string;
			endingTime: string;
			totalTime: string;
		};
	}
];

export enum HeatFormIndexes {
	meta = 0,
	header = 1,
	employeeData = 2,
	equipmentData = 3,
	sampleData = 4
}

export enum HeatFormLabels {
	company = 'Empresa',
	date = 'Data',
	sampleNumber = 'Número da amostragem',
	valuation = 'Avaliação',
	methodology = 'Metodologia',
	name = 'Nome',
	function = 'Função',
	sector = 'Setor',
	ghe = 'GHE',
	epi = 'EPI',
	epc = 'EPC',
	brand = 'Marca',
	model = 'Modelo',
	serialNumber = 'Número de série',
	climaticConditions = 'Condições climáticas',
	environment = 'Ambiente',
	ventilation = 'Ventilação',
	enviromentSolarIncidence = 'Ambiente',
	heatSource = 'Fonte de calor',
	rest = 'Descanso',
	activities = 'Atividades',
	temperature = 'Temperatura',
	humidity = 'Umidade',
	wind = 'Vento',
	startingTime = 'Hora de início',
	endingTime = 'Hora de término',
	totalTime = 'Tempo total'
}

export enum HeatFormSections {
	employeeData = 'Dados do colaborador',
	equipmentData = 'Características dos Equipamentos de Trabalho',
	sampleData = 'Dados da amostragem'
}

export default IHeatForm;
