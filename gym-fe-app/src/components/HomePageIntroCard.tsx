import Vimeo from "@u-wave/react-vimeo";
import { HOMEPAGE_VIDEO_URL } from "../constants/TypeConstants";

export const HomePageIntroCard: React.FC = () => {
  return (
    <div className="d-flex align-items-center justify-content-center panel home-page-intro-card m-auto">
      <Vimeo
        video={HOMEPAGE_VIDEO_URL + "?dnt=1"}
        loop={true}
        autoplay={false}
        responsive={true}
        muted={true}
        showTitle={false}
        style={{borderRadius: 10}}
        controls={true}
        className="home-page-intro-video"
      />
    </div>
  );
};
