import React from 'react';
import { Link, Typography } from '@octanner/prism-core';

export default function Design() {
	return (
		<>
			<Link href='/' variant='button'>
				Home
			</Link>
			<hr />
			<Typography variant='h2' component='h2' gutterBottom>
				Characteristic Configurator-inator
			</Typography>
		</>
	);
}
