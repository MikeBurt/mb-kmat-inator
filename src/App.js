import React, { useEffect, useState } from 'react';
import Main from './Main';
import './App.css';
import CharacteristicsContext from './services/characteristicsContext';
import ConfigurationContext from './services/configurationContext';
import { getCharacteristics } from './api/characteristics.api';
import { getConfiguration } from './api/configuration.api';

const App = () => {
	const [characteristics, setCharacteristics] = useState([]);
	const [configuration, setConfiguration] = useState([]);

	useEffect(() => {
		getCharacteristics().then((response) => {
			setCharacteristics(response.characteristics);
		});

		getConfiguration().then((response) => {
			setConfiguration(response.configuration);
		});
	}, []);

	if (characteristics.length && configuration.length) {
		return (
			<CharacteristicsContext.Provider
				value={{
					characteristics: characteristics,
					set: setCharacteristics,
				}}
			>
				<ConfigurationContext.Provider
					value={{
						configuration: configuration,
						set: setConfiguration,
					}}
				>
					<Main />
				</ConfigurationContext.Provider>
			</CharacteristicsContext.Provider>
		);
	}
};

export default App;
