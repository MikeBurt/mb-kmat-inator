import { createContext } from 'react';

const ConfigurationContext = createContext({
	Configuration: undefined,
	setConfiguration: (_configuration) => {},
});

export default ConfigurationContext;
