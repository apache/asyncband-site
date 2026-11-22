import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import { useState, type ReactNode } from 'react';
import CodeTabs from './CodeTabs';
import {
	DOCS_URL,
	REPO_URL,
	adoption,
	allPrimitives,
	capabilityThemes,
	codeSamples,
	engineeringGuides,
	heroStats,
	primitiveGroups,
	technicalContracts,
	valueProps
} from './data';
import styles from './styles.module.css';

export function Hero(): ReactNode {
	return (
		<header className={styles.hero}>
			<div className={`${styles.heroGrid} ab-grid-bg`} aria-hidden="true" />
			<div className="ab-container">
				<div className={styles.heroInner}>
					<div>
						<span className="ab-eyebrow">Apache Asyncband (Incubating) · Async Rust</span>
						<h1 className={styles.heroTitle}>
							Coordinate tasks.
							<br />
							<span className={styles.heroTitleAccent}>Keep your runtime.</span>
						</h1>
						<p className={styles.heroLede}>
							Composable synchronization, work coalescing, channels, and object pools built on
							standard Rust futures and wakers, without spawning tasks, owning threads, or choosing
							an executor for your application.
						</p>
						<div className={styles.heroActions}>
							<a className={`${styles.btn} ${styles.btnPrimary}`} href="#primitives">
								Explore primitives <span className={styles.btnArrow}>→</span>
							</a>
							<Link className={`${styles.btn} ${styles.btnSecondary}`} to={DOCS_URL}>
								API Docs ↗
							</Link>
							<Link className={`${styles.btn} ${styles.btnSecondary}`} to={REPO_URL}>
								View on GitHub
							</Link>
						</div>
						<div className={styles.heroStats}>
							{heroStats.map((stat) => (
								<div className={styles.heroStat} key={stat.label}>
									<span className={styles.heroStatValue}>{stat.value}</span>
									<span className={styles.heroStatLabel}>{stat.label}</span>
								</div>
							))}
						</div>
					</div>
					<div className={styles.heroAside}>
						<CodeTabs samples={codeSamples} title="quickstart" />
					</div>
				</div>
			</div>
		</header>
	);
}

export function Adoption(): ReactNode {
	return (
		<section className={`${styles.section} ${styles.sectionSubtle}`}>
			<div className="ab-container">
				<div className={styles.adoptionHeader}>
					<span className="ab-eyebrow">Proven in production</span>
				</div>
				<div className={styles.adoptionList}>
					{adoption.map((entry) => (
						<p className={styles.adoptionClaim} key={entry.name}>
							<Link to={entry.href} className={styles.adoptionName}>
								{entry.name}
							</Link>{' '}
							{entry.claim}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}

export function ValueProps(): ReactNode {
	return (
		<section className={styles.section}>
			<div className="ab-container">
				<div className={styles.sectionHead}>
					<span className="ab-eyebrow">Architecture</span>
					<h2 className={styles.sectionTitle}>Mechanism in the library. Policy in your code.</h2>
					<p className={styles.sectionLede}>
						Reusable concurrency mechanisms belong in a shared crate; task scheduling, timers,
						retries, and lifecycle policy belong to the application.
					</p>
				</div>
				<div className={`${styles.valueGrid} ${styles.reveal}`}>
					{valueProps.map((prop) => (
						<article className={styles.valueCard} key={prop.index}>
							<span className={styles.valueIndex}>{prop.index}</span>
							<h3 className={styles.valueCardTitle}>{prop.title}</h3>
							<p className={styles.valueCardBody}>{prop.body}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export function Capabilities(): ReactNode {
	const [active, setActive] = useState(capabilityThemes[0]);
	return (
		<section className={`${styles.section} ${styles.sectionSubtle}`}>
			<div className="ab-container">
				<div className={styles.sectionHead}>
					<span className="ab-eyebrow">Patterns in practice</span>
					<h2 className={styles.sectionTitle}>Choose the exact coordination contract.</h2>
					<p className={styles.sectionLede}>
						Subtle concurrency bugs happen when one primitive stands in for another: retaining a
						value vs. collapsing overlapping calls, or dropping slow receivers vs. applying sender
						backpressure.
					</p>
				</div>
				<div className={styles.capabilityExplorer}>
					<ul className={styles.capabilityNav}>
						{capabilityThemes.map((theme) => {
							const selected = active.id === theme.id;
							return (
								<li key={theme.id}>
									<button
										type="button"
										className={`${styles.capabilityItem} ${
											selected ? styles.capabilityItemActive : ''
										}`}
										aria-pressed={selected}
										onClick={() => setActive(theme)}
									>
										<span className={styles.capabilityMeta}>{theme.feature}</span>
										<span className={styles.capabilityItemTitle}>{theme.title}</span>
										<span className={styles.capabilityItemBlurb}>{theme.blurb}</span>
									</button>
								</li>
							);
						})}
					</ul>
					<div className={styles.capabilityPreview}>
						<div className={styles.codeWindow}>
							<div className={styles.windowBar}>
								<div className={styles.windowDots} aria-hidden="true">
									<span />
									<span />
									<span />
								</div>
								<span className={styles.windowTitle}>{active.feature}</span>
								<Link className={styles.windowActionLink} to={active.docHref}>
									{active.docLabel} →
								</Link>
							</div>
							<div className={`${styles.codeBody} ${styles.capabilityCodeBody}`}>
								<div className={styles.capabilityCodeFade} key={active.id}>
									<CodeBlock language="rust">{active.code}</CodeBlock>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function PrimitivesCatalog(): ReactNode {
	const [selectedGroup, setSelectedGroup] = useState<string>('all');
	const visibleGroups =
		selectedGroup === 'all'
			? primitiveGroups
			: primitiveGroups.filter((group) => group.id === selectedGroup);

	return (
		<section className={styles.section}>
			<div className="ab-container">
				<div className={styles.sectionHead}>
					<span className="ab-eyebrow">API Map · v0.8.0</span>
					<Heading as="h2" id="primitives" className={styles.sectionTitle}>
						{allPrimitives.length} primitives across {primitiveGroups.length} families.
					</Heading>
					<p className={styles.sectionLede}>
						Public module paths stay direct while Cargo features keep unused implementations out of
						your build. Select any entry to open its API reference on docs.rs.
					</p>
				</div>

				<div className={styles.filterBar} role="toolbar" aria-label="Filter primitives by family">
					<button
						type="button"
						className={`${styles.filterChip} ${selectedGroup === 'all' ? styles.filterChipActive : ''}`}
						aria-pressed={selectedGroup === 'all'}
						onClick={() => setSelectedGroup('all')}
					>
						All <span className={styles.filterCount}>{allPrimitives.length}</span>
					</button>
					{primitiveGroups.map((group) => (
						<button
							key={group.id}
							type="button"
							className={`${styles.filterChip} ${
								selectedGroup === group.id ? styles.filterChipActive : ''
							}`}
							aria-pressed={selectedGroup === group.id}
							onClick={() => setSelectedGroup(group.id)}
						>
							{group.title} <span className={styles.filterCount}>{group.primitives.length}</span>
						</button>
					))}
				</div>

				<div className={styles.primitiveGroups}>
					{visibleGroups.map((group) => (
						<div className={styles.primitiveGroup} key={group.id}>
							<div className={styles.primitiveGroupHeader}>
								<h3 className={styles.primitiveGroupTitle}>{group.title}</h3>
								<span className={styles.primitiveGroupCount}>
									{group.primitives.length} {group.primitives.length === 1 ? 'API' : 'APIs'}
								</span>
							</div>
							<div className={styles.primitiveGrid}>
								{group.primitives.map((primitive) => (
									<Link className={styles.primitiveCard} to={primitive.href} key={primitive.name}>
										<div className={styles.primitiveCardHead}>
											<span className={styles.primitiveName}>
												{primitive.name}
												<span className={styles.primitiveArrow} aria-hidden="true">
													{' '}
													↗
												</span>
											</span>
											<code className={styles.primitiveFeature}>{primitive.feature}</code>
										</div>
										<p className={styles.primitiveUse}>{primitive.use}</p>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>

				<div className={styles.contractsGrid}>
					{technicalContracts.map((contract) => (
						<article className={styles.contractCard} key={contract.label}>
							<span className={styles.contractLabel}>{contract.label}</span>
							<h3 className={styles.contractTitle}>{contract.title}</h3>
							<p className={styles.contractBody}>{contract.body}</p>
							{contract.href && contract.linkLabel ? (
								<Link className={styles.contractLink} to={contract.href}>
									{contract.linkLabel} →
								</Link>
							) : null}
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export function Guides(): ReactNode {
	return (
		<section className={`${styles.section} ${styles.sectionSubtle}`}>
			<div className="ab-container">
				<div className={styles.sectionHead}>
					<span className="ab-eyebrow">Engineering guides</span>
					<h2 className={styles.sectionTitle}>Field guides and migration notes.</h2>
					<p className={styles.sectionLede}>
						Practical write-ups on choosing concurrency contracts, migrating from{' '}
						<code>tokio::sync</code> or <code>mea</code>, and composing primitives in production.
					</p>
				</div>
				<div className={`${styles.guideGrid} ${styles.reveal}`}>
					{engineeringGuides.map((guide) => (
						<Link className={styles.guideCard} to={guide.href} key={guide.title}>
							<span className={styles.guideTag}>{guide.tag}</span>
							<h3 className={styles.guideTitle}>{guide.title}</h3>
							<p className={styles.guideSummary}>{guide.summary}</p>
							<span className={styles.guideCta}>
								Read guide <span className={styles.btnArrow}>→</span>
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

export function FinalCta(): ReactNode {
	return (
		<section className={styles.section}>
			<div className="ab-container">
				<div className={styles.finalCta}>
					<div className={styles.finalCenter}>
						<span className={`ab-eyebrow ${styles.finalEyebrow}`}>Start building</span>
						<h2 className={styles.finalCtaTitle}>Add only the primitives you need.</h2>
						<p className={styles.finalCtaLede}>
							Apache Asyncband (Incubating) 0.8.0 ships as a verified ASF source release and on
							crates.io for Rust 1.86.0 and newer.
						</p>
						<div className={styles.finalCtaActions}>
							<Link className={`${styles.btn} ${styles.btnPrimary}`} to={DOCS_URL}>
								Read API Docs <span className={styles.btnArrow}>→</span>
							</Link>
							<Link className={`${styles.btn} ${styles.btnSecondary}`} to="/downloads/">
								Download 0.8.0
							</Link>
							<Link className={`${styles.btn} ${styles.btnSecondary}`} to="/community/">
								Join the Community
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
