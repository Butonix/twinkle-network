import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

CallScreen.propTypes = {
  style: PropTypes.object
};

export default function CallScreen({ style }) {
  const {
    state: { channelOnCall, myStream, peerStream },
    actions: { onShowIncoming }
  } = useChatContext();
  const { userId } = useMyState();
  const isReceivingCall = useMemo(() => {
    return channelOnCall.callerId && channelOnCall.callerId !== userId;
  }, [channelOnCall, userId]);
  const peerVideoRef = useRef(null);
  const myVideoRef = useRef(null);
  const myStreaming = useRef(false);
  const peerStreaming = useRef(false);

  useEffect(() => {
    const videoRef = peerVideoRef.current;
    if (
      channelOnCall.incomingShown &&
      videoRef &&
      peerStream &&
      !peerStreaming.current &&
      !videoRef?.srcObject
    ) {
      videoRef.srcObject = peerStream;
      peerStreaming.current = true;
    }
  }, [peerStream, channelOnCall.incomingShown]);

  useEffect(() => {
    const videoRef = myVideoRef.current;
    if (videoRef && myStream && !myStreaming.current && !videoRef?.srcObject) {
      videoRef.srcObject = myStream;
      videoRef.volume = 0;
      myStreaming.current = true;
    }
  }, [myStream]);

  const calling = useMemo(() => {
    return !channelOnCall.callReceived && channelOnCall.callerId === userId;
  }, [channelOnCall.callReceived, channelOnCall.callerId, userId]);

  return (
    <div style={{ width: '100%', position: 'relative', ...style }}>
      {calling && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Calling...
        </div>
      )}
      {isReceivingCall && !channelOnCall.incomingShown && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button filled color="green">
            <Icon icon="phone-volume" />
            <span style={{ marginLeft: '1rem' }} onClick={handleShowIncoming}>
              Answer
            </span>
          </Button>
        </div>
      )}
      {channelOnCall.incomingShown && peerStream && (
        <video
          style={{
            position: 'absolute',
            width: '40%',
            top: '1.5rem',
            left: '30%'
          }}
          autoPlay
          ref={peerVideoRef}
        />
      )}
      {myStream && (
        <video
          style={{ position: 'absolute', right: 0, bottom: 0, width: '25%' }}
          autoPlay
          ref={myVideoRef}
        />
      )}
    </div>
  );

  function handleShowIncoming() {
    socket.emit('confirm_call_reception', {
      channelId: channelOnCall.id,
      peerId: userId
    });
    onShowIncoming();
  }
}
