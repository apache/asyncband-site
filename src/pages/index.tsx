import Layout from '@theme/Layout';
import type { ReactNode } from 'react';
import {
	Adoption,
	Capabilities,
	FinalCta,
	Guides,
	Hero,
	PrimitivesCatalog,
	ValueProps
} from '../components/landing/sections';

export default function Home(): ReactNode {
	return (
		<Layout description="Apache Asyncband (Incubating) is a runtime-agnostic library providing composable synchronization, work coalescing, channels, and object pools for asynchronous Rust.">
			<Hero />
			<main>
				<Adoption />
				<ValueProps />
				<Capabilities />
				<PrimitivesCatalog />
				<Guides />
				<FinalCta />
			</main>
		</Layout>
	);
}
