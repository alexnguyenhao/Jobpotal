import { useParams } from "react-router-dom";

const CVView = () => {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Xem CV</h1>
      <p className="text-gray-600 mt-3">CV ID: {id}</p>
    </div>
  );
};

export default CVView;
