import { heatLabels, heatSections, type IHeatForm } from '$lib/interfaces/forms/heat';
import jsPDF from 'jspdf';
import encondedImage from '$lib/images/morelli_logo.json';
import { EValuationTypesDisplayName } from '$lib/interfaces/forms/common';

const logoWidth = 58;
const logoHeight = 16;
const xMargin = 10;
const yMargin = 10;
const textGap = 1.75;

export const generatePdf = (valuation: IHeatForm) => {
	const doc = new jsPDF();

	const form = { ...valuation, date: valuation.date.toDate().toLocaleDateString('pt-BR') };

	let fontSize = 15;
	const lineHeight = fontSize * 0.3;

	const changeFontSize = (newSize: number) => {
		doc.setFontSize(newSize);
		fontSize = newSize;
	};

	const trimText = (text: string, maxWidth: number) => {
		if (doc.getTextWidth(text) > maxWidth) {
			return doc.splitTextToSize(text, maxWidth)[0];
		} else {
			return text;
		}
	};

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const headerHeight = lineHeight * 6 + yMargin + textGap * 5;
	const maxHeaderTextWidth = pageWidth - logoWidth - xMargin * 2;
	const maxBodyTextWidth = pageWidth - xMargin * 2;

	const headerFields = (heatSections['header'] as Array<keyof typeof form>).map((field) => {
		const fieldValue = form[field] as string;

		return trimText(fieldValue, maxHeaderTextWidth);
	});

	headerFields.unshift(`Avaliação Quantitativa de ${EValuationTypesDisplayName[form.type]}`);

	doc.setFillColor(214, 211, 209);
	doc.rect(0, 0, pageWidth, headerHeight, 'F');

	headerFields.forEach((field, index) => {
		doc.text(field, xMargin, yMargin + (lineHeight + textGap) * index);
	});

	doc.addImage({
		imageData: encondedImage.base64,
		x: pageWidth - logoWidth - xMargin,
		y: yMargin,
		width: logoWidth,
		height: logoHeight
	});

	const sectionMarginTop = 10;
	const fieldMarginTop = 2;
	const lineGap = 5;

	let previousHeight = headerHeight;

	Object.keys(heatSections).forEach((key) => {
		const section = key as keyof typeof heatSections;

		if (section === 'header') return;

		fontSize === 10 && changeFontSize(15);

		const fields = heatSections[section];
		const sectionNameWidth = doc.getTextWidth(key);

		doc.text(key, xMargin, previousHeight + lineHeight + sectionMarginTop);
		doc.setLineWidth(0.5);
		doc.line(
			sectionNameWidth + xMargin + lineGap,
			previousHeight + lineHeight + sectionMarginTop,
			pageWidth - xMargin,
			previousHeight + lineHeight + sectionMarginTop
		);

		previousHeight += lineHeight + sectionMarginTop;

		changeFontSize(10);

		fields.forEach((field) => {
			const fieldText = trimText(
				`${heatLabels[field as keyof typeof heatLabels]}: ${String(form[field])}`,
				maxBodyTextWidth
			);
			doc.text(fieldText, xMargin, previousHeight + lineHeight + fieldMarginTop);
			previousHeight += lineHeight + fieldMarginTop;
		});
	});

	const { evalueted: evaluatedSignature, evaluator: evaluatorSignature } = form.signatures;

	if (evaluatorSignature != '') {
		doc.addImage({
			imageData: evaluatorSignature,
			x: xMargin,
			y: pageHeight - 44 - lineHeight,
			width: 80,
			height: 30
		});
	}

	doc.text(
		'Responsável Técnico avaliador',
		(80 - doc.getTextWidth('Responsável Técnico avaliador')) / 2 + xMargin,
		pageHeight - lineHeight
	);

	if (evaluatedSignature != '') {
		doc.addImage({
			imageData: evaluatedSignature,
			x: pageWidth - xMargin - 80,
			y: pageHeight - 44 - lineHeight,
			width: 80,
			height: 30
		});
	}

	doc.text(
		'Colaborador Avaliado',
		pageWidth - xMargin - 80 + (80 - doc.getTextWidth('Colaborador Avaliado')) / 2,
		pageHeight - lineHeight
	);

	const blob = doc.output('blob');
	const url = URL.createObjectURL(blob);

	return url;
};
