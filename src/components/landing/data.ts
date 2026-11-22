export interface CodeSample {
	id: string;
	label: string;
	install: string;
	language: string;
	code: string;
}

export interface Primitive {
	name: string;
	href: string;
	feature: string;
	use: string;
}

export interface PrimitiveGroup {
	id: string;
	title: string;
	primitives: Primitive[];
}

export interface ValueProp {
	index: string;
	title: string;
	body: string;
}

export interface CapabilityTheme {
	id: string;
	title: string;
	feature: string;
	blurb: string;
	docHref: string;
	docLabel: string;
	code: string;
}

export interface AdoptionEntry {
	name: string;
	href: string;
	claim: string;
}

export interface EngineeringGuide {
	tag: string;
	title: string;
	summary: string;
	href: string;
}

export interface TechnicalContract {
	label: string;
	title: string;
	body: string;
	href?: string;
	linkLabel?: string;
}

export const REPO_URL = 'https://github.com/apache/asyncband';
export const DOCS_URL = 'https://docs.rs/asyncband/';
export const CRATES_URL = 'https://crates.io/crates/asyncband';
export const MIGRATE_URL = 'https://github.com/apache/asyncband/blob/main/MIGRATE.md';

export const supportedRuntimes = [
	'Tokio',
	'smol',
	'futures::executor',
	'async-std',
	'custom Waker executors',
	'blocking::FutureExt'
];

export const primitiveGroups: PrimitiveGroup[] = [
	{
		id: 'locks',
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
				use: 'Allow multiple concurrent readers or one exclusive writer.'
			},
			{
				name: 'UpgradableRwLock',
				href: 'https://docs.rs/asyncband/*/asyncband/rwlock/struct.UpgradableRwLock.html',
				feature: 'rwlock',
				use: 'Allow multiple readers or one writer, with one upgradable reader.'
			},
			{
				name: 'Condvar',
				href: 'https://docs.rs/asyncband/*/asyncband/condvar/struct.Condvar.html',
				feature: 'condvar',
				use: 'Wait for notifications while atomically releasing an async mutex.'
			}
		]
	},
	{
		id: 'coordination',
		title: 'Coordination',
		primitives: [
			{
				name: 'Semaphore',
				href: 'https://docs.rs/asyncband/*/asyncband/semaphore/struct.Semaphore.html',
				feature: 'semaphore',
				use: 'Limit concurrent work and charge resource budgets by acquiring permits.'
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
				name: 'AutoResetEvent',
				href: 'https://docs.rs/asyncband/*/asyncband/event/struct.AutoResetEvent.html',
				feature: 'event',
				use: 'Retain one signal and release one waiter per consumed signal.'
			},
			{
				name: 'Latch',
				href: 'https://docs.rs/asyncband/*/asyncband/latch/struct.Latch.html',
				feature: 'latch',
				use: 'Wait until a fixed one-way countdown reaches zero.'
			},
			{
				name: 'Phaser',
				href: 'https://docs.rs/asyncband/*/asyncband/phaser/struct.Phaser.html',
				feature: 'phaser',
				use: 'Coordinate repeated phases across a dynamic participant set.'
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
		id: 'coalescing',
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
				use: 'Store one value from an access-time initializer; failed or cancelled attempts may be retried.'
			},
			{
				name: 'LazyCell',
				href: 'https://docs.rs/asyncband/*/asyncband/once/struct.LazyCell.html',
				feature: 'lazy-cell',
				use: 'Initialize one value with a stored function and resume the in-flight future across cancellation.'
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
		id: 'communication',
		title: 'Communication',
		primitives: [
			{
				name: 'Completion',
				href: 'https://docs.rs/asyncband/*/asyncband/completion/struct.Completion.html',
				feature: 'completion',
				use: 'Publish one shared result to any number of current and late observers.'
			},
			{
				name: 'oneshot',
				href: 'https://docs.rs/asyncband/*/asyncband/oneshot/',
				feature: 'oneshot',
				use: 'Send one value from one sender to one receiver.'
			},
			{
				name: 'mpmc',
				href: 'https://docs.rs/asyncband/*/asyncband/mpmc/',
				feature: 'mpmc',
				use: 'Distribute each value to exactly one of multiple competing receivers.'
			},
			{
				name: 'mpsc',
				href: 'https://docs.rs/asyncband/*/asyncband/mpsc/',
				feature: 'mpsc',
				use: 'Send values from multiple producers to one receiver with bounded or unbounded queues.'
			},
			{
				name: 'spmc',
				href: 'https://docs.rs/asyncband/*/asyncband/spmc/',
				feature: 'spmc',
				use: 'Distribute work from one exclusive sender to multiple competing receivers.'
			},
			{
				name: 'broadcast',
				href: 'https://docs.rs/asyncband/*/asyncband/broadcast/',
				feature: 'broadcast',
				use: 'Deliver every value to active receivers with bounded backpressure or unbounded retention.'
			},
			{
				name: 'watch',
				href: 'https://docs.rs/asyncband/*/asyncband/watch/',
				feature: 'watch',
				use: 'Publish cloneable latest state; receivers independently coalesce intermediate updates.'
			}
		]
	},
	{
		id: 'reuse',
		title: 'Object reuse',
		primitives: [
			{
				name: 'pool',
				href: 'https://docs.rs/asyncband/*/asyncband/pool/',
				feature: 'pool',
				use: 'Reuse connections and buffers through bounded or unbounded pool variants.'
			}
		]
	},
	{
		id: 'interop',
		title: 'Sync interop',
		primitives: [
			{
				name: 'FutureExt',
				href: 'https://docs.rs/asyncband/*/asyncband/blocking/trait.FutureExt.html',
				feature: 'blocking',
				use: 'Drive one runtime-agnostic future from a synchronous thread.'
			}
		]
	}
];

export const allPrimitives: Primitive[] = primitiveGroups.flatMap((group) => group.primitives);

const uniqueFeatureCount = new Set(allPrimitives.map((p) => p.feature)).size;

export const heroStats = [
	{ value: String(allPrimitives.length), label: 'Composable APIs' },
	{ value: String(uniqueFeatureCount), label: 'Opt-in features' },
	{ value: '0', label: 'Default features' },
	{ value: '1.86+', label: 'Rust MSRV' }
];

export const codeSamples: CodeSample[] = [
	{
		id: 'semaphore',
		label: 'Semaphore',
		install: 'cargo add asyncband --features semaphore',
		language: 'rust',
		code: `use std::sync::Arc;
use asyncband::semaphore::{OwnedSemaphorePermit, Semaphore};

pub struct BudgetedChunk {
    pub bytes: Vec<u8>,
    _permit: OwnedSemaphorePermit,
}

pub async fn reserve(
    budget: &Arc<Semaphore>,
    len: usize,
) -> BudgetedChunk {
    // Permit stays with the buffer until dropped.
    let permit = budget.clone().acquire_owned(len).await;
    BudgetedChunk {
        bytes: vec![0; len],
        _permit: permit,
    }
}`
	},
	{
		id: 'singleflight',
		label: 'Singleflight',
		install: 'cargo add asyncband --features singleflight',
		language: 'rust',
		code: `use asyncband::singleflight::Group;

pub struct TokenClient {
    flights: Group<&'static str, String>,
}

impl TokenClient {
    pub async fn fetch_token(&self) -> String {
        // Overlapping callers share one in-flight call.
        self.flights
            .work("access-token", || async {
                issue_short_lived_token().await
            })
            .await
    }
}`
	},
	{
		id: 'shutdown',
		label: 'Shutdown',
		install: 'cargo add asyncband --features shutdown',
		language: 'rust',
		code: `use asyncband::shutdown::{self, ShutdownGuard};

pub async fn supervise() {
    let (shutdown, guard) = shutdown::new();
    let worker = spawn_worker(guard);

    shutdown.request_shutdown();
    // Compose any runtime timeout around this wait.
    shutdown.await;
    worker.await;
}

async fn run_worker(guard: ShutdownGuard) {
    guard.shutdown_requested().await;
}`
	},
	{
		id: 'blocking',
		label: 'Blocking',
		install: 'cargo add asyncband --features blocking,oneshot',
		language: 'rust',
		code: `use std::thread;
use asyncband::blocking::FutureExt as _;
use asyncband::oneshot;

let (sender, receiver) = oneshot::channel();
thread::spawn(move || {
    sender.send(6 * 7).unwrap();
});

// Drive one future from a synchronous boundary thread.
assert_eq!(receiver.block_on(), Ok(42));`
	}
];

export const adoption: AdoptionEntry[] = [
	{
		name: 'Apache OpenDAL',
		href: 'https://opendal.apache.org/',
		claim:
			'shares Semaphore concurrency budgets across storage operators and coalesces concurrent directory creation with singleflight::Group.'
	},
	{
		name: 'Apache Reqsign',
		href: 'https://reqsign.apache.org/',
		claim:
			'deduplicates overlapping cloud credential refreshes with singleflight::Group while remaining executor-independent.'
	},
	{
		name: 'prek',
		href: 'https://github.com/j178/prek',
		claim: 'passes shared Semaphore permits across project runs to bound concurrent hook execution.'
	}
];

export const valueProps: ValueProp[] = [
	{
		index: '01',
		title: 'Executor-independent by construction',
		body: 'Built strictly on standard Rust futures and wakers. Asyncband never spawns tasks, owns worker threads, installs timers, or requires an I/O reactor.'
	},
	{
		index: '02',
		title: 'Mechanism in the library, policy in the caller',
		body: 'Stateful coordination such as singleflight groups and object pools fit cleanly, while task placement, deadlines, retries, and periodic maintenance stay with your runtime.'
	},
	{
		index: '03',
		title: 'Zero-default feature granularity',
		body: 'The crate enables no APIs by default. Opt into individual features like mutex, semaphore, or mpsc so unused primitives and optional dependencies stay out of your build.'
	},
	{
		index: '04',
		title: 'Async first, synchronous at the boundary',
		body: 'Primitives optimize for async waker queues rather than duplicating blocking methods across every type. Synchronous callers drive futures at the boundary via blocking::FutureExt.'
	}
];

export const capabilityThemes: CapabilityTheme[] = [
	{
		id: 'capacity',
		title: 'Bound in-flight capacity by resource lifetime',
		feature: 'semaphore',
		blurb:
			'Charge permits per operation or per byte, and move OwnedSemaphorePermit into streams or buffers so capacity returns only when work finishes.',
		docHref: '/blog/2026/10/14/choosing-the-right-primitive/',
		docLabel: 'Read semaphore guide',
		code: `use std::sync::Arc;
use asyncband::semaphore::{OwnedSemaphorePermit, Semaphore};

pub struct TrackedStream<S> {
    inner: S,
    _permit: OwnedSemaphorePermit,
}

pub async fn open_stream<S>(
    slots: &Arc<Semaphore>,
    connect: impl AsyncFnOnce() -> S,
) -> TrackedStream<S> {
    let permit = slots.clone().acquire_owned(1).await;
    TrackedStream {
        inner: connect().await,
        _permit: permit,
    }
}`
	},
	{
		id: 'coalescing',
		title: 'Collapse duplicate in-flight work or retain per key',
		feature: 'singleflight · once-map',
		blurb:
			'Use singleflight::Group to deduplicate overlapping calls without caching stale results, or OnceMap when completed values should remain stored.',
		docHref: '/blog/2026/10/24/coalescing-concurrent-work/',
		docLabel: 'Read coalescing guide',
		code: `use std::sync::Arc;
use asyncband::once::OnceMap;

pub struct SchemaRegistry {
    schemas: OnceMap<String, Arc<Schema>>,
}

impl SchemaRegistry {
    pub async fn load(&self, subject: &str) -> Result<Arc<Schema>, RegistryError> {
        // Concurrent misses share one fetch; later lookups clone the Arc.
        self.schemas
            .try_compute(subject.to_owned(), || async {
                fetch_remote_schema(subject).await.map(Arc::new)
            })
            .await
    }
}`
	},
	{
		id: 'lifecycle',
		title: 'Coordinate dynamic phases and graceful drains',
		feature: 'phaser · waitgroup · shutdown',
		blurb:
			'Register workers dynamically with WaitGroup or Phaser, and trigger orderly service termination with Shutdown and caller-owned deadlines.',
		docHref: 'https://docs.rs/asyncband/*/asyncband/phaser/struct.Phaser.html',
		docLabel: 'View Phaser docs',
		code: `use asyncband::phaser::{Closed, Phaser};

pub async fn start_gate(workers: usize) -> Result<(), Closed> {
    let phaser = Phaser::new();
    let setup = phaser.register_one()?;
    let parties = phaser.register(workers)?;

    // Release every waiting participant once setup finishes.
    setup.deregister()?;
    for mut party in parties {
        party.wait().await?;
    }
    Ok(())
}`
	},
	{
		id: 'channels',
		title: 'Select exact delivery and backpressure semantics',
		feature: 'broadcast · watch · completion · mpmc',
		blurb:
			'Bounded broadcast applies sender backpressure instead of silently lagging slow receivers; Completion fans out one immutable result to late observers.',
		docHref: '/blog/2026/10/15/tokio-field-map/',
		docLabel: 'Compare with tokio::sync',
		code: `use asyncband::completion;

pub async fn fan_out_build_status() {
    let (completer, done) = completion::new();
    let audit = done.clone();

    completer.complete("release artifact verified").unwrap();

    // Both active and late observers borrow the same completed value.
    assert_eq!(*done.wait().await.unwrap(), "release artifact verified");
    assert_eq!(*audit.wait().await.unwrap(), "release artifact verified");
}`
	},
	{
		id: 'pooling',
		title: 'Pool connections without background timers',
		feature: 'pool',
		blurb:
			'Manage bounded or unbounded object reuse through ManageObject while keeping health-check scheduling and timeouts in your own application.',
		docHref: 'https://docs.rs/asyncband/*/asyncband/pool/',
		docLabel: 'View pool docs',
		code: `use asyncband::pool::{ManageObject, ObjectStatus};
use asyncband::pool::bounded::{Pool, PoolConfig};

struct ConnManager;

impl ManageObject for ConnManager {
    type Object = Connection;
    type Error = ConnError;

    async fn create(&self) -> Result<Connection, ConnError> {
        Connection::connect().await
    }

    async fn is_recyclable(
        &self,
        conn: &mut Connection,
        _status: &ObjectStatus,
    ) -> Result<(), ConnError> {
        conn.ping().await
    }
}

let pool = Pool::new(PoolConfig::new(16), ConnManager);`
	}
];

export const technicalContracts: TechnicalContract[] = [
	{
		label: 'Blocking interop',
		title: 'Single-future boundary adapter',
		body: 'blocking::FutureExt parks the calling thread for one runtime-agnostic future. wait_timeout drops the future on timeout; futures needing a timer or I/O driver still require their runtime, and executor threads must not block.',
		href: 'https://docs.rs/asyncband/*/asyncband/blocking/',
		linkLabel: 'blocking contract'
	},
	{
		label: 'Thread safety',
		title: 'Conditional Send and Sync',
		body: 'Asyncband types implement Send and Sync only when the protected, transferred, or managed value satisfies the required trait bounds, preserving use with non-Send local state where sound.',
		href: DOCS_URL,
		linkLabel: 'API reference'
	},
	{
		label: 'Rust compatibility',
		title: 'MSRV 1.86.0 · Minor-bump policy',
		body: 'Built and tested against stable Rust with a minimum supported rustc of 1.86.0. Patch releases (x.y.z) preserve the MSRV; increases happen only in minor or major updates.'
	}
];

export const engineeringGuides: EngineeringGuide[] = [
	{
		tag: 'Migration · tokio::sync',
		title: 'Moving from tokio::sync to Asyncband',
		summary:
			'How channel backpressure, semaphore permits, event notifications, and initialization contracts differ when switching primitives on Tokio.',
		href: '/blog/2026/10/15/tokio-field-map/'
	},
	{
		tag: 'Workload control · Semaphore',
		title: 'Using Semaphores to Control In-Flight Work',
		summary:
			'Share concurrency budgets across callers, tie OwnedSemaphorePermit to stream lifetimes, and charge capacity by payload size.',
		href: '/blog/2026/10/14/choosing-the-right-primitive/'
	},
	{
		tag: 'Deduplication · Singleflight & Once',
		title: 'Coalescing Concurrent Work with Singleflight',
		summary:
			'Collapse duplicate key refreshes with singleflight::Group, handle cancellation and errors, and compare against OnceMap and LazyCell.',
		href: '/blog/2026/10/24/coalescing-concurrent-work/'
	},
	{
		tag: 'Crate rename · MEA',
		title: 'Migrating from the mea crate',
		summary:
			'Asyncband was formerly published as mea. Follow the step-by-step rename and feature flag checklist for existing Rust workspaces.',
		href: MIGRATE_URL
	}
];
