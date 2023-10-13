import React, { useEffect, useState } from 'react';
import { Grid, MenuItem, Select, TextField } from '@octanner/prism-core';

export default function VariantForm(props) {
	console.log(props);

	const [filtered, setFiltered] = useState([]);

	useEffect(() => {
		setFiltered(props.characteristics);
	}, [props]);

	const handleCharacteristicChange = (characteristic, event) => {
		//Update the Variant
		let v = { ...props.variant };
		v[characteristic.key] = event.target.value;
		props.setVariant(v);

		// Filter Available Options (if required)
		console.log(props.characteristics);
		let f = [...props.characteristics];
		console.log(f);
		let rules = props.configuration.filter((x) => {
			return (
				x.keyOne === characteristic.key &&
				x.valueOne === event.target.value
			);
		});
		if (rules.length > 0) {
			rules.forEach((rule) => {
				f.find(({ key }) => key === rule.keyTwo).allowedValues =
					rule.allowedValues;
			});
		}
		console.log(f);
		setFiltered(f);
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
					value={props.variant[characteristic.key]}
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
	const form = () => {
		var fields = filtered.map((c) => {
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

	return form();
}
