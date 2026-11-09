// API map data, verbatim from the previous homepage table.
// Each row: [name, docs.rs href, feature, one-line use].
export type Primitive = {
	name: string;
	href: string;
	feature: string;
	use: string;
};

export type PrimitiveGroup = {
	title: string;
	primitives: Primitive[];
};

export const primitiveGroups: PrimitiveGroup[] = [
	{
		title: 'Locks and conditions',
		primitives: [
			{
				name: 'Mutex',
				href: 'https://docs.rs/asyncband/*/asyncband/mutex/struct.Mutex.html',
				feature: 'mutex',
				use: 'Protect shared data with asynchronous mutual exclusion.'
			},
			{
				name: 'RwLock',
				href: 'https://docs.rs/asyncband/*/asyncband/rwlock/struct.RwLock.html',
				feature: 'rwlock',
				use: 'Allow multiple readers or one writer.'
			},
			{
				name: 'Condvar',
				href: 'https://docs.rs/asyncband/*/asyncband/condvar/struct.Condvar.html',
				feature: 'condvar',
				use: 'Wait for notifications while releasing a mutex.'
			}
		]
	},
	{
		title: 'Coordination',
		primitives: [
			{
				name: 'Semaphore',
				href: 'https://docs.rs/asyncband/*/asyncband/semaphore/struct.Semaphore.html',
				feature: 'semaphore',
				use: 'Limit concurrent work by acquiring permits.'
			},
			{
				name: 'Barrier',
				href: 'https://docs.rs/asyncband/*/asyncband/barrier/struct.Barrier.html',
				feature: 'barrier',
				use: 'Synchronize a fixed number of participants at a reusable rendezvous.'
			},
			{
				name: 'ManualResetEvent',
				href: 'https://docs.rs/asyncband/*/asyncband/event/struct.ManualResetEvent.html',
				feature: 'event',
				use: 'Signal current and future waits until explicitly reset.'
			},
			{
				name: 'Latch',
				href: 'https://docs.rs/asyncband/*/asyncband/latch/struct.Latch.html',
				feature: 'latch',
				use: 'Wait until a fixed one-way countdown reaches zero.'
			},
			{
				name: 'WaitGroup',
				href: 'https://docs.rs/asyncband/*/asyncband/waitgroup/struct.WaitGroup.html',
				feature: 'waitgroup',
				use: 'Dynamically register participants and wait until all have completed.'
			},
			{
				name: 'Shutdown',
				href: 'https://docs.rs/asyncband/*/asyncband/shutdown/struct.Shutdown.html',
				feature: 'shutdown',
				use: 'Request shutdown and wait until all completion guards are dropped.'
			}
		]
	},
	{
		title: 'Work coalescing',
		primitives: [
			{
				name: 'Once',
				href: 'https://docs.rs/asyncband/*/asyncband/once/struct.Once.html',
				feature: 'once',
				use: 'Complete one asynchronous initialization; cancelled or panicked attempts may be retried.'
			},
			{
				name: 'OnceCell',
				href: 'https://docs.rs/asyncband/*/asyncband/once/struct.OnceCell.html',
				feature: 'once-cell',
				use: 'Store one value from an access-time initializer; failed, cancelled, or panicked attempts may be retried.'
			},
			{
				name: 'LazyCell',
				href: 'https://docs.rs/asyncband/*/asyncband/once/struct.LazyCell.html',
				feature: 'lazy-cell',
				use: 'Initialize one value with a stored function and resume the same in-flight future after caller cancellation.'
			},
			{
				name: 'OnceMap',
				href: 'https://docs.rs/asyncband/*/asyncband/once/struct.OnceMap.html',
				feature: 'once-map',
				use: 'Coalesce work per key and retain each successful value until explicitly removed.'
			},
			{
				name: 'Group',
				href: 'https://docs.rs/asyncband/*/asyncband/singleflight/struct.Group.html',
				feature: 'singleflight',
				use: 'Coalesce overlapping work per key without retaining completed values.'
			}
		]
	},
	{
		title: 'Communication',
		primitives: [
			{
				name: 'Completion',
				href: 'https://docs.rs/asyncband/*/asyncband/completion/struct.Completion.html',
				feature: 'completion',
				use: 'Publish one shared result to any number of current and future observers.'
			},
			{
				name: 'oneshot',
				href: 'https://docs.rs/asyncband/*/asyncband/oneshot/',
				feature: 'oneshot',
				use: 'Send one value from one sender to one receiver.'
			},
			{
				name: 'mpsc',
				href: 'https://docs.rs/asyncband/*/asyncband/mpsc/',
				feature: 'mpsc',
				use: 'Send each value from multiple producers to one receiver with bounded backpressure or an unbounded queue.'
			},
			{
				name: 'broadcast',
				href: 'https://docs.rs/asyncband/*/asyncband/broadcast/',
				feature: 'broadcast',
				use: 'Deliver every value to receivers active at send time; retain an unbounded backlog until each consumes or drops.'
			},
			{
				name: 'watch',
				href: 'https://docs.rs/asyncband/*/asyncband/watch/',
				feature: 'watch',
				use: 'Publish cloneable latest state from one or more senders; receivers independently coalesce intermediate updates.'
			}
		]
	},
	{
		title: 'Object reuse',
		primitives: [
			{
				name: 'pool',
				href: 'https://docs.rs/asyncband/*/asyncband/pool/',
				feature: 'pool',
				use: 'Reuse objects through bounded or unbounded pool variants.'
			}
		]
	},
	{
		title: 'Sync interop',
		primitives: [
			{
				name: 'FutureExt',
				href: 'https://docs.rs/asyncband/*/asyncband/blocking/trait.FutureExt.html',
				feature: 'blocking',
				use: 'Drive one runtime-agnostic future from a blocking thread.'
			}
		]
	}
];
