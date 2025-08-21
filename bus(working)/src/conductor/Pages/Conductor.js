import PrivateRoute from "../../context/PrivateRoute";
import Home from "../components/ConductorNavbar";


const Conductor = () => {
  return (
    <PrivateRoute>
      <Home />
    </PrivateRoute>
  );
};

export default Conductor;
