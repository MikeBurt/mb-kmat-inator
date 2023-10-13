export const getCharacteristics = async () => {
	return {
		characteristics: [
			{
				key: 'MTRL',
				description: 'Material',
				allowedValues: ['Acrylic', 'Aluminum', 'Concrete', 'Wood'],
				required: true,
			},
			{
				key: 'SHP',
				description: 'Shape',
				allowedValues: ['Circle', 'Square', 'One', 'Five', 'Ten'],
			},
			{
				key: 'FNT',
				description: 'Font',
				allowedValues: ['Arial', 'Helvetica', 'Times New Roman'],
			},
			{
				key: 'BCKIMG',
				description: 'Back Image',
			},
			{
				key: 'FRNTIMG',
				description: 'Front Image',
			},
		],
	};
};
