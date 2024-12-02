import { useLocation } from "react-router-dom";
import AddBike from "../components/AddBike";

const AddPage = () => {
  const location = useLocation();
  const { from } = location.state || {};

  return (
    <>
      {from === "AddBike" && <AddBike />}
      {/* {from === "AddCart" && <AddToCart />} */}
      {/* {from === "AddBikeCart" && <AddBikeCart />} */}
    </>
  );
};

export default AddPage;
