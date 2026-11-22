import CodeBlock from '@theme/CodeBlock';
import { useEffect, useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { CodeSample } from './data';
import styles from './styles.module.css';

interface CodeTabsProps {
	samples: CodeSample[];
	title: string;
}

export default function CodeTabs({ samples, title }: CodeTabsProps): ReactNode {
	const [active, setActive] = useState(0);
	const [copied, setCopied] = useState(false);
	const baseId = useId();
	const current = samples[active];
	const heading = current.install || title;

	useEffect(() => {
		setCopied(false);
	}, [active]);

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
		event.preventDefault();
		const dir = event.key === 'ArrowRight' ? 1 : -1;
		setActive((i) => (i + dir + samples.length) % samples.length);
	}

	async function copyInstall(): Promise<void> {
		if (!current.install || typeof navigator === 'undefined' || !navigator.clipboard) return;
		await navigator.clipboard.writeText(current.install);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	}

	return (
		<div className={styles.codeWindow}>
			<div className={styles.windowBar}>
				<div className={styles.windowDots} aria-hidden="true">
					<span />
					<span />
					<span />
				</div>
				<span className={styles.windowTitle}>
					<span className={styles.windowPrompt} aria-hidden="true">
						${' '}
					</span>
					{heading}
				</span>
				{current.install ? (
					<button
						type="button"
						className={styles.windowCopy}
						onClick={() => void copyInstall()}
						aria-label={`Copy ${current.install}`}
					>
						{copied ? 'Copied' : 'Copy'}
					</button>
				) : null}
			</div>

			<div
				className={styles.codeTabs}
				role="tablist"
				aria-label="Choose a primitive example"
				onKeyDown={onKeyDown}
			>
				{samples.map((sample, i) => (
					<button
						key={sample.id}
						type="button"
						role="tab"
						id={`${baseId}-tab-${sample.id}`}
						aria-selected={i === active}
						aria-controls={`${baseId}-panel`}
						tabIndex={i === active ? 0 : -1}
						className={`${styles.codeTab} ${i === active ? styles.codeTabActive : ''}`}
						onClick={() => setActive(i)}
					>
						{sample.label}
					</button>
				))}
			</div>

			<div
				className={`${styles.codeBody} ${styles.heroCodeBody}`}
				role="tabpanel"
				id={`${baseId}-panel`}
				aria-labelledby={`${baseId}-tab-${current.id}`}
			>
				<CodeBlock language={current.language}>{current.code}</CodeBlock>
			</div>
		</div>
	);
}
