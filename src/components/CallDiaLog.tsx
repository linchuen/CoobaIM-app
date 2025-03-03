import { LiveKitRoom, RoomAudioRenderer, useTracks, GridLayout, ParticipantTile } from "@livekit/components-react";
import { Phone, PhoneDisabled } from "@mui/icons-material";
import { styled, IconButton, Dialog } from "@mui/material";
import { Track } from "livekit-client";
import { useState } from "react";
import config from "../app/config";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCallDialogOpen, selectLiveCall, setCallDialogOpen } from "../features/globalSlice";

const CallDialoag: React.FC = () => {
    const dispatch = useAppDispatch()
    const callOpen = useAppSelector(selectCallDialogOpen)
    const liveCall = useAppSelector(selectLiveCall)
    const [connect, setConnect] = useState(false)
    const [livekitToken, setLivekitToken] = useState("")

    const onCall = () => {
        setLivekitToken(liveCall?.token ?? "")
    }
    const onEndCall = () => {
        dispatch(setCallDialogOpen(false))
        setConnect(false)
    }

    const onClose = () => dispatch(setCallDialogOpen(false))

    const StyledButton = styled(IconButton)({
        width: 50,
        height: 50,
        borderRadius: "50%",
        margin: "0 12px",
        color: "grey"
    });
    return (
        <Dialog
            open={callOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            style={{ height: '95vh' }}
        >
            <LiveKitRoom
                video={liveCall?.type === "video"}
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

export default CallDialoag;