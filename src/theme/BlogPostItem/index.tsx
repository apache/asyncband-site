import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import type { Props } from '@theme/BlogPostItem';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import TOC from '@theme/TOC';
import type { ReactNode } from 'react';
import layoutStyles from '../BlogLayout/styles.module.css';

export default function BlogPostItem({ children, className }: Props): ReactNode {
	const { metadata, toc, isBlogPostPage } = useBlogPost();
	const { frontMatter } = metadata;
	const {
		hide_table_of_contents: hideTableOfContents,
		toc_min_heading_level: tocMinHeadingLevel,
		toc_max_heading_level: tocMaxHeadingLevel
	} = frontMatter;

	const showToc = isBlogPostPage && !hideTableOfContents && toc.length > 0;
	const containerClass = [isBlogPostPage ? '' : 'margin-bottom--xl', className]
		.filter(Boolean)
		.join(' ');

	return (
		<BlogPostItemContainer className={containerClass || undefined}>
			<BlogPostItemHeader />
			<div className={layoutStyles.postBodyWrap}>
				<BlogPostItemContent>{children}</BlogPostItemContent>
				{showToc ? (
					<aside className={layoutStyles.postTocRail} aria-label="On this page">
						<TOC
							toc={toc}
							minHeadingLevel={tocMinHeadingLevel}
							maxHeadingLevel={tocMaxHeadingLevel}
						/>
					</aside>
				) : null}
			</div>
			<BlogPostItemFooter />
		</BlogPostItemContainer>
	);
}
