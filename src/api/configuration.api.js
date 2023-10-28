export const getConfiguration = async () => {
	return {
		configuration: [
			// Material 'ACRYLIC' allows Shapes '2', '3', & '4'
			{
				key: 'PROFILE_MATERIAL',
				value: 'ACRYLIC',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'PROFILE_SHAPE',
								values: ['2', '3', '4'],
							},
						],
					},
				],
			},
			// Material 'ALUMINUM' allows ONLY Shape '1'
			{
				key: 'PROFILE_MATERIAL',
				value: 'ALUMINUM',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'PROFILE_SHAPE',
								values: ['1'],
							},
						],
					},
				],
			},
			// Material 'Concrete' allows all 'Shape' EXCEPT '4'
			{
				key: 'PROFILE_MATERIAL',
				value: 'CONCRETE',
				dependencies: [
					{
						type: 'exclude',
						criteria: [
							{
								key: 'PROFILE_SHAPE',
								values: ['4'],
							},
						],
					},
				],
			},
			// Shape '5' is only allowed with Material 'Wood'
			{
				key: 'PROFILE_SHAPE',
				value: '5',
				dependencies: [
					{
						type: 'allowedIf',
						criteria: [
							{
								key: 'PROFILE_MATERIAL',
								values: ['WOOD'],
							},
						],
					},
				],
			},
			// FAKE
			{
				key: 'PROTO_X',
				value: 'FAKE',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'PROTO_A',
								values: ['1', '2', '3'],
							},
						],
					},
					{
						type: 'exclude',
						criteria: [
							{
								key: 'PROTO_B',
								values: ['4', '5', '6'],
							},
						],
					},
					{
						type: 'allowedIf',
						criteria: [
							{
								key: 'PROTO_C',
								values: ['7', '8', '9'],
							},
							{
								key: 'PROTO_D',
								values: ['7', '8', '9'],
							},
						],
					},
					{
						type: '???',
						criteria: [
							{
								key: 'PROTO_E',
								values: ['10'],
							},
						],
					},
				],
			},
		],
	};
};
