import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VIMEO_UPLOAD_REDIRECT } from "../constants/PathConstants";
import VideoService from "../services/VideoService";

const MediaUploader: React.FC = () => {
  const [videoInput, setVideoInput] = useState<string>("");
  const [idVideo, setIdVideo] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let paramUrl = searchParams.get("video_uri");
    setIdVideo(paramUrl !== null ? paramUrl.replace("/videos/", "") : "");
  }, []);

  const handleChange = async (eventObject: any) => {
    const file = eventObject.target.files[0];
    const fileName = file.name;
    const fileSize = file.size.toString();
    const data = {
      upload: {
        approach: "post",
        size: fileSize,
        redirect_url: VIMEO_UPLOAD_REDIRECT,
      },
      name: fileName,
    };

    VideoService.uploadVideo(data)
      .then((response: any) => {
        let inputHtml = response.data.upload.form
          .replace('<label for="file">File:</label>', "")
          .replace('<input type="file" name="file_data" id="file">', "")
          .replace('<input type="submit" name="submit" value="Submit">', "")
          .replace(
            "<br>",
            '<label class="custom-file-upload"><input onChange="bho()" class="" type="file" name="file_data" id="file"/></label><br><label class="custom-file-upload mt-2"><input class="custom-file-upload-input" type="submit" name="submit" value="Submit"/>CONFERMA</label>'
          );
        setVideoInput(inputHtml);
      })
      .catch((e: Error) => {
        console.error(e);
      });
  };

  return (
    <div className="panel col-12 m-0 p-0 row zoom-in">
      <div className="col-12 padding-page-half m-0 row">
        <div className="col-12 p-0 m-0 mt-3">
          <span className="text-font-big">Carica il tuo video</span>
        </div>
        {idVideo !== "" && (
          <div className="col-12 p-0 m-0">
            <span className="text-font-medium">
              L'id del tuo ultimo video caricato è: {idVideo}
            </span>
          </div>
        )}
        <div className="col-12 p-0 m-0 mt-3 mb-3">
          <label className="custom-file-upload">
            <input
              onChange={handleChange}
              type="file"
              className="custom-file-upload-input"
            />
            Seleziona File
          </label>
        </div>
        {videoInput !== "" && (
          <div className="col-12 m-0 p-0 mb-3">
            <div dangerouslySetInnerHTML={{ __html: videoInput }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
