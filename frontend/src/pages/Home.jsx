import Navbar from "../components/layout/Navbar";

function Home() {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* HOME SECTION */}
      <section
        id="home"
        className="h-screen flex flex-col justify-center items-center"
      >
        <h1 className="text-7xl font-bold text-red-600 mb-6">
          Digital Archiving System
        </h1>

        <p className="text-2xl">
          ZPPSU Guidance Office
        </p>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="h-screen flex flex-col justify-center px-20 bg-red-50"
      >
        <h1 className="text-5xl font-bold text-red-600 mb-6">
          About Us
        </h1>

        <p className="text-xl leading-10 max-w-4xl">
          This system is designed to help the
          ZPPSU Guidance Office manage digital
          archiving, document retrieval, and
          inventory monitoring efficiently and
          securely.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="h-screen flex flex-col justify-center px-20"
      >
        <h1 className="text-5xl font-bold text-red-600 mb-6">
          Contact Us
        </h1>

        <div className="text-xl leading-10">
          <p>Email: guidanceoffice@zppsu.edu.ph</p>
          <p>Phone: +63 912 345 6789</p>
          <p>ZPPSU Guidance Office</p>
        </div>
      </section>
    </div>
  );
}

export default Home;