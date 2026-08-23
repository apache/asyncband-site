// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements. See the NOTICE file distributed with this work for
// additional information regarding copyright ownership. The ASF licenses this
// file to you under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

export const primaryNavigation = [
	{ href: '/', label: 'Home' },
	{ href: '/primitives/', label: 'Primitives' },
	{ href: '/design/', label: 'Design' },
	{ href: '/project/', label: 'Project' }
] as const;

export const apiCategories = [
	{
		name: 'Protect shared state',
		apis: ['Mutex', 'RwLock', 'Condvar'],
		description: 'Asynchronous mutual exclusion, reader-writer access, and condition waiting.'
	},
	{
		name: 'Initialize values once',
		apis: ['Once', 'OnceCell', 'OnceMap'],
		description: 'One-time asynchronous initialization for a value, a cell, or keyed values.'
	},
	{
		name: 'Coordinate tasks',
		apis: ['Barrier', 'Latch', 'WaitGroup', 'shutdown'],
		description: 'Synchronization points, countdowns, task-group completion, and shutdown signals.'
	},
	{
		name: 'Send values',
		apis: ['oneshot', 'mpsc'],
		description: 'One-value, bounded, and unbounded channels between asynchronous tasks.'
	},
	{
		name: 'Reuse managed objects',
		apis: ['pool::bounded', 'pool::unbounded'],
		description: 'Bounded and unbounded pools for reusing managed objects.'
	},
	{
		name: 'Control workloads',
		apis: ['Semaphore', 'singleflight::Group'],
		description: 'Permit-based concurrency control and coalescing for concurrent calls by key.'
	}
];

export const primitiveGroups = [
	{
		id: 'shared-state',
		name: 'Shared state',
		description: 'Protect shared data with asynchronous locks and condition waiting.',
		items: [
			{
				name: 'Mutex',
				path: 'asyncband::mutex::Mutex',
				feature: 'mutex',
				purpose: 'Protect shared data with asynchronous mutual exclusion.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/mutex/struct.Mutex.html'
			},
			{
				name: 'RwLock',
				path: 'asyncband::rwlock::RwLock',
				feature: 'rwlock',
				purpose: 'Allow multiple readers or one writer.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/rwlock/struct.RwLock.html'
			},
			{
				name: 'Condvar',
				path: 'asyncband::condvar::Condvar',
				feature: 'condvar',
				purpose: 'Wait for notifications while releasing a mutex.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/condvar/struct.Condvar.html'
			}
		]
	},
	{
		id: 'initialization',
		name: 'One-time initialization',
		description: 'Run asynchronous initialization once globally or once per key.',
		items: [
			{
				name: 'Once',
				path: 'asyncband::once::Once',
				feature: 'once',
				purpose: 'Run asynchronous initialization exactly once.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/once/struct.Once.html'
			},
			{
				name: 'OnceCell',
				path: 'asyncband::once::OnceCell',
				feature: 'once-cell',
				purpose: 'Initialize and store one asynchronous value.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/once/struct.OnceCell.html'
			},
			{
				name: 'OnceMap',
				path: 'asyncband::once::OnceMap',
				feature: 'once-map',
				purpose: 'Initialize and store one value per key.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/once/struct.OnceMap.html'
			}
		]
	},
	{
		id: 'task-coordination',
		name: 'Task coordination',
		description: 'Coordinate synchronization points, countdowns, task groups, and shutdown.',
		items: [
			{
				name: 'Barrier',
				path: 'asyncband::barrier::Barrier',
				feature: 'barrier',
				purpose: 'Wait until all participants reach a synchronization point.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/barrier/struct.Barrier.html'
			},
			{
				name: 'Latch',
				path: 'asyncband::latch::Latch',
				feature: 'latch',
				purpose: 'Wait until a one-way countdown completes.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/latch/struct.Latch.html'
			},
			{
				name: 'WaitGroup',
				path: 'asyncband::waitgroup::WaitGroup',
				feature: 'waitgroup',
				purpose: 'Wait for a dynamic group of tasks to finish.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/waitgroup/struct.WaitGroup.html'
			},
			{
				name: 'shutdown',
				path: 'asyncband::shutdown',
				feature: 'shutdown',
				purpose: 'Coordinate shutdown signals and completion.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/shutdown/index.html'
			}
		]
	},
	{
		id: 'channels',
		name: 'Channels',
		description: 'Send one value or a stream of values between asynchronous tasks.',
		items: [
			{
				name: 'oneshot::channel',
				path: 'asyncband::oneshot::channel',
				feature: 'oneshot',
				purpose: 'Send one value between two tasks.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/oneshot/fn.channel.html'
			},
			{
				name: 'mpsc::bounded',
				path: 'asyncband::mpsc::bounded',
				feature: 'mpsc',
				purpose: 'Send values from multiple producers through a bounded channel.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/mpsc/fn.bounded.html'
			},
			{
				name: 'mpsc::unbounded',
				path: 'asyncband::mpsc::unbounded',
				feature: 'mpsc',
				purpose: 'Send values from multiple producers through an unbounded channel.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/mpsc/fn.unbounded.html'
			}
		]
	},
	{
		id: 'resource-reuse',
		name: 'Resource reuse',
		description: 'Reuse managed objects with bounded or unbounded pools.',
		items: [
			{
				name: 'pool::bounded',
				path: 'asyncband::pool::bounded',
				feature: 'pool',
				purpose: 'Reuse managed objects up to a configured capacity.',
				docs: 'https://github.com/apache/asyncband/blob/main/asyncband/src/pool/bounded.rs'
			},
			{
				name: 'pool::unbounded',
				path: 'asyncband::pool::unbounded',
				feature: 'pool',
				purpose: 'Reuse manually supplied or manager-created objects.',
				docs: 'https://github.com/apache/asyncband/blob/main/asyncband/src/pool/unbounded.rs'
			}
		]
	},
	{
		id: 'workload-control',
		name: 'Workload control',
		description: 'Control concurrent access and coalesce concurrent calls by key.',
		items: [
			{
				name: 'Semaphore',
				path: 'asyncband::semaphore::Semaphore',
				feature: 'semaphore',
				purpose: 'Control concurrent access with permits.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/semaphore/struct.Semaphore.html'
			},
			{
				name: 'singleflight::Group',
				path: 'asyncband::singleflight::Group',
				feature: 'singleflight',
				purpose: 'Coalesce concurrent calls for the same key.',
				docs: 'https://docs.rs/asyncband/latest/asyncband/singleflight/struct.Group.html'
			}
		]
	}
];
