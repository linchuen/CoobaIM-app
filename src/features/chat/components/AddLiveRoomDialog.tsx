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
import { Dialog, IconButton } from "@mui/material";
import { useState } from "react";

const serverUrl = '<your LiveKit server URL>';


const LiveRoomDialoag: React.FC = () => {
    const [open, setOpen] = useState(false)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaXZla2l0X2FwaV9rZXkiLCJleHAiOjE3NDA5NTY4OTgsInN1YiI6IjEiLCJqdGkiOiIxIiwibmFtZSI6InRlc3QiLCJtZXRhZGF0YSI6IiIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoidGVzdCJ9LCJzaXAiOnt9fQ.2o2DGSX9JxwHmnyx_JI8p3I9KM4nWtl4b4CqsXELv60"

    const onClose = () => setOpen(false)
    return (
        <>
            <IconButton sx={{ color: "white" }} onClick={() => setOpen(true)}>
                <VideoCall />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
                <Call />
            </IconButton>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={"http:127.0.0.1:7880"}
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
