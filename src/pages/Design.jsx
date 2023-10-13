import React, { useEffect, useState, useContext } from 'react';
import {
	Grid,
	Link,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@octanner/prism-core';
import CharacteristicsContext from '../services/characteristicsContext';

export default function Design() {
	// Context
	const characteristicsContext = useContext(CharacteristicsContext);

	// State
	const [options] = useState(characteristicsContext.characteristics);
	const [variant, setVariant] = useState({});

	useEffect(() => {
		let v = {};
		characteristicsContext.characteristics.forEach((characteristic) => {
			v[characteristic.key] = '';
		});
		setVariant(v);
	}, []);

	const handleCharacteristicChange = (characteristic, event) => {
		//Update the Variant
		let v = { ...variant };
		v[characteristic.key] = event.target.value;
		setVariant(v);
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
			<hr />
			<pre>{JSON.stringify(variant, null, 2)}</pre>
		</>
	);
}
