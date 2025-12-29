import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-text">PromptForm</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-muted hover:text-text transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-text tracking-tight">
          Build forms with
          <span className="text-primary"> natural language</span>
        </h1>
        <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto">
          Describe your form in plain English and let AI generate it for you.
          No drag-and-drop, no complex builders — just describe what you need.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-border text-text font-medium rounded-lg hover:bg-surface transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Prompt Side */}
            <div>
              <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
                Your prompt
              </div>
              <div className="bg-white border border-border rounded-lg p-4 text-sm text-text">
                Create a contact form with name, email, subject dropdown (General, Support, Sales), and a message textarea. Make email and message required.
              </div>
            </div>
            {/* Result Side */}
            <div>
              <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
                Generated form
              </div>
              <div className="bg-white border border-border rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-text-muted mb-1">Name</div>
                  <div className="h-9 bg-surface border border-border rounded-lg"></div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Email *</div>
                  <div className="h-9 bg-surface border border-border rounded-lg"></div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Subject</div>
                  <div className="h-9 bg-surface border border-border rounded-lg"></div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Message *</div>
                  <div className="h-16 bg-surface border border-border rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-semibold text-text text-center mb-12">
            Simple. Fast. Powerful.
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-text mb-2">Instant Generation</h3>
              <p className="text-sm text-text-muted">
                Describe your form and get a working result in seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="font-medium text-text mb-2">Shareable Links</h3>
              <p className="text-sm text-text-muted">
                Every form gets a public URL you can share anywhere.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-text mb-2">Track Submissions</h3>
              <p className="text-sm text-text-muted">
                View, search, and export all responses from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-text-muted">
          {new Date().getFullYear()} Built by Manik
        </div>
      </footer>
    </div>
  );
}
