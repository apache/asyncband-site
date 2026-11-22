import type { Props } from '@theme/TOC';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import styles from './styles.module.css';

interface HeadingEntry {
	id: string;
	text: string;
	level: number;
}

interface TocGroup {
	item: HeadingEntry;
	children: HeadingEntry[];
}

function toPlainText(html: string): string {
	return html
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/g, "'");
}

export default function TOC({
	toc,
	minHeadingLevel = 2,
	maxHeadingLevel = 3,
	className
}: Props): ReactNode {
	const navRef = useRef<HTMLElement | null>(null);
	const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
	const [activeId, setActiveId] = useState<string>('');

	const { groups, parentByChild } = useMemo(() => {
		const filtered: HeadingEntry[] = toc
			.filter((item) => item.level >= minHeadingLevel && item.level <= maxHeadingLevel)
			.map((item) => ({
				id: item.id,
				text: toPlainText(item.value),
				level: item.level
			}));

		const builtGroups: TocGroup[] = [];
		const parentMap = new Map<string, string>();

		for (const heading of filtered) {
			if (heading.level <= minHeadingLevel || builtGroups.length === 0) {
				builtGroups.push({ item: heading, children: [] });
			} else {
				const parent = builtGroups[builtGroups.length - 1];
				parent.children.push(heading);
				parentMap.set(heading.id, parent.item.id);
			}
		}

		return { groups: builtGroups, parentByChild: parentMap };
	}, [toc, minHeadingLevel, maxHeadingLevel]);

	useEffect(() => {
		if (groups.length === 0) return undefined;

		const trackedIds = groups.flatMap((group) => [
			group.item.id,
			...group.children.map((child) => child.id)
		]);

		let rafScheduled = false;

		const updateActiveHeading = () => {
			rafScheduled = false;
			const elements = trackedIds
				.map((id) => document.getElementById(id))
				.filter((el): el is HTMLElement => el !== null);

			if (elements.length === 0) return;

			let nextActive = '';
			for (const heading of elements) {
				if (heading.getBoundingClientRect().top <= 128) {
					nextActive = heading.id;
				} else {
					break;
				}
			}

			if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
				nextActive = elements[elements.length - 1].id;
			}

			setActiveId((prev) => (prev === nextActive ? prev : nextActive));
		};

		const scheduleUpdate = () => {
			if (!rafScheduled) {
				rafScheduled = true;
				window.requestAnimationFrame(updateActiveHeading);
			}
		};

		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate, { passive: true });
		updateActiveHeading();

		return () => {
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
		};
	}, [groups]);

	useEffect(() => {
		if (!activeId || !navRef.current) return;
		const nav = navRef.current;
		const activeLink = linkRefs.current.get(activeId);
		if (!activeLink) return;

		const navRect = nav.getBoundingClientRect();
		const linkRect = activeLink.getBoundingClientRect();
		if (linkRect.top < navRect.top + 8 || linkRect.bottom > navRect.bottom - 8) {
			const targetTop =
				linkRect.top - navRect.top + nav.scrollTop - nav.clientHeight / 2 + linkRect.height / 2;
			nav.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
		}
	}, [activeId]);

	if (groups.length === 0) {
		return null;
	}

	const activeParentId = parentByChild.get(activeId);
	const activeGroupId = activeParentId ?? activeId;

	return (
		<nav
			ref={navRef}
			className={[styles.tocSticky, className].filter(Boolean).join(' ')}
			aria-label="On this page"
		>
			<div className={styles.tocHeader}>
				<svg
					viewBox="0 0 16 16"
					width="13"
					height="13"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				>
					<path d="M2.5 4h11M2.5 8h7.5M2.5 12h9.5" />
				</svg>
				<span>On this page</span>
			</div>
			<ul className={styles.tocList}>
				{groups.map((group) => {
					const isExpanded = activeGroupId === group.item.id;
					const isGroupActive = activeId === group.item.id;
					const isParentActive = activeParentId === group.item.id;

					return (
						<li
							key={group.item.id}
							className={`${styles.tocGroup} ${isExpanded ? styles.tocGroupExpanded : ''}`}
						>
							<a
								ref={(el) => {
									if (el) linkRefs.current.set(group.item.id, el);
									else linkRefs.current.delete(group.item.id);
								}}
								href={`#${group.item.id}`}
								className={[
									styles.tocLink,
									isGroupActive ? styles.tocLinkActive : '',
									isParentActive ? styles.tocLinkParentActive : ''
								]
									.filter(Boolean)
									.join(' ')}
							>
								{group.item.text}
							</a>
							{group.children.length > 0 ? (
								<ul className={styles.tocSublist}>
									{group.children.map((child) => {
										const isChildActive = activeId === child.id;
										return (
											<li key={child.id}>
												<a
													ref={(el) => {
														if (el) linkRefs.current.set(child.id, el);
														else linkRefs.current.delete(child.id);
													}}
													href={`#${child.id}`}
													className={`${styles.tocSublink} ${
														isChildActive ? styles.tocSublinkActive : ''
													}`}
												>
													{child.text}
												</a>
											</li>
										);
									})}
								</ul>
							) : null}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
