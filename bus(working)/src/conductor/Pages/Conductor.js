import PrivateRoute from "../../context/PrivateRoute";
import Home from "./Home";


const Conductor = () => {
  return (
    <PrivateRoute>
      <Home />
    </PrivateRoute>
  );
};

export default Conductor;
