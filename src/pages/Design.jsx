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
			setDefaultOptions(response.characteristics);
			setFilteredOptions(response.characteristics);
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
		let v = { ...variant };
		v[characteristic.key] = event.target.value;
		setVariant(v);

		// Update Options
		let rules = config.filter((c) => {
			return (
				c.keyOne === characteristic.key &&
				c.valueOne === event.target.value
			);
		});
		if (rules.length) {
			let wipOptions = [...defaultOptions];
			rules.forEach((rule) => {
				console.log(rule);
				wipOptions.find((option) => {
					return option.key === rule.keyTwo;
				}).allowedValues = rule.allowedValues;
			});
			setFilteredOptions(wipOptions);
		}
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
					disabled={variant[characteristic.key] !== ''}
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
