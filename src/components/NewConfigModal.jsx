import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	CardContent,
	Grid,
	MenuItem,
	Modal,
	MultiSelectionButtons,
	Select,
	SelectionButton,
	Typography,
} from '@octanner/prism-core';
import { getOptions } from '../api/characteristics.api';

export default function NewConfigModal(props) {
	// State
	const [fullOptions, setFullOptions] = useState([]);
	const [keyOptions, setKeyOptions] = useState([]);
	const [newConfig, setNewConfig] = useState({
		key: '',
		value: '',
		dependencies: [
			{
				type: '',
				criteria: [
					{
						key: '',
						values: [],
					},
				],
			},
		],
	});
	const [open, setOpen] = useState(false);

	useEffect(() => {
		let options = [];
		getOptions().then((response) => {
			setFullOptions(response);
			response.forEach((x) => {
				options.push({ label: x.description, value: x.key });
			});
			setKeyOptions(options);
		});
	}, []);

	const toggleModal = () => {
		setOpen(!open);
	};

	// Components
	const form = () => {
		let dependencyForms = newConfig.dependencies.map((x, i) => {
			return dependencyForm(x, i);
		});
		return (
			<>
				<Typography variant='h2' component='h2' gutterBottom>
					New Config Rule Build-inator
				</Typography>

				<Grid container>
					<Grid item xs={6}>
						{keySelect()}
					</Grid>
					<Grid item xs={6}>
						{valueSelect()}
					</Grid>
				</Grid>
				<hr />
				{dependencyForms}
				{addDependencyButton()}
				{saveButton()}
			</>
		);
	};

	const dependencyForm = (data, index) => {
		let criteriaForms = data.criteria.map((x, i) => {
			return criteriaForm(x, i, index);
		});
		let form = (
			<Card
				key={index}
				style={{ marginTop: '10px', marginBottom: '10px' }}
			>
				<CardContent>
					<p>Dependency Form {index}</p>
					{dependencyTypeSelect(index)}
					{criteriaForms}
					{addCriteriaButton(index)}
				</CardContent>
			</Card>
		);

		return form;
	};

	const criteriaForm = (data, index, dependencyIndex) => {
		let form = (
			<Card key={index} style={{ marginBottom: '10px' }}>
				<CardContent>
					<p>
						Criteria Form {dependencyIndex}.{index}
					</p>
					{criteriaKeySelect(index, dependencyIndex)}
					{criteriaValueMultiSelectButtons(index, dependencyIndex)}
				</CardContent>
			</Card>
		);

		return form;
	};

	const keySelect = () => {
		let items = [];
		keyOptions.forEach((x) => {
			items.push(
				<MenuItem key={x.value} value={x.value}>
					{x.label}
				</MenuItem>
			);
		});
		return (
			<Select
				label='Characteristic'
				value={newConfig.key}
				fullWidth
				onChange={(e) => {
					let copy = { ...newConfig };
					copy.key = e.target.value;
					setNewConfig(copy);
				}}
			>
				{items}
			</Select>
		);
	};

	const valueSelect = () => {
		let options = [];
		let items = [];

		fullOptions
			.find((x) => x.key === newConfig.key)
			?.allowedValues.forEach((y) => {
				options.push({ value: y.value, label: y.description });
			});

		options.forEach((x) => {
			items.push(
				<MenuItem key={x.value} value={x.value}>
					{x.label}
				</MenuItem>
			);
		});

		return (
			<Select
				label='Value'
				value={newConfig.value}
				fullWidth
				onChange={(e) => {
					let copy = { ...newConfig };
					copy.value = e.target.value;
					setNewConfig(copy);
				}}
			>
				{items}
			</Select>
		);
	};

	const dependencyTypeSelect = (dependencyIndex) => {
		let options = [
			{ value: 'include', label: 'Include' },
			{ value: 'exclude', label: 'Exclude' },
			{ value: 'allowedIf', label: 'Allow If' },
			{ value: 'optionIf', label: 'Option If' },
		];
		let items = [];

		options.forEach((x) => {
			items.push(
				<MenuItem key={x.value} value={x.value}>
					{x.label}
				</MenuItem>
			);
		});

		return (
			<Select
				label='Dependency Type'
				value={newConfig.dependencies[dependencyIndex].type}
				fullWidth
				onChange={(e) => {
					let copy = { ...newConfig };
					copy.dependencies[dependencyIndex].type = e.target.value;
					setNewConfig(copy);
				}}
			>
				{items}
			</Select>
		);
	};

	const criteriaKeySelect = (criteriaIndex, dependencyIndex) => {
		let items = [];

		keyOptions.forEach((x) => {
			items.push(
				<MenuItem key={x.value} value={x.value}>
					{x.label}
				</MenuItem>
			);
		});

		return (
			<Select
				label='Criteria Characteristic'
				value={
					newConfig.dependencies[dependencyIndex].criteria[
						criteriaIndex
					].key
				}
				fullWidth
				onChange={(e) => {
					let copy = { ...newConfig };
					copy.dependencies[dependencyIndex].criteria[
						criteriaIndex
					].key = e.target.value;
					setNewConfig(copy);
				}}
			>
				{items}
			</Select>
		);
	};

	const criteriaValueMultiSelectButtons = (
		criteriaIndex,
		dependencyIndex
	) => {
		let options = [];
		let items = [];

		fullOptions
			.find(
				(x) =>
					x.key ===
					newConfig.dependencies[dependencyIndex].criteria[
						criteriaIndex
					].key
			)
			?.allowedValues.forEach((y) => {
				options.push({ value: y.value, label: y.description });
			});

		options.forEach((x) => {
			items.push(
				<SelectionButton key={x.value} value={x.value}>
					{x.label}
				</SelectionButton>
			);
		});

		return (
			<MultiSelectionButtons
				value={
					newConfig.dependencies[dependencyIndex].criteria[
						criteriaIndex
					].values
				}
				onChange={(e) => {
					let copy = { ...newConfig };
					copy.dependencies[dependencyIndex].criteria[
						criteriaIndex
					].values = e;
					setNewConfig(copy);
				}}
				style={{ padding: '10px' }}
			>
				{items}
			</MultiSelectionButtons>
		);
	};

	const addDependencyButton = () => {
		return (
			<Button
				onClick={() => {
					let copy = { ...newConfig };
					copy.dependencies.push({
						type: '',
						criteria: [
							{
								key: '',
								values: [],
							},
						],
					});
					setNewConfig(copy);
				}}
			>
				Add Dependency
			</Button>
		);
	};

	const addCriteriaButton = (dependencyIndex) => {
		return (
			<Button
				onClick={() => {
					let copy = { ...newConfig };
					copy.dependencies[dependencyIndex].criteria.push({
						key: '',
						values: [],
					});
					setNewConfig(copy);
				}}
			>
				Add Criteria
			</Button>
		);
	};

	const saveButton = () => {
		return (
			<Button
				onClick={() => {
					let copy = [...props.config];
					copy.push(newConfig);

					props.setConfig(copy);
					toggleModal();
				}}
			>
				Save
			</Button>
		);
	};
	return (
		<>
			<div style={{ textAlign: 'center' }}>
				<Button onClick={toggleModal}>Add New</Button>
			</div>
			<Modal open={open} onClose={toggleModal} fullScreen>
				{form()}
			</Modal>
		</>
	);
}
