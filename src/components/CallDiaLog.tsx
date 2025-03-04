import { LiveKitRoom } from "@livekit/components-react";
import { Dialog } from "@mui/material";
import { useState } from "react";
import config from "../app/config";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCallDialogOpen, selectLiveCall, setCallDialogOpen } from "../features/globalSlice";
import LivekitContent from "./LivekitContent";

const CallDialoag: React.FC = () => {
    const dispatch = useAppDispatch()
    const callOpen = useAppSelector(selectCallDialogOpen)
    const liveCall = useAppSelector(selectLiveCall)
    const [connect, setConnect] = useState(false)
    const [livekitToken, setLivekitToken] = useState("")
    const video = liveCall?.type === "video"

    const onCall = () => {
        setLivekitToken(liveCall?.token ?? "")
        setConnect(true)
    }
    const onEndCall = () => {
        dispatch(setCallDialogOpen(false))
        setConnect(false)
    }

    const onClose = () => dispatch(setCallDialogOpen(false))

    return (
        <Dialog
            open={callOpen}
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
        </Dialog>
    );
};

export default CallDialoag;