// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements. See the NOTICE file distributed with this work for
// additional information regarding copyright ownership. The ASF licenses this
// file to you under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at https://www.apache.org/licenses/LICENSE-2.0.

import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type { ReactNode } from 'react';

export default function Home(): ReactNode {
	const docsUrl = useBaseUrl('/docs/about/');
	return (
		<>
			<Head>
				<title>Apache Asyncband</title>
				<meta httpEquiv="refresh" content={`0; url=${docsUrl}`} />
				<link rel="canonical" href="https://asyncband.apache.org/docs/about/" />
			</Head>
			<main style={{ padding: '4rem 1.5rem' }}>
				<p>
					Redirecting to <a href={docsUrl}>the documentation</a>…
				</p>
			</main>
		</>
	);
}
