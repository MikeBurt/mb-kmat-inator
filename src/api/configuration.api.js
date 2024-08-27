export const getConfiguration = async () => {
	return {
		configuration: [
			{
				description:
					'Material of `ACRYLIC` allows Shapes `SQUARE`, `HEART`, & `STAR`',
				key: 'PROFILE_MATERIAL',
				value: 'ACRYLIC',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'PROFILE_SHAPE',
								values: ['SQUARE', 'HEART', 'STAR'],
							},
						],
					},
				],
			},
			{
				description:
					'Material of `ALUMINUM` allows ONLY Shape `CIRCLE`',
				key: 'PROFILE_MATERIAL',
				value: 'ALUMINUM',
				dependencies: [
					{
						type: 'include',
						criteria: [
							{
								key: 'PROFILE_SHAPE',
								values: ['CIRCLE'],
							},
						],
					},
				],
			},
			{
				description:
					'Material of `CONCRETE` allows all Shapes EXCEPT `STAR`',
				key: 'PROFILE_MATERIAL',
				value: 'CONCRETE',
				dependencies: [
					{
						type: 'exclude',
						criteria: [
							{
								key: 'PROFILE_SHAPE',
								values: ['STAR'],
							},
						],
					},
				],
			},
			{
				description:
					'Shape of `HORSESHOE` is allowed ONLY when Material is `WOOD`',
				key: 'PROFILE_SHAPE',
				value: 'HORSESHOE',
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
			{
				description:
					'`Wood Type` Options are allowed ONLY when Material is `Wood`',
				key: 'PROFILE_WOOD_TYPE',
				value: '',
				dependencies: [
					{
						type: 'optionIf',
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
			// {
			// 	key: 'PROTO_X',
			// 	value: 'FAKE',
			// 	dependencies: [
			// 		{
			// 			type: 'include',
			// 			criteria: [
			// 				{
			// 					key: 'PROTO_A',
			// 					values: ['1', '2', '3'],
			// 				},
			// 			],
			// 		},
			// 		{
			// 			type: 'exclude',
			// 			criteria: [
			// 				{
			// 					key: 'PROTO_B',
			// 					values: ['4', '5', '6'],
			// 				},
			// 			],
			// 		},
			// 		{
			// 			type: 'allowedIf',
			// 			criteria: [
			// 				{
			// 					key: 'PROTO_C',
			// 					values: ['7', '8', '9'],
			// 				},
			// 				{
			// 					key: 'PROTO_D',
			// 					values: ['7', '8', '9'],
			// 				},
			// 			],
			// 		},
			// 		{
			// 			type: '???',
			// 			criteria: [
			// 				{
			// 					key: 'PROTO_E',
			// 					values: ['10'],
			// 				},
			// 			],
			// 		},
			// 	],
			// },
		],
	};
};
