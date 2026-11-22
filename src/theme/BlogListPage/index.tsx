import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { Props } from '@theme/BlogListPage';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import Layout from '@theme/Layout';
import SearchMetadata from '@theme/SearchMetadata';
import { useMemo, useState, type ReactNode } from 'react';
import styles from '../BlogPostItems/styles.module.css';

export default function BlogListPage(props: Props): ReactNode {
	const { metadata, items } = props;
	const {
		siteConfig: { title: siteTitle }
	} = useDocusaurusContext();
	const { withBaseUrl } = useBaseUrlUtils();
	const [activeTag, setActiveTag] = useState<string>('all');

	const title = metadata.permalink === '/' ? siteTitle : metadata.blogTitle;

	const tags = useMemo(() => {
		const seen = new Map<string, { label: string; count: number }>();
		for (const { content } of items) {
			for (const tag of content.metadata.tags) {
				const prev = seen.get(tag.label);
				seen.set(tag.label, { label: tag.label, count: (prev?.count ?? 0) + 1 });
			}
		}
		return Array.from(seen.values());
	}, [items]);

	const visibleItems =
		activeTag === 'all'
			? items
			: items.filter(({ content }) => content.metadata.tags.some((tag) => tag.label === activeTag));

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
						<div>
							<span className="ab-eyebrow">Engineering blog</span>
							<h1 className={styles.pageTitle}>Asyncband Blog</h1>
							<p className={styles.pageIntro}>{metadata.blogDescription}</p>
						</div>
						<div className={styles.feedLinks}>
							<a className={styles.feedLink} href={withBaseUrl('/blog/rss.xml')}>
								RSS
							</a>
							<a className={styles.feedLink} href={withBaseUrl('/blog/atom.xml')}>
								Atom
							</a>
						</div>
					</header>

					{tags.length > 0 ? (
						<div className={styles.filterBar} role="toolbar" aria-label="Filter posts by topic">
							<button
								type="button"
								className={`${styles.filterChip} ${activeTag === 'all' ? styles.filterChipActive : ''}`}
								aria-pressed={activeTag === 'all'}
								onClick={() => setActiveTag('all')}
							>
								All posts ({items.length})
							</button>
							{tags.map((tag) => (
								<button
									key={tag.label}
									type="button"
									className={`${styles.filterChip} ${
										activeTag === tag.label ? styles.filterChipActive : ''
									}`}
									aria-pressed={activeTag === tag.label}
									onClick={() => setActiveTag(tag.label)}
								>
									{tag.label} ({tag.count})
								</button>
							))}
						</div>
					) : null}

					<BlogPostItems items={visibleItems} />
					<BlogListPaginator metadata={metadata} />
				</main>
			</Layout>
		</>
	);
}
