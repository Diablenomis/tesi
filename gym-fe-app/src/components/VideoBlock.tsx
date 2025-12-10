// import { Box, Modal } from "@mui/material";
// import { useState } from "react";

// import Vimeo from "@u-wave/react-vimeo";
// const VideoBlock = () => {
//   const [isOpen, setOpen] = useState(false);
//   const modalStyle = {
//     position: "absolute" as "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "90%",
//     bgcolor: "background.paper",
//     borderRadius: "16px",
//     boxShadow: 24,
//     textAlign: "center",
//     p: 1,
//   };
//   return (
//     <>
//       <Modal
//         open={isOpen}
//         onClose={() => {
//           setOpen(false);
//         }}
//       >
//         <Box sx={modalStyle}>
//           <div className="col-12 py-0 m-0 mt-3 mb-3 row pack-card-body padding-page-field">
//             <div className="no-pm col">
//               <div className="d-flex align-items-center justify-content-center col-12 no-pm">
//                 <Vimeo
//                   video={"1000709155"}
//                   loop={false}
//                   autoplay={true}
//                   responsive={true}
//                   controls={false}
//                   muted={true}
//                   className="home-page-intro-video"
//                   onEnd={() => {
//                     setOpen(false);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </Box>
//       </Modal>
// <div className="fancy-feature-fiftyTwo mt-50 lg-mt-100">
//   <div className="container">
//     <div className="video-banner d-flex align-items-center justify-content-center">
//       <button
//         className="fancybox video-icon tran3s rounded-circle d-flex align-items-center justify-content-center"
//         onClick={() => setOpen(true)}
//       >
//         <img
//           src="../images/icon/icon_140.svg"
//           alt="icon"
//           className="lazy-img"
//         />
//       </button>
//     </div>
//   </div>
// </div>
//     </>
//   );
// };

// export default VideoBlock;

import { useState } from "react";

const VideoBlock = () => {
  const [isPlaying, setPlaying] = useState(false);

  const handleClick = () => {
    setPlaying(true);
  };

  return (
    <div>
      {!isPlaying ? (
        // Mostra l'immagine se il video non è ancora partito
        <div className="fancy-feature-fiftyTwo mt-50 lg-mt-100">
          <div className="container">
            <div className="video-banner d-flex align-items-center justify-content-center">
              <button
                className="fancybox video-icon tran3s rounded-circle d-flex align-items-center justify-content-center"
                onClick={handleClick}
              >
                <img
                  src="../images/icon/icon_140.svg"
                  alt="icon"
                  className="lazy-img"
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fancy-feature-fiftyTwo mt-50 lg-mt-100">
          <div className="container">
              <video
                src="/video/homepage-video.mp4" // percorso del video locale
                controls
                autoPlay
                style={{ width: "100%", borderRadius: "16px" }}
              />
          </div>
        </div>

        // Mostra il video se è stato cliccato il bottone
      )}
    </div>
  );
};

export default VideoBlock;
