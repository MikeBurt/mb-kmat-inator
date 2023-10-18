import React, { useEffect, useState } from 'react';
import { Alert, Button, Grid, Link, MenuItem, Select, TextField, Typography } from '@octanner/prism-core';
import { getCharacteristics } from '../api/characteristics.api';
import { getConfiguration } from '../api/configuration.api';

export default function Design() {
	// State
	const [config, setConfig] = useState();
	const [defaultOptions, setDefaultOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [variant, setVariant] = useState({});

	useEffect(() => {
		let variantCopy = {};
		getCharacteristics().then((response) => {
			setDefaultOptions(JSON.parse(JSON.stringify(response.characteristics)));
			setFilteredOptions(JSON.parse(JSON.stringify(response.characteristics)));

			response.characteristics.forEach((characteristic) => {
				variantCopy[characteristic.key] = '';
			});
			setVariant(variantCopy);
		});

		getConfiguration().then((response) => {
			setConfig(response.configuration);
		});
	}, []);

	useEffect(() => {
		updateOptions();
	}, [config, variant]);

	const handleCharacteristicChange = (characteristic, event) => {
		let variantCopy = { ...variant };
		variantCopy[characteristic.key] = event.target.value;
		setVariant(variantCopy);
	};

	const resetVariant = () => {
		let v = {};
		defaultOptions.forEach((characteristic) => {
			v[characteristic.key] = '';
		});
		setVariant(v);
	};

	const updateOptions = () => {
		let configCopy = JSON.parse(JSON.stringify(config || []));
		let optionsCopy = JSON.parse(JSON.stringify(defaultOptions || []));
		let variantCopy = JSON.parse(JSON.stringify(variant || []));

		for (const key in variantCopy) {
			let filteredConfig = configCopy.filter((rec) => {
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

								if (c.values.length === 1) {
									let key = optionsCopy.find((option) => {
										return option.key === c.key;
									}).key;
									variantCopy[key] = c.values[0];
									setVariant(variantCopy);
								}
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

		configCopy.forEach((config) => {
			config.dependencies.forEach((dependency) => {
				if (dependency.type === 'allowedIf') {
					let allowed = true;
					dependency.criteria.forEach((rec) => {
						allowed = rec.values.includes(variantCopy[rec.key]) && allowed;
					});
					if (!allowed) {
						let newValues = optionsCopy
							.find((option) => {
								return option.key === config.key;
							})
							.allowedValues.filter((allowedValue) => {
								return allowedValue !== config.value;
							});

						optionsCopy.find((option) => {
							return option.key === config.key;
						}).allowedValues = newValues;
					}
				}
			});
		});

		setFilteredOptions(optionsCopy);
	};

	// Components
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
				<Select label={characteristic.description} value={variant[characteristic.key] || ''} fullWidth onChange={(e) => handleCharacteristicChange(characteristic, e)}>
					{options}
				</Select>
			</Grid>
		);
	};

	const textField = (characteristic) => {
		return (
			<Grid key={characteristic.key} item xs={6}>
				<TextField label={characteristic.description} fullWidth onChange={(e) => handleCharacteristicChange(characteristic, e)} />
			</Grid>
		);
	};

	return (
		<>
			<Link href="/" variant="button">
				Home
			</Link>
			<hr />
			<Typography variant="h2" component="h2" gutterBottom>
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
