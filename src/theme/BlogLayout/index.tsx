import type { Props } from '@theme/BlogLayout';
import Layout from '@theme/Layout';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export default function BlogLayout(props: Props): ReactNode {
	const { sidebar: _sidebar, toc: _toc, children, ...layoutProps } = props;

	return (
		<Layout {...layoutProps}>
			<div className={styles.blogContainer}>
				<main className={styles.blogMain}>{children}</main>
			</div>
		</Layout>
	);
}
