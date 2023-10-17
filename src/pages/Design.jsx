import React, { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Grid,
	Link,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@octanner/prism-core';

import { getCharacteristics } from '../api/characteristics.api';
import { getConfiguration } from '../api/configuration.api';

export default function Design() {
	// State
	const [config, setConfig] = useState();
	const [defaultOptions, setDefaultOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [variant, setVariant] = useState({});

	useEffect(() => {
		getCharacteristics().then((response) => {
			setDefaultOptions(
				JSON.parse(JSON.stringify(response.characteristics))
			);
			setFilteredOptions(
				JSON.parse(JSON.stringify(response.characteristics))
			);

			let v = {};
			response.characteristics.forEach((characteristic) => {
				v[characteristic.key] = '';
			});
			setVariant(v);
		});

		getConfiguration().then((response) => {
			setConfig(response.configuration);
		});
	}, []);

	const resetVariant = () => {
		let v = {};
		defaultOptions.forEach((characteristic) => {
			v[characteristic.key] = '';
		});
		setVariant(v);
	};

	const handleCharacteristicChange = (characteristic, event) => {
		//Update the Variant
		let variantCopy = { ...variant };
		variantCopy[characteristic.key] = event.target.value;

		// Update Options
		let optionsCopy = JSON.parse(JSON.stringify(defaultOptions));
		for (const key in variantCopy) {
			let filteredConfig = config.filter((rec) => {
				return rec.key === key && rec.value === variantCopy[key];
			});

			if (filteredConfig.length) {
				filteredConfig.forEach((item) => {
					item.dependencies.forEach((dependency) => {
						if (dependency.type === 'include') {
							dependency.criteria.forEach((c) => {
								optionsCopy.find((option) => {
									return option.key === c.key;
								}).allowedValues = c.values;
							});
						}
						if (dependency.type === 'exclude') {
							dependency.criteria.forEach((c) => {
								c.values.forEach((value) => {
									let newValues = optionsCopy
										.find((option) => {
											return option.key === c.key;
										})
										.allowedValues.filter((allowed) => {
											return allowed !== value;
										});

									optionsCopy.find((option) => {
										return option.key === c.key;
									}).allowedValues = newValues;
								});
							});
						}
					});
				});
			}
		}

		setVariant(variantCopy);
		setFilteredOptions(optionsCopy);
	};

	const form = () => {
		var fields = filteredOptions.map((c) => {
			if (c.allowedValues) {
				return selectField(c);
			} else {
				return textField(c);
			}
		});
		return (
			<Grid container spacing={2} style={{ paddingBottom: '30px' }}>
				{fields}
			</Grid>
		);
	};

	const selectField = (characteristic) => {
		let options = [];
		characteristic.allowedValues.forEach((value) => {
			options.push(
				<MenuItem key={value} value={value}>
					{value}
				</MenuItem>
			);
		});

		return (
			<Grid key={characteristic.key} item xs={4}>
				<Select
					label={characteristic.description}
					value={variant[characteristic.key] || ''}
					fullWidth
					onChange={(e) =>
						handleCharacteristicChange(characteristic, e)
					}
				>
					{options}
				</Select>
			</Grid>
		);
	};

	const textField = (characteristic) => {
		return (
			<Grid key={characteristic.key} item xs={6}>
				<TextField
					label={characteristic.description}
					fullWidth
					onChange={(e) =>
						handleCharacteristicChange(characteristic, e)
					}
				/>
			</Grid>
		);
	};

	return (
		<>
			<Link href='/' variant='button'>
				Home
			</Link>
			<hr />
			<Typography variant='h2' component='h2' gutterBottom>
				KMAT Variant Design-inator
			</Typography>
			{form()}
			<div style={{ textAlign: 'center' }}>
				<Button
					onClick={() => {
						resetVariant();
					}}
				>
					Reset
				</Button>
			</div>

			<hr />
			<Alert>
				<pre>{JSON.stringify(variant, null, 2)}</pre>
			</Alert>
		</>
	);
}
