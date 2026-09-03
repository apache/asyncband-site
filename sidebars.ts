// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements. See the NOTICE file distributed with this work for
// additional information regarding copyright ownership. The ASF licenses this
// file to you under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at https://www.apache.org/licenses/LICENSE-2.0.

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
	docs: [
		'about',
		{
			type: 'link',
			label: 'API documentation',
			href: 'https://docs.rs/asyncband/'
		}
	]
};

export default sidebars;
