import type IHeatForm from '$lib/interfaces/forms/heat';
import jsPDF from 'jspdf';
import encondedImage from '$lib/images/morelli_logo.json';
import {
	FormIndexes,
	FormLabels,
	FormSections,
	type ValuationTypes
} from '$lib/interfaces/forms/common';

const logoWidth = 58;
const logoHeight = 16;
const xMargin = 10;
const yMargin = 10;
const textGap = 1.75;

export const generatePdf = (form: IHeatForm, type: ValuationTypes) => {
	console.log(form[0].signatures);

	const formLabels = FormLabels[type as keyof typeof FormLabels];
	const formSections = FormSections[type as keyof typeof FormSections];
	const formIndexes = FormIndexes[type as keyof typeof FormIndexes];

	const doc = new jsPDF();

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

	const headerFields = Object.values(form[formIndexes.header].fields).map((value) =>
		trimText(value, maxHeaderTextWidth)
	);

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

	form.forEach((section, index) => {
		if (section.name === 'meta' || section.name === 'header') return;

		fontSize === 10 && changeFontSize(15);

		const name = trimText(formSections[section.name], maxBodyTextWidth);
		const fields = section.fields;

		const sectionNameWidth = doc.getTextWidth(name);

		doc.text(name, xMargin, previousHeight + lineHeight + sectionMarginTop);
		doc.setLineWidth(0.5);
		doc.line(
			sectionNameWidth + xMargin + lineGap,
			previousHeight + lineHeight + sectionMarginTop,
			pageWidth - xMargin,
			previousHeight + lineHeight + sectionMarginTop
		);

		previousHeight += lineHeight + sectionMarginTop;

		changeFontSize(10);

		Object.keys(fields).forEach((field) => {
			const formLabelsIndex = field as keyof typeof formLabels;
			const formFieldsIndex = field as keyof typeof fields;

			const fieldText = trimText(
				`${formLabels[formLabelsIndex]}: ${form[index].fields[formFieldsIndex]}`,
				maxBodyTextWidth
			);
			doc.text(fieldText, xMargin, previousHeight + lineHeight + fieldMarginTop);
			previousHeight += lineHeight + fieldMarginTop;
		});
	});

	const { evalueted: evaluatedSignature, evaluator: evaluatorSignature } =
		form[FormIndexes.heat.meta].signatures;

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

	// doc.save(
	// 	`${ValuationTypesDisplayName[type]}_${currentUserDisplayName}_${
	// 		form[FormIndexes[type as keyof typeof FormIndexes].header].fields.company
	// 	}`
	// );

	const blob = doc.output('blob');

	// Create a URL for the Blob
	const url = URL.createObjectURL(blob);

	return url;
};
