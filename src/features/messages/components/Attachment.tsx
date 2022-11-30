import {
  mdiAnimationPlayOutline,
  mdiCardAccountMailOutline,
  mdiChartBoxOutline,
  mdiDiceMultipleOutline,
  mdiFileDocumentOutline,
  mdiFileImageOutline,
  mdiFileVideoOutline,
  mdiGamepadVariantOutline,
  mdiMapMarker,
  mdiMapMarkerStarOutline,
  mdiMicrophone,
  mdiMusic,
  mdiOpenInNew,
  mdiStickerEmoji,
  mdiVideoOutline,
  mdiWeb,
} from "@mdi/js";
import { startCase } from "lodash";
import { axios } from "lib/axios";
import clsx from "clsx";
import { Button } from "components/Elements";
import { useEffect, useState } from "react";
import {
  Message as MessageType,
  MessageAttachment,
  MessageAttachmentType,
} from "types";
import Icon from "@mdi/react";

const attachmentTypeIconMap: { [key in MessageAttachmentType]: string } = {
  audio: mdiMusic,
  document: mdiFileDocumentOutline,
  photo: mdiFileImageOutline,
  sticker: mdiStickerEmoji,
  video: mdiVideoOutline,
  animation: mdiAnimationPlayOutline,
  voice: mdiMicrophone,
  video_note: mdiFileVideoOutline,
  contact: mdiCardAccountMailOutline,
  location: mdiMapMarker,
  venue: mdiMapMarkerStarOutline,
  poll: mdiChartBoxOutline,
  web_page: mdiWeb,
  dice: mdiDiceMultipleOutline,
  game: mdiGamepadVariantOutline,
};

const downloadableTypes = [
  "audio",
  "document",
  "photo",
  "video",
  "voice",
  "video_note",
  "contact",
  "location",
  "venue",
  "poll",
  "web_page",
  "dice",
  "game",
];

const playableTypes = ["audio", "video", "voice"];

const urlCreator = window.URL || window.webkitURL;

const createObjectURL = async (storageURL: string) => {
  try {
    const response: Blob = await axios.get(storageURL, {
      responseType: "blob",
    });
    return urlCreator.createObjectURL(response);
  } catch (error) {
    throw new Error(`Error downloading file from storage "${storageURL}"`);
  }
};

const revokeObjectURL = (url: string) => urlCreator.revokeObjectURL(url);

type ParsedAttachment = {
  downloadUrl?: string;
  thumbnail?: string;
  animation?: string;
  webPage?: {
    title?: string;
    url: string;
    description?: string;
  };
};

const parseAttachment = async (
  attachment: MessageAttachment,
  callback: (result: ParsedAttachment | undefined) => void
) => {
  const result: ParsedAttachment = {};

  // parse storage refs
  if (attachment.storage_refs) {
    for await (const ref of attachment.storage_refs) {
      if (ref.bucket === "thumbnails" || ref.bucket === "animations") {
        const objectURL = await createObjectURL(
          `/storage/${ref.bucket}/${ref.object}`
        );

        if (!objectURL) {
          continue;
        }

        if (ref.bucket === "thumbnails") {
          result.thumbnail = objectURL;
        } else if (ref.bucket === "animations") {
          result.animation = objectURL;
        }
      } else {
        result.downloadUrl = `/storage/${ref.bucket}/${ref.object}`;
      }
    }

    // if (small) photo has no thumbnail use it as thumbnail
    if (!result?.thumbnail && attachment.type === "photo") {
      if (result.downloadUrl) {
        const objectURL = await createObjectURL(result.downloadUrl);
        if (objectURL) {
          result.thumbnail = objectURL;
        }
      }
    }
  }

  // parse webpage
  if (attachment.type === "web_page" && attachment.raw) {
    const rawObject = attachment.raw;
    const webPage: ParsedAttachment["webPage"] = {
      url: rawObject.url as string,
    };
    if (rawObject.title) {
      webPage.title = rawObject.title as string;
    }
    if (rawObject.description) {
      webPage.description = rawObject.description as string;
    }

    result.webPage = webPage;
  }

  const resultIsEmpty = !Object.keys(result).length;
  callback(resultIsEmpty ? undefined : result);
};

const downloadFile = async (url: string, objectURL: string) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const link = document.createElement("a");
  link.setAttribute("href", objectURL);
  link.setAttribute("download", fileName);
  link.click();
};

export const Attachment = (props: MessageType) => {
  const attachment = props.attachment;
  const [parsedAttachment, setParsedAttachment] = useState<ParsedAttachment>();
  const [objectURL, setObjectURL] = useState<string>();
  const [fileIsDownloading, setFileIsDownloading] = useState(false);
  const showDownloadButton =
    attachment &&
    parsedAttachment?.downloadUrl &&
    downloadableTypes.includes(attachment.type);
  const showPlayButton =
    attachment &&
    !objectURL &&
    parsedAttachment?.downloadUrl &&
    playableTypes.includes(attachment.type);

  const loadFile = async (download: boolean = false) => {
    const downloadURL = parsedAttachment?.downloadUrl;
    if (!downloadURL) {
      return;
    }

    // return early if file has already been downloaded
    if (objectURL) {
      downloadFile(downloadURL, objectURL);
      return;
    }

    setFileIsDownloading(true);
    const createdUrl = await createObjectURL(downloadURL);
    setFileIsDownloading(false);

    if (createdUrl && !download) {
      setObjectURL(createdUrl);
    }

    if (createdUrl && download) {
      downloadFile(downloadURL, createdUrl);
      revokeObjectURL(createdUrl);
    }
  };

  useEffect(() => {
    if (attachment) {
      parseAttachment(attachment, (result) => {
        if (result) {
          setParsedAttachment(result);
        }
      });
    }
  }, [attachment]);

  useEffect(() => {
    if (objectURL) {
      return () => revokeObjectURL(objectURL);
    }
  }, [objectURL]);

  if (!attachment) {
    return null;
  }

  const getAttachmentContent = () => {
    const type = attachment.type;

    if (objectURL) {
      if (type === "photo") {
        return <img src={objectURL} alt="" />;
      } else if (type === "video") {
        return <video src={objectURL} autoPlay controls />;
      } else if (type === "audio" || type === "voice") {
        return <audio src={objectURL} autoPlay controls />;
      }
    }

    if (parsedAttachment) {
      if (parsedAttachment.animation) {
        return <video src={parsedAttachment.animation} autoPlay loop />;
      }

      if (parsedAttachment.thumbnail) {
        return (
          <img
            src={parsedAttachment.thumbnail}
            alt=""
            className={clsx("w-full", {
              "cursor-pointer": parsedAttachment.downloadUrl,
            })}
            onClick={() => !fileIsDownloading && loadFile()}
          />
        );
      }

      if (parsedAttachment.webPage) {
        const webPage = parsedAttachment.webPage;
        return (
          <div className="w-full">
            <a
              href={webPage.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:underline"
            >
              <div>
                {webPage.title && (
                  <div className="font-semibold">{webPage.title}</div>
                )}
                {webPage.description && (
                  <div className="text-sm text-gray-600 mt-1 line-clamp-5">
                    {webPage.description}
                  </div>
                )}
                <div className="flex items-center space-x-1 mt-2">
                  <Icon
                    path={mdiOpenInNew}
                    size={0.75}
                    className="flex-shrink-0"
                  />
                  <div className="text-sm truncate">{webPage.url}</div>
                </div>
              </div>
            </a>
          </div>
        );
      }
    }

    return (
      <div className="flex flex-col items-center justify-center text-xs w-20 h-20 space-y-1">
        <Icon path={attachmentTypeIconMap[attachment.type]} size={1.5} />
        <div>{startCase(attachment.type)}</div>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "bg-gray-100 rounded-b mb-2",
        props.reply_to_message ? "mt-1.5 rounded-t" : "rounded-tl rounded-tr-xl"
      )}
    >
      <div className="flex flex-col justify-center items-center p-5">
        {getAttachmentContent()}

        {(showPlayButton || showDownloadButton) && (
          <div className="flex space-x-2 mt-4">
            {showDownloadButton && (
              <Button
                variant="secondary"
                size="xs"
                isLoading={fileIsDownloading}
                disabled={fileIsDownloading}
                onClick={() => loadFile(true)}
              >
                Download {startCase(attachment.type)}
              </Button>
            )}

            {showPlayButton && (
              <Button
                variant="secondary"
                size="xs"
                disabled={fileIsDownloading}
                onClick={() => loadFile()}
              >
                Play {attachment.type}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
