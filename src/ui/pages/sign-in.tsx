export default async function SignIn() {
  return (
    <main class="container flex justify-center items-center mx-auto h-screen">
      <a
        href="/api/auth/sign-in/github"
        class="py-2 px-5 text-white bg-gradient-to-tr rounded-lg transition-all hover:shadow-lg hover:-translate-y-1 underline-none from-zinc-950 to-zinc-600">
        Sign in with Github
      </a>
    </main>
  );
}
