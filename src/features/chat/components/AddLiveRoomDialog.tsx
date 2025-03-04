import type React from "react";
import {
    LiveKitRoom,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { Call, VideoCall } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import { useState } from "react";
import config from "../../../app/config";
import { handleFetch } from "../../../services/common";
import { fetchCreateLiveRoom } from "../../../services/LiveApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";
import type { LiveCall } from "../../../services/ResponseInterface";
import LivekitContent from "../../../components/LivekitContent";

const LiveRoomDialoag: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [open, setOpen] = useState(false)
    const [connect, setConnect] = useState(false)
    const [video, setVideo] = useState(false)
    const [livekitToken, setLivekitToken] = useState("")

    const onCall = () => {
        if (!tokenInfo) return
        handleFetch<LiveCall>(
            dispatch,
            fetchCreateLiveRoom({ roomId: currentRoomId, type: video ? "video" : "call" }, tokenInfo.token),
            data => {
                setLivekitToken(data.token)
                setConnect(true)
            },
        )
    }
    const onEndCall = () => {
        setOpen(false)
        setConnect(false)
    }

    const onOpenVideo = () => {
        setOpen(true)
        setVideo(true)
    }

    const onOpenPhone = () => {
        setOpen(true)
        setVideo(false)
    }

    const onClose = () => setOpen(false)

    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={onOpenVideo}>
                <VideoCall />
            </IconButton>
            <IconButton sx={{ color: "white" }} onClick={onOpenPhone}>
                <Call />
            </IconButton>

            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth={video ? "md" : "sm"}
                sx={{
                    "& .MuiDialog-paper": {
                        height: video ? "90vh" : "10vh",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                <LiveKitRoom
                    video={video}
                    audio={true}
                    token={livekitToken}
                    serverUrl={config.livekitUrl}
                    // Use the default LiveKit theme for nice styles.
                    data-lk-theme="default"
                    connect={connect}
                    style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                    <LivekitContent video={video} onCall={onCall} onEndCall={onEndCall} connect={connect} />
                </LiveKitRoom>
            </Dialog >
        </>
    );
};

export default LiveRoomDialoag;

