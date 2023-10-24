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
import { getOptions } from '../api/characteristics.api';
import { getConfiguration } from '../api/configuration.api';

export default function Design() {
	// State
	const [config, setConfig] = useState();
	const [defaultOptions, setDefaultOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [variant, setVariant] = useState({});
	const [variantDraft, setVariantDraft] = useState(false);

	useEffect(() => {
		let variantCopy = {};
		getOptions().then((response) => {
			setDefaultOptions(JSON.parse(JSON.stringify(response)));
			setFilteredOptions(JSON.parse(JSON.stringify(response)));

			response.forEach((characteristic) => {
				variantCopy[characteristic.key] = '';
			});
			setVariant(variantCopy);
		});

		getConfiguration().then((response) => {
			setConfig(response.configuration);
		});
	}, []);

	useEffect(() => {
		if (variantDraft) {
			updateOptions();
		}
	}, [config, variant]);

	const handleCharacteristicChange = (characteristic, event) => {
		setVariantDraft(true);
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
		setVariantDraft(false);
		let configCopy = JSON.parse(JSON.stringify(config || []));
		let optionsCopy = JSON.parse(JSON.stringify(defaultOptions || []));
		let variantCopy = JSON.parse(JSON.stringify(variant || []));

		for (const key in variantCopy) {
			let filteredConfig = configCopy.filter((item) => {
				return item.key === key && item.value === variantCopy[key];
			});

			if (filteredConfig.length) {
				filteredConfig.forEach((item) => {
					item.dependencies.forEach((dependency) => {
						if (dependency.type === 'include') {
							dependency.criteria.forEach((c) => {
								let newValues = optionsCopy
									.find((o) => o.key === c.key)
									.allowedValues.filter((allowedValue) =>
										c.values.includes(allowedValue.value)
									);

								optionsCopy.find((option) => {
									return option.key === c.key;
								}).allowedValues = newValues;

								if (newValues.length === 1) {
									let key = optionsCopy.find((o) => {
										return o.key === c.key;
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
										.find((o) => o.key === c.key)
										.allowedValues.filter(
											(allowedValue) =>
												allowedValue.value !== value
										);

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

		configCopy.forEach((c) => {
			c.dependencies.forEach((d) => {
				if (d.type === 'allowedIf') {
					let allowed = true;
					d.criteria.forEach((item) => {
						allowed =
							item.values.includes(variantCopy[item.key]) &&
							allowed;
					});

					if (!allowed) {
						let newValues = optionsCopy
							.find((o) => o.key === c.key)
							.allowedValues.filter(
								(allowedValue) => allowedValue.value !== c.value
							);
						optionsCopy.find((option) => {
							return option.key === c.key;
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
		characteristic.allowedValues.forEach((x) => {
			options.push(
				<MenuItem key={x.value} value={x.value}>
					{x.description}
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
