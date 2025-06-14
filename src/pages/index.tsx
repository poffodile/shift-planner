import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Shift Planner</title>
      </Head>
      <main className="p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Welcome to the Shift Planner App
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Built with Next.js, Redux, and Firebase
        </p>
      </main>
    </>
  );
}
