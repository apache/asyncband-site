import MDXContent from '@theme/MDXContent';
import Layout from '@theme/Layout';
import type { ReactNode } from 'react';
import HomeContent from './_home-content.md';
import { primitiveGroups } from './_primitives';

const runtimes = ['Tokio', 'async-std', 'smol', 'custom executors'];

function RuntimeDiagram(): ReactNode {
	return (
		<svg
			className="home-diagram__svg"
			viewBox="0 0 960 260"
			role="img"
			aria-label="Asyncband primitives sit between application code and any executor"
		>
			{/* Application code */}
			<rect
				x="24"
				y="90"
				width="200"
				height="80"
				rx="12"
				className="diagram-box diagram-box--soft"
			/>
			<text x="124" y="124" textAnchor="middle" className="diagram-text">
				Your async code
			</text>
			<text x="124" y="146" textAnchor="middle" className="diagram-text diagram-text--muted">
				tasks · services · handlers
			</text>

			{/* Arrow 1 */}
			<line x1="232" y1="130" x2="292" y2="130" className="diagram-arrow" />
			<polygon points="292,124 304,130 292,136" className="diagram-arrow-head" />

			{/* Asyncband primitives */}
			<rect
				x="312"
				y="70"
				width="336"
				height="120"
				rx="12"
				className="diagram-box diagram-box--ink"
			/>
			<text x="480" y="102" textAnchor="middle" className="diagram-text diagram-text--paper">
				Asyncband primitives
			</text>
			<text x="480" y="130" textAnchor="middle" className="diagram-text diagram-text--paper-muted">
				Mutex · RwLock · Semaphore · Latch
			</text>
			<text x="480" y="152" textAnchor="middle" className="diagram-text diagram-text--paper-muted">
				Channels · Once · Pool · …
			</text>

			{/* Arrow 2 */}
			<line x1="660" y1="130" x2="720" y2="130" className="diagram-arrow" />
			<polygon points="720,124 732,130 720,136" className="diagram-arrow-head" />

			{/* Executors */}
			<text x="848" y="52" textAnchor="middle" className="diagram-text diagram-text--muted">
				Any executor
			</text>
			<rect x="740" y="64" width="196" height="44" rx="10" className="diagram-box" />
			<text x="838" y="91" textAnchor="middle" className="diagram-text">
				Tokio
			</text>
			<rect x="740" y="116" width="196" height="44" rx="10" className="diagram-box" />
			<text x="838" y="143" textAnchor="middle" className="diagram-text">
				async-std
			</text>
			<rect x="740" y="168" width="196" height="44" rx="10" className="diagram-box" />
			<text x="838" y="195" textAnchor="middle" className="diagram-text">
				smol · custom
			</text>
		</svg>
	);
}

export default function Home(): ReactNode {
	return (
		<Layout description="Apache Asyncband (Incubating) is a runtime-agnostic library providing synchronization and coordination tools for asynchronous Rust programming.">
			<header className="home-hero">
				<div className="container">
					<div className="home-hero__grid">
						<div className="home-hero__lead">
							<p className="home-hero__eyebrow">Apache Asyncband · Incubating</p>
							<h1 className="home-hero__title">
								Composable synchronization and coordination primitives for Async Rust
							</h1>
							<p className="home-hero__tagline">
								A focused collection of composable, runtime-agnostic concurrency building blocks for
								Async Rust. It provides synchronization, initialization, task coordination,
								channels, resource reuse, and workload control without choosing an executor for the
								application.
							</p>
							<div className="home-hero__actions">
								<a className="button button--primary button--lg" href="#getting-started">
									Get started
								</a>
								<a
									className="button button--secondary button--lg"
									href="https://github.com/apache/asyncband"
								>
									View on GitHub
								</a>
							</div>
							<p className="home-hero__runtimes">
								<span className="home-hero__runtimes-label">Poll with any runtime:</span>
								{runtimes.map((runtime) => (
									<span key={runtime} className="home-hero__runtime-chip">
										{runtime}
									</span>
								))}
							</p>
						</div>
						<div className="home-hero__mark-card">
							<img
								className="home-hero__mark-image home-hero__mark-image--light"
								src="img/asyncband-icon-animated.svg"
								alt="The Asyncband mark: two strokes converging on a shared point"
								width={168}
								height={168}
								loading="eager"
							/>
							<img
								className="home-hero__mark-image home-hero__mark-image--dark"
								src="img/asyncband-icon-animated-reverse.svg"
								alt=""
								width={168}
								height={168}
								loading="eager"
							/>
							<p className="home-hero__mark-caption">The band, not the baton.</p>
						</div>
					</div>
				</div>
			</header>
			<main className="container">
				<section className="row home-features">
					<div className="col col--4">
						<div className="home-feature">
							<h3>Runtime-agnostic</h3>
							<p>
								Built on standard futures and wakers. Poll Asyncband futures with Tokio, async-std,
								smol, a custom executor, or any other standards-based runtime.
							</p>
						</div>
					</div>
					<div className="col col--4">
						<div className="home-feature">
							<h3>Composable building blocks</h3>
							<p>
								Synchronization, initialization, task coordination, channels, resource reuse, and
								workload control without choosing an executor for the application.
							</p>
						</div>
					</div>
					<div className="col col--4">
						<div className="home-feature">
							<h3>Async first</h3>
							<p>
								Primitives are designed for async use; synchronous code drives them through a
								blocking boundary adapter instead of a second family of APIs.
							</p>
						</div>
					</div>
				</section>
				<section className="home-section home-diagram">
					<h2>Coordination without a conductor</h2>
					<RuntimeDiagram />
					<p className="home-diagram__caption">
						Asyncband does not spawn tasks, own worker threads, install timers, or require a reactor
						or I/O driver. Your runtime stays yours.
					</p>
				</section>
				<section className="home-section home-primitives">
					<h2>The primitives</h2>
					<p className="home-section__intro">
						The crate enables no APIs by default. Each card names the Cargo feature that turns it
						on.
					</p>
					{primitiveGroups.map((group) => (
						<div key={group.title} className="primitive-group">
							<h3 className="primitive-group__title">{group.title}</h3>
							<div className="primitive-grid">
								{group.primitives.map((primitive) => (
									<a key={primitive.name} className="primitive-card" href={primitive.href}>
										<span className="primitive-card__head">
											<span className="primitive-card__name">{primitive.name}</span>
											<code className="primitive-card__feature">{primitive.feature}</code>
										</span>
										<span className="primitive-card__use">{primitive.use}</span>
									</a>
								))}
							</div>
						</div>
					))}
				</section>
				<article className="home-content">
					<MDXContent>
						<HomeContent />
					</MDXContent>
				</article>
			</main>
		</Layout>
	);
}
