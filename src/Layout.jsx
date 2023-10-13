import React from 'react';

export default function Layout({ children }) {
	return (
		<div
			style={{
				paddingTop: '20px',
				paddingRight: '40px',
				paddingBottom: '20px',
				paddingLeft: '40px',
			}}
		>
			{children}
		</div>
	);
}
