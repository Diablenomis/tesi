import http from "../http-common";
import httpVimeo from "../http-vimeo";

const uploadVideo = (data: any) => {
  return httpVimeo.post<any>("", data);
}

const VideoService = {
    uploadVideo
};

export default VideoService;
