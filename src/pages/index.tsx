import MDXContent from '@theme/MDXContent';
import Layout from '@theme/Layout';
import type { ReactNode } from 'react';
import HomeContent from './_home-content.md';

export default function Home(): ReactNode {
	return (
		<Layout description="Apache Asyncband (Incubating) is a runtime-agnostic library providing synchronization and coordination tools for asynchronous Rust programming.">
			<header className="home-hero">
				<div className="container">
					<h1 className="home-hero__title">Concurrency tools for async Rust</h1>
					<p className="home-hero__tagline">
						Composable synchronization and coordination primitives that work with your runtime.
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
				<article className="home-content">
					<MDXContent>
						<HomeContent />
					</MDXContent>
				</article>
			</main>
		</Layout>
	);
}
