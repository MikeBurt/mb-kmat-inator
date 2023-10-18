export const getConfiguration = async () => {
	return {
		configuration: [
			// Material 'Aluminum' allows Shapes 'One', 'Five', & 'Ten'
			{
				key: 'MTRL',
				value: 'Aluminum',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'SHP',
								values: ['One', 'Five', 'Ten'],
							},
						],
					},
				],
			},
			// Material 'Wood' allows Font 'Arial'
			{
				key: 'MTRL',
				value: 'Wood',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'FNT',
								values: ['Arial'],
							},
						],
					},
				],
			},
			// Material 'Concrete' allows all 'Shape' EXCEPT 'Ten'
			{
				key: 'MTRL',
				value: 'Concrete',
				dependencies: [
					{
						type: 'exclude',
						criteria: [
							{
								key: 'SHP',
								values: ['Ten'],
							},
						],
					},
				],
			},
			// Font 'Times New Roman' is only allowed on Aluminum One
			{
				key: 'FNT',
				value: 'Times New Roman',
				dependencies: [
					{
						type: 'allowedIf',
						criteria: [
							{ key: 'MTRL', values: ['Aluminum'] },
							{ key: 'SHP', values: ['One'] },
						],
					},
				],
			},
		],
	};
};
