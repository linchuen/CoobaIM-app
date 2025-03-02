import type React from "react";
import { useEffect, useState } from "react";
import type {
  Participant,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack} from "livekit-client";
import {
  createLocalTracks,
  Track,
  ConnectionState,
  Room,
  RoomEvent
} from "livekit-client";

const LIVEKIT_URL = "YOUR_LIVEKIT_SERVER_URL";
const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"; // 確保你使用正確的 Access Token

const LiveKitRoom: React.FC = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  useEffect(() => {
    const connectToRoom = async () => {
      const newRoom = new Room();
      setRoom(newRoom);
      
      newRoom.on(RoomEvent.ParticipantConnected, (participant: Participant) => {
        setParticipants((prev) => [...prev, participant as RemoteParticipant]);
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: Participant) => {
        setParticipants((prev) => prev.filter((p) => p.identity !== participant.identity));
      });

      await newRoom.connect(LIVEKIT_URL, ACCESS_TOKEN);
      const tracks = await createLocalTracks({ audio: true, video: true });
      tracks.forEach((track) => newRoom.localParticipant.publishTrack(track));
    };

    connectToRoom();
    return () => {
      room?.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>LiveKit Room</h2>
      <div>
        {participants.map((participant) => (
          <ParticipantView key={participant.identity} participant={participant} />
        ))}
      </div>
    </div>
  );
};

const ParticipantView: React.FC<{ participant: RemoteParticipant }> = ({ participant }) => {
  const [videoTrack, setVideoTrack] = useState<RemoteTrack | null>(null);

  useEffect(() => {
    const handleTrackSubscribed = (track: RemoteTrackPublication, _: RemoteParticipant) => {
      if (track.track?.kind === Track.Kind.Video) {
        setVideoTrack(track.track);
      }
    };

    participant.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => {
      participant.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    };
  }, [participant]);

  return (
    <div>
      <h3>{participant.identity}</h3>
      {videoTrack && <video ref={(ref) => ref && videoTrack.attach(ref)} autoPlay />}
    </div>
  );
};

export default LiveKitRoom;
