import { createContext } from 'react';

const CharacteristicsContext = createContext({
	Characteristics: undefined,
	setCharacteristics: (_characteristics) => {},
});

export default CharacteristicsContext;
