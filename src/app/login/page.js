import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Grooming Canino
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-4 text-slate-600">
          El formulario y la autenticación se implementarán en INC-01.
        </p>
        <Link
          href="/registro"
          className="mt-6 inline-flex font-medium text-sky-700 hover:text-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          Ir a registro
        </Link>
      </section>
    </main>
  );
}
