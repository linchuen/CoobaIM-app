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
import { Call, VideoCall } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useState } from "react";
import config from "../../../app/config";
import { handleFetch } from "../../../services/common";
import { fetchCreateLiveRoom } from "../../../services/LiveApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTokenInfo } from "../../globalSlice";
import { selectCurrentRoomId, sendMessage } from "../ChatPageSlice";
import type { LiveCall } from "../../../services/ResponseInterface";

const LiveRoomDialoag: React.FC = () => {
    const dispatch = useAppDispatch()
    const tokenInfo = useAppSelector(selectTokenInfo)
    const currentRoomId = useAppSelector(selectCurrentRoomId)
    const [open, setOpen] = useState(false)
    const [callOpen, setCallOpen] = useState(false)
    const [livekitToken, setLivekitToken] = useState("")

    const onCall = () => {
        if (!tokenInfo) return
        setCallOpen(true)
        handleFetch<LiveCall>(
            dispatch,
            fetchCreateLiveRoom({ roomId: currentRoomId }, tokenInfo.token),
            data => {
                setLivekitToken(data.token)
            },
        )
    }
    const onEndCall = () => setCallOpen(false)

    const onClose = () => setOpen(false)


    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setOpen(true)}>
                <VideoCall />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
                <Call />
            </IconButton>
            <Dialog open={callOpen} onClose={onEndCall}>
                <DialogTitle>通話選項</DialogTitle>
                <DialogContent>
                    請選擇您要執行的操作。
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCall} color="primary" variant="contained">
                        通話
                    </Button>
                    <Button onClick={onEndCall} color="secondary" variant="contained">
                        結束通話
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={livekitToken}
                    serverUrl={config.livekitUrl}
                    // Use the default LiveKit theme for nice styles.
                    data-lk-theme="default"
                    style={{ height: '100vh' }}
                >
                    {/* Your custom component with basic video conferencing functionality. */}
                    <MyVideoConference />
                    {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
                    <RoomAudioRenderer />
                    {/* Controls for the user to start/stop audio, video, and screen
        share tracks and to leave the room. */}
                    <ControlBar />
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
