import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Index from './pages/Index';
import Design from './pages/Design';
import Configure from './pages/Configure';
import NotFound from './pages/NotFound';

const Main = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route exact path='/' element={<Index />} />
					<Route exact path='/design' element={<Design />} />
					<Route exact path='/configure' element={<Configure />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</Layout>
		</Router>
	);
};

export default Main;
