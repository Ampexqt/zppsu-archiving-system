export default function DbmCommunications2024Template({ data }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        border: "1px solid #000",
        padding: "20px"
      }}
    >
      <h2>DBM Communications 2024</h2>

      <p><strong>Date:</strong> {data?.date}</p>
      <p><strong>Access Code:</strong> {data?.access_code}</p>
      <p><strong>Subject:</strong> {data?.subject}</p>
      <p><strong>Action Taken:</strong> {data?.action_taken}</p>
      <p><strong>File Location:</strong> {data?.file_location}</p>
    </div>
  );
}