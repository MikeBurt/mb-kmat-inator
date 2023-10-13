import { Grid, Link, Typography } from '@octanner/prism-core';

export default function Index() {
	return (
		<div style={{ textAlign: 'center' }}>
			<Typography variant='h2' component='h2' gutterBottom>
				The <b>KMAT-inator</b>
			</Typography>
			<Grid container spacing={1}>
				<Grid item xs={6}>
					<Link href='/design' variant='button'>
						Design
					</Link>
				</Grid>
				<Grid item xs={6}>
					<Link href='/configure' variant='button'>
						Config
					</Link>
				</Grid>
			</Grid>
		</div>
	);
}
