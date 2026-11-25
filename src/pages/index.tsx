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
		<Layout description="Apache Asyncband™ (Incubating) software provides runtime-agnostic concurrency primitives built on standard Rust futures, without pulling an executor into your dependency tree.">
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
