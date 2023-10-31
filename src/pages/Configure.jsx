import React, { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Card,
	CardContent,
	Grid,
	Link,
	Modal,
	Tag,
	Typography,
} from '@octanner/prism-core';
import NewConfigModal from '../components/NewConfigModal';
import { getConfiguration } from '../api/configuration.api';

export default function Design() {
	// State
	const [config, setConfig] = useState([]);
	const [activeConfig, setActiveConfig] = useState({});
	const [open, setOpen] = useState(false);

	useEffect(() => {
		getConfiguration().then((response) => {
			setConfig(response.configuration);
		});
	}, []);

	const toggleModal = () => {
		setOpen(!open);
	};

	// Components
	const display = () => {
		if (config.length) {
			let display = config.map((c, i) => {
				return <div key={i}>{card(c, i)}</div>;
			});

			return display;
		}
	};

	const card = (data) => {
		let dependencies = data.dependencies.map((d, i) => {
			let criteria = d.criteria.map((c, i) => {
				let values = c.values.join(', ');
				return (
					<span key={i} style={{ marginRight: '20px' }}>
						<i>{c.key}</i>: <b>{values}</b>
					</span>
				);
			});

			let color;
			switch (d.type) {
				case 'include':
					color = 'success';
					break;
				case 'exclude':
					color = 'error';
					break;
				case 'allowedIf':
				case 'optionIf':
					color = 'warning';
					break;
				default:
					color = 'archived';
			}

			return (
				<React.Fragment key={i}>
					<Grid item xs={11} style={{ marginLeft: '20px' }}>
						<Tag variant={color} style={{ marginBottom: '10px' }}>
							{d.type}
						</Tag>{' '}
						{criteria}
					</Grid>
				</React.Fragment>
			);
		});

		return (
			<Card key={data.key} style={{ marginBottom: '10px' }}>
				<CardContent>
					<Grid container>
						<Grid item xs={12} style={{ marginBottom: '10px' }}>
							<i>{data.key}</i>: <b>{data.value}</b>
						</Grid>
						{dependencies}
					</Grid>
					<Button
						onClick={() => {
							setActiveConfig(data);
							toggleModal();
						}}
					>
						Show Raw Data
					</Button>
				</CardContent>
			</Card>
		);
	};

	const modal = () => {
		return (
			<Modal open={open} onClose={toggleModal}>
				<Alert severity='info' style={{ marginBottom: '30px' }}>
					<pre>{JSON.stringify(activeConfig, null, 2)}</pre>
				</Alert>
			</Modal>
		);
	};

	return (
		<>
			<Link href='/' variant='button'>
				Home
			</Link>
			<hr />
			<Typography variant='h2' component='h2' gutterBottom>
				Characteristic Configurator-inator
			</Typography>
			<NewConfigModal config={config} setConfig={setConfig} />
			{display()}
			{modal()}
		</>
	);
}
