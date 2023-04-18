export default interface IHeatForm {
	company: string;
	date: string;
	sampleNumber: string;
	valuation: 'Individual' | 'Ambiental' | '';
	methodology: 'NR-15' | 'NHO-06' | '';
	name: string;
	function: string;
	sector: string;
	ghe: string;
	epi: string;
	epc: string;
	brand: string;
	model: string;
	serialNumber: string;
	climaticConditions: 'Sol' | 'Chuva' | 'Nublado' | '';
	environment: 'Aberto' | 'Fechado' | '';
	ventilation: 'Natural' | 'Forçada' | '';
	enviromentSolarIncidence: 'Inerno ou externo sem carga solar' | 'Externo com carga solar' | '';
	heatSource: string;
	rest: 'No mesmo local' | 'Outro ambiente' | '';
	activities: 'Leve' | 'Moderada' | 'Pesada' | '';
	temperature?: string;
	humidity?: string;
	wind?: string;
	startingTime: string;
	endingTime: string;
	totalTime: string;
}
