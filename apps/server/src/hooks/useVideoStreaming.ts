import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '~/utils/api';
import type { Age } from '~/types';
import useUserData from './useUserData';

const onEvent = (eventType: string) => (event: Event) => {
  console.log(`${eventType}:`, event);
};

export function useVideoStreaming(age: Age) {
  const { data } = useUserData();
  const gender = data.gender as 'male' | 'female';
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [wasStarting, seWasStarting] = useState(false);
  const [isIceConnectionEstablished, setIsIceConnectionEstablished] = useState(false);
  const { data: userPhoto } = api.photo.getByAge.useQuery({ age });
  const { mutateAsync: createStream } = api.conversation.createStream.useMutation();
  const { mutateAsync: sdpResponse } = api.conversation.sdpResponse.useMutation();
  const { mutateAsync: onIceCandidate } = api.conversation.onIceCandidate.useMutation();
  const { mutateAsync: sendMessageToVideoStream } = api.conversation.sendMessageToVideoStream.useMutation();
  const { mutateAsync: closeStream } = api.conversation.closeStream.useMutation();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onIceConnectionStateChange = useCallback((event: Event) => {
    const flag = //@ts-ignore
      event.currentTarget?.iceConnectionState === 'connected' || //@ts-ignore
      event.currentTarget?.iceConnectionState === 'completed';
    setIsIceConnectionEstablished(flag);
    if (flag) {
      seWasStarting(false);
    }
  }, []);

  const onTrack = useCallback((event: RTCTrackEvent) => {
    const remoteStream = event.streams[0];
    if (!remoteStream || !videoRef.current) return;
    videoRef.current.srcObject = remoteStream;

    // safari hotfix
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then((_) => {})
        .catch((e) => {});
    }
  }, []);

  const createPeerConnection = useCallback(
    async (offer: RTCSessionDescriptionInit, iceServers: RTCIceServer[]) => {
      if (!peerConnection.current) {
        peerConnection.current = new RTCPeerConnection({ iceServers });
        // Here we add event listeners for any events we want to handle
        peerConnection.current.addEventListener('icegatheringstatechange', onEvent('iceGatheringStateChange'), true);
        peerConnection.current.addEventListener(
          'icecandidate',
          (event) => void onIceCandidate({ sessionId, event }),
          true,
        );
        peerConnection.current.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
        peerConnection.current.addEventListener('connectionstatechange', onEvent('connectionStateChange'), true);
        peerConnection.current.addEventListener('signalingstatechange', onEvent('signalingStateChange'), true);
        peerConnection.current.addEventListener('track', onTrack, true);
      }

      await peerConnection.current.setRemoteDescription(offer);
      const sessionClientAnswer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(sessionClientAnswer);

      return sessionClientAnswer;
    },
    [onIceCandidate, onIceConnectionStateChange, onTrack, sessionId],
  );

  const startStream = useCallback(async () => {
    console.log('starting stream');
    seWasStarting(true);
    const result = await createStream({ age, gender });
    if (!result) return;
    const { id, session_id, offer, ice_servers } = { ...result };
    const sessionClientAnswer = await createPeerConnection(offer as unknown as RTCSessionDescriptionInit, ice_servers);
    const sdpResult = await sdpResponse({ sessionId: session_id, streamId: id, answer: sessionClientAnswer });
    setSessionId(session_id);
    setStreamId(id);
  }, [age, createPeerConnection, createStream, gender, sdpResponse]);

  const sendStreamMessage = useCallback(
    (text: string) => {
      console.log('sending message', text, { isIceConnectionEstablished, sessionId, streamId, wasStarting });
      if (isIceConnectionEstablished && sessionId && streamId) {
        void sendMessageToVideoStream({
          gender,
          age,
          sessionId,
          streamId,
          message: text,
        });
      } else if (!wasStarting) {
        void startStream();
      }
    },
    [age, gender, isIceConnectionEstablished, sendMessageToVideoStream, sessionId, startStream, streamId, wasStarting],
  );

  const endStream = useCallback(() => {
    if (!peerConnection.current) return;
    console.log('stopping peer connection');
    peerConnection.current.close();
    peerConnection.current.removeEventListener('icegatheringstatechange', onEvent('iceGatheringStateChange'), true);
    peerConnection.current.removeEventListener('icecandidate', onEvent('iceCandidate'), true);
    peerConnection.current.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
    peerConnection.current.removeEventListener('connectionstatechange', onEvent('connectionStateChange'), true);
    peerConnection.current.removeEventListener('signalingstatechange', onEvent('signalingStateChange'), true);
    peerConnection.current.removeEventListener('track', onTrack, true);
    setSessionId(null);
    setStreamId(null);
    setIsIceConnectionEstablished(false);
    peerConnection.current = null;
    console.log('stopped peer connection');
    if (sessionId && streamId) {
      void closeStream({ sessionId, streamId });
    }
  }, [closeStream, onIceConnectionStateChange, onTrack, sessionId, streamId]);

  useEffect(() => {
    if (!userPhoto) return;
  }, [userPhoto]);

  return { sendStreamMessage, endStream, videoRef };
}
