import type React from "react";
import {
    FocusLayout,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { Track } from 'livekit-client';
import { Phone, PhoneDisabled } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";
// import SwapHoriz from "@mui/icons-material/SwapHoriz";
// import { useState } from "react";

interface ContentProps {
    video: boolean
    onCall: () => void
    onEndCall: () => void
    connect: boolean
}

export const LivekitContent: React.FC<ContentProps> = ({ video, onCall, onEndCall, connect }) => {
    // const [layoutType, setLayoutType] = useState("grid")
    // const switchLayout = () => setLayoutType(layoutType === "grid" ? "focus" : "grid")

    const StyledButton = styled(IconButton)({
        width: 50,
        height: 50,
        borderRadius: "50%",
        margin: "0 12px",
        color: "grey"
    });
    return (
        <>
            {video && <VideoConference/>}
            <RoomAudioRenderer />
            <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                <StyledButton onClick={onCall} sx={{ backgroundColor: "#a5d6a7" }} disabled={connect}>
                    <Phone />
                </StyledButton>
                <StyledButton onClick={onEndCall} sx={{ backgroundColor: "#ef9a9a" }}>
                    <PhoneDisabled />
                </StyledButton>
                {/* <StyledButton onClick={switchLayout} sx={{ backgroundColor: "#90caf9" }}>
                    <SwapHoriz />
                </StyledButton> */}
            </div>
        </>
    )
}

function VideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    )
}

export default LivekitContent;