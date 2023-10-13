import React, { useEffect, useState, useContext } from 'react';
import {
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
	const [options, setOptions] = useState([]);
	const [variant, setVariant] = useState({});

	useEffect(() => {
		getCharacteristics().then((response) => {
			setOptions(response.characteristics);
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

	const handleCharacteristicChange = (characteristic, value) => {
		//Update the Variant
		let v = { ...variant };
		v[characteristic.key] = value;
		setVariant(v);
		// Update Options
		let rules = config.filter((c) => {
			return c.keyOne === characteristic.key && c.valueOne === value;
		});
		if (rules.length) {
			let wipOptions = [...options];
			rules.forEach((rule) => {
				console.log(rule);
				wipOptions.find((option) => {
					return option.key === rule.keyTwo;
				}).allowedValues = rule.allowedValues;
			});
		}
	};

	const form = () => {
		var fields = options.map((c) => {
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
						handleCharacteristicChange(
							characteristic,
							e.target.value
						)
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
						handleCharacteristicChange(
							characteristic,
							e.target.value
						)
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
			<hr />
			<pre>{JSON.stringify(variant, null, 2)}</pre>
		</>
	);
}
