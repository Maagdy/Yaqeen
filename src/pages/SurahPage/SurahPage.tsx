import { useParams } from "react-router-dom";
import type { SurahPageProps } from "./SurahPage.types";

const SurahPage: React.FC<SurahPageProps> = () => {
  const { id } = useParams();
  return <div>SurahPage {id}</div>;
};

export default SurahPage;
