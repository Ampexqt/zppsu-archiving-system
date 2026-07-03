import Navbar from "../components/layout/Navbar";

function About() {
  return (
    <div>
      <Navbar />

      <div className="p-10">
        <h1 className="text-4xl font-bold mb-4">
          About Us
        </h1>

        <p>
          This system helps the ZPPSU Guidance Office
          manage digital archiving and inventory
          monitoring efficiently.
        </p>
      </div>
    </div>
  );
}

export default About;