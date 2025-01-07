import React from "react";
import { transformImage } from "../../lib/features";
import { FileOpen } from "@mui/icons-material";

const RenderAttachmnet = (file, url) => {
    switch (file) {
        case "video":
            return <video src={url} preload="none" width={"200px"} controls />;
            break;
        case "image":
            return (
                <img
                    src={transformImage(url, 200)}
                    width={"200px"}
                    height={"150px"}
                    style={{
                        objectFit: "contain",
                    }}
                />
            );
            break;
        case "audio":
            return <video src={url} preload="none" controls />;

            break;
        default:
            return <FileOpen />;
            break;
    }
};

export default RenderAttachmnet;
