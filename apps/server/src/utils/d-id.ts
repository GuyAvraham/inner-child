let pc: RTCPeerConnection | undefined;
let streamId: string | undefined;
let sessionId: string | undefined;

const DID_API_URL = 'https://api.d-id.com';
const DID_API_KEY = process.env.NEXT_PUBLIC_DID_API_KEY;

const maxRetryCount = 3;
const maxDelaySec = 4;

let statsIntervalId: NodeJS.Timeout;
let videoIsPlaying = false;
let lastBytesReceived = 0;

let videoElement: HTMLVideoElement | undefined;

async function fetchWithRetries(url: string | URL | Request, options?: RequestInit | undefined, retries = 1) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= maxRetryCount) {
      const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(`Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`);
      return fetchWithRetries(url, options, retries + 1);
    } else {
      throw new Error(`Max retries exceeded. error: ${err}`);
    }
  }
}

const onIceGatheringStateChange = () => {
  console.log('onIceGatheringStateChange', pc?.iceGatheringState);
};

const onIceCandidate = (ev: RTCPeerConnectionIceEvent) => {
  console.log('onIceCandidate', ev);

  if (ev.candidate) {
    const { candidate, sdpMid, sdpMLineIndex } = ev.candidate;

    // step 3. send our ice server to the server
    void fetch(`${DID_API_URL}/talks/streams/${streamId}/ice`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidate,
        sdpMid,
        sdpMLineIndex,
        session_id: sessionId,
      }),
    });
  }
};

const onIceConnectionStateChange = () => {
  console.log('onIceConnectionStateChange', pc?.iceConnectionState);

  if (pc?.iceConnectionState === 'failed' || pc?.iceConnectionState === 'closed') {
    void destroy();
  }
};

const onConnectionStateChange = () => {
  console.log('onConnectionStateChange', pc?.connectionState);
};

const onSignalingStateChange = () => {
  console.log('onSignalingStateChange', pc?.signalingState);
};

const setVideoElement = (stream?: MediaStream) => {
  if (!stream || !videoElement) return;

  videoElement.srcObject = stream;
  videoElement.loop = false;

  // safari hotfix
  if (videoElement.paused) {
    videoElement
      .play()
      .then((_) => {})
      .catch((e) => {});
  }
};

const playIdleVideo = () => {
  if (!videoElement) return;

  videoElement.srcObject = null;
  videoElement.src = '/idle.mp4';
  videoElement.loop = true;
};

const stopAllStreams = () => {
  if (videoElement?.srcObject) {
    console.log('stopping video streams');
    (videoElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
};

const onVideoStatusChange = (videoIsPlaying: boolean, stream?: MediaStream) => {
  let status;

  if (videoIsPlaying) {
    status = 'streaming';
    const remoteStream = stream;
    setVideoElement(remoteStream);
  } else {
    status = 'empty';
    playIdleVideo();
  }

  console.log('onVideoStatusChange', status);
};

const onTrack = (ev: RTCTrackEvent) => {
  if (!ev.track) return;

  statsIntervalId = setInterval(async () => {
    if (!pc || ev.track.readyState !== 'live') return;

    const stats = await pc.getStats(ev.track);

    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        const videoStatusChanged = videoIsPlaying !== report.bytesReceived > lastBytesReceived;

        if (videoStatusChanged) {
          videoIsPlaying = report.bytesReceived > lastBytesReceived;
          onVideoStatusChange(videoIsPlaying, ev.streams[0]);
        }
        lastBytesReceived = report.bytesReceived;
      }
    });
  }, 500);
};

const destroy = async () => {
  if (!pc) return;

  clearInterval(statsIntervalId);
  stopAllStreams();
  pc.close();

  pc.removeEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
  pc.removeEventListener('icecandidate', onIceCandidate, true);
  pc.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
  pc.removeEventListener('connectionstatechange', onConnectionStateChange, true);
  pc.removeEventListener('signalingstatechange', onSignalingStateChange, true);
  pc.removeEventListener('track', onTrack, true);

  await fetch(`${DID_API_URL}/talks/streams/${streamId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  pc = undefined;
  sessionId = undefined;
  streamId = undefined;
};

const create = async ({ iceServers, offer }: { iceServers: RTCIceServer[]; offer: RTCSessionDescriptionInit }) => {
  if (!pc) {
    pc = new RTCPeerConnection({ iceServers });
    pc.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
    pc.addEventListener('icecandidate', onIceCandidate, true);
    pc.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
    pc.addEventListener('connectionstatechange', onConnectionStateChange, true);
    pc.addEventListener('signalingstatechange', onSignalingStateChange, true);
    pc.addEventListener('track', onTrack, true);
  }

  await pc.setRemoteDescription(offer);
  console.log('set remote sdp OK');

  const sessionClientAnswer = await pc.createAnswer();
  console.log('create local sdp OK');

  await pc.setLocalDescription(sessionClientAnswer);
  console.log('set local sdp OK');

  return sessionClientAnswer;
};

const getDetails = async (face: string) => {
  // Step 1. ask did for webrtc details
  const sessionResponse = await fetch(`${DID_API_URL}/talks/streams`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_url: face,
    }),
  });

  const {
    id: newStreamId,
    offer,
    ice_servers: iceServers,
    session_id: newSessionId,
  } = (await sessionResponse.json()) as {
    id: string;
    session_id: string;
    offer: RTCSessionDescriptionInit;
    ice_servers: RTCIceServer[];
  };

  return {
    newStreamId,
    newSessionId,
    offer,
    iceServers,
  };
};

// TODO: make a post call to generate the idle video from the submitted photo
// TODO: send an empty request every 3-4 minutes after the last user request to keep the connection alive
export const init = async (face: string, outputElement: HTMLVideoElement) => {
  if (pc && pc.connectionState === 'connected') return;

  videoElement = outputElement;

  stopAllStreams();
  await destroy();

  const { iceServers, offer, ...details } = await getDetails(face);
  sessionId = details.newSessionId;
  streamId = details.newStreamId;

  const sessionClientAnswer = await create({ iceServers, offer });

  // Step 2. send answer to the did server
  await fetch(`${DID_API_URL}/talks/streams/${details.newStreamId}/sdp`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      answer: sessionClientAnswer,
      session_id: details.newSessionId,
    }),
  });

  // void sendIdleRequest();
};

export const send = async (input: string) => {
  if (pc && (pc.signalingState === 'stable' || pc.iceConnectionState === 'connected')) {
    await fetchWithRetries(`${DID_API_URL}/talks/streams/${streamId}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input,
          provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
          ssml: 'false',
        },
        config: { fluent: true, pad_audio: 1, stitch: true },
        audio_optimization: '2',
        session_id: sessionId,
      }),
    });
  }
};

const sendIdleRequest = async () => {
  if (pc && (pc.signalingState === 'stable' || pc.iceConnectionState === 'connected')) {
    console.log('sending idle request');
    await fetch(`${DID_API_URL}/talks`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: '<break time="10s"/>',
          provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
          ssml: 'true',
        },
        config: { fluent: true, pad_audio: 1, stitch: true },
        audio_optimization: '2',
        session_id: sessionId,
      }),
    });
  }
};
