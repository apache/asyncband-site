import Link from '@docusaurus/Link';
import type { Props } from '@theme/BlogPostItems';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC'
});

function formatPostDate(raw: Date | string): string {
	const parsed = typeof raw === 'string' ? new Date(raw) : raw;
	return Number.isNaN(parsed.getTime()) ? String(raw) : dateFormatter.format(parsed);
}

export default function BlogPostItems({ items }: Props): ReactNode {
	return (
		<div className={styles.postList}>
			{items.map(({ content: BlogPostContent }) => {
				const { metadata, assets } = BlogPostContent;
				const readingMinutes =
					metadata.readingTime != null ? Math.max(1, Math.round(metadata.readingTime)) : null;

				return (
					<article className={styles.postRow} key={metadata.permalink}>
						<div className={styles.postMetaRail}>
							<time className={styles.postDate} dateTime={String(metadata.date)}>
								{formatPostDate(metadata.date)}
							</time>
							{readingMinutes != null ? (
								<span className={styles.postReadingTime}>{readingMinutes} min read</span>
							) : null}
						</div>

						<div className={styles.postBody}>
							<h2 className={styles.postTitle}>
								<Link to={metadata.permalink} className={styles.postTitleLink}>
									{metadata.title}
								</Link>
							</h2>

							{metadata.description ? (
								<p className={styles.postSummary}>{metadata.description}</p>
							) : null}

							<div className={styles.postFooter}>
								<div className={styles.authorList}>
									{metadata.authors.map((author, index) => {
										const avatarSrc = assets.authorsImageUrls[index] ?? author.imageURL;
										const authorHref = author.page?.permalink ?? author.url;
										const badge = (
											<>
												{avatarSrc ? (
													<img
														src={avatarSrc}
														alt=""
														width={22}
														height={22}
														className={styles.authorAvatar}
													/>
												) : null}
												<span className={styles.authorName}>{author.name}</span>
											</>
										);

										return authorHref ? (
											<Link
												key={author.key ?? author.name ?? index}
												to={authorHref}
												className={styles.authorChip}
											>
												{badge}
											</Link>
										) : (
											<span key={author.key ?? author.name ?? index} className={styles.authorChip}>
												{badge}
											</span>
										);
									})}
								</div>

								{metadata.tags.length > 0 ? (
									<div className={styles.tagList}>
										{metadata.tags.map((tag) => (
											<Link key={tag.permalink} to={tag.permalink} className={styles.tagPill}>
												{tag.label}
											</Link>
										))}
									</div>
								) : null}
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
}
