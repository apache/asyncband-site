import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { Props } from '@theme/BlogListPage';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import Layout from '@theme/Layout';
import SearchMetadata from '@theme/SearchMetadata';
import type { ReactNode } from 'react';
import styles from '../BlogPostItems/styles.module.css';

export default function BlogListPage(props: Props): ReactNode {
	const { metadata, items } = props;
	const {
		siteConfig: { title: siteTitle }
	} = useDocusaurusContext();
	const { withBaseUrl } = useBaseUrlUtils();

	const title = metadata.permalink === '/' ? siteTitle : metadata.blogTitle;

	return (
		<>
			<SearchMetadata tag="blog_posts_list" />
			<BlogListPageStructuredData {...props} />
			<Layout
				title={title}
				description={metadata.blogDescription}
				wrapperClassName="blog-wrapper blog-list-page"
			>
				<main className={styles.pageContainer}>
					<header className={styles.pageHeader}>
						<h1 className={styles.pageTitle}>Blog</h1>
						<a
							className={styles.rssLink}
							href={withBaseUrl('/blog/rss.xml')}
							aria-label="Subscribe via RSS"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M4 11a9 9 0 0 1 9 9" />
								<path d="M4 4a16 16 0 0 1 16 16" />
								<circle cx="5" cy="19" r="1" fill="currentColor" />
							</svg>
							<span>RSS</span>
						</a>
					</header>

					<BlogPostItems items={items} />
					<BlogListPaginator metadata={metadata} />
				</main>
			</Layout>
		</>
	);
}
