import { Grid, Link, Typography } from '@octanner/prism-core';

export default function NotFound() {
	return (
		<div style={{ textAlign: 'center' }}>
			<Typography variant='h2' component='h2' gutterBottom>
				The <b>Nothing-inator</b>
			</Typography>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Link href='/' variant='button'>
						Go Home, You're drunk
					</Link>
				</Grid>
			</Grid>
		</div>
	);
}
