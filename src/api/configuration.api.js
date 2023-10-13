export const getConfiguration = async () => {
	return {
		configuration: [
			// Material 'Aluminum' allows Shapes 'One', 'Five', & 'Ten'
			{
				keyOne: 'MTRL',
				valueOne: 'Aluminum',
				keyTwo: 'SHP',
				allowedValues: ['One', 'Five', 'Ten'],
			},
			// Material 'Wood' only allows Font 'Arial'
			{
				keyOne: 'MTRL',
				valueOne: 'Wood',
				keyTwo: 'FNT',
				allowedValues: ['Arial'],
			},
			// Material 'Concrete' allows all 'Shape' EXCEPT 'Ten'
			// Font 'Times New Roman' is only allowed on Aluminum Circles
		],
	};
};
