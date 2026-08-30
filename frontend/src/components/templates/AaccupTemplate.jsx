const AaccupTemplate = ({ data }) => {
  return (
    <div className="bg-white p-6">

      <h2
        className="
          text-center
          font-bold
          text-xl
          mb-4
          bg-[#F4E7EA]
          text-[#1D1A1B]
          p-2
        "
      >
        MASTERLIST FORMAT FOR
        AACCUP FINDINGS AND
        RECOMMENDATIONS
      </h2>

      <table className="w-full border border-black">

        <thead>

          <tr className="bg-[#F4E7EA] text-[#1D1A1B]">

            <th className="border border-black p-2">
              ACCESS CODE
            </th>

            <th className="border border-black p-2">
              PROGRAM
            </th>

            <th className="border border-black p-2">
              FILE LOCATION
            </th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td className="border border-black p-2">
              {data?.access_code || "N/A"}
            </td>

            <td className="border border-black p-2">
              {data?.program}
            </td>

            <td className="border border-black p-2">
              {data?.file_location}
            </td>

          </tr>

        </tbody>

      </table>

    </div>
  );
};

export default AaccupTemplate;