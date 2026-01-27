import { useParams } from "react-router-dom";
import type { JuzPageProps } from "./JuzPage.types";

const JuzPage: React.FC<JuzPageProps> = () => {
  const { id } = useParams();
  return <div>JuzPage {id}</div>;
};

export default JuzPage;
