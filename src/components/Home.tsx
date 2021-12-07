import Layout from "./Layout";

const HomePage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-lg bg-white shadow-dark-700 max-w-md w-full px-6 py-10">
          <h1>QUIZZA</h1>
          <button className="px-4 py-2 bg-gray-900 rounded text-white my-4 mx-auto">
            Click to start
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
