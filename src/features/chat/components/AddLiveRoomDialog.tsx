import type React from "react";
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { Track } from 'livekit-client';
import { Call, Phone, PhoneDisabled, VideoCall } from "@mui/icons-material";
import { Button, Dialog, IconButton, styled } from "@mui/material";
import { useState } from "react";
import config from "../../../app/config";
import { handleFetch } from "../../../services/common";
import { fetchCreateLiveRoom } from "../../../services/LiveApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId } from "../ChatPageSlice";
import type { LiveCall } from "../../../services/ResponseInterface";

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
            fetchCreateLiveRoom({ roomId: currentRoomId }, tokenInfo.token),
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

    const StyledButton = styled(IconButton)({
        width: 50,
        height: 50,
        borderRadius: "50%",
        margin: "0 12px",
        color: "grey"
    });
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
                maxWidth="sm"
                style={{ height: '95vh' }}
            >
                <LiveKitRoom
                    video={video}
                    audio={true}
                    token={livekitToken}
                    serverUrl={config.livekitUrl}
                    // Use the default LiveKit theme for nice styles.
                    data-lk-theme="default"
                    connect={connect}
                    style={{ height: '90%' }}
                >
                    {/* Your custom component with basic video conferencing functionality. */}
                    <MyVideoConference />
                    {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
                    <RoomAudioRenderer />
                    {/* Controls for the user to start/stop audio, video, and screen share tracks and to leave the room. */}
                    {/* <ControlBar /> */}
                    <StyledButton onClick={onCall} sx={{ backgroundColor: "#a5d6a7" }} disabled={connect}>
                        <Phone />
                    </StyledButton>
                    <StyledButton onClick={onEndCall} sx={{ backgroundColor: "#ef9a9a" }}>
                        <PhoneDisabled />
                    </StyledButton>
                </LiveKitRoom>
            </Dialog>
        </>
    );
};

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
            <ParticipantTile />
        </GridLayout>
    );
}

export default LiveRoomDialoag;

